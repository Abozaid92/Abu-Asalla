// المسار: app/api/admin/seed-projects/route.ts
//
// إيه اللي بيعمله:
// بيقرأ ملف instagram-projects.json (البيانات اللي بعتها من انستجرام) وبيحوله
// لصفوف Project حقيقية في قاعدة البيانات، مع تنظيف العنوان من أي رموز غريبة
// (#, underscores بتبقى مسافات، أرقام تليفون مبعثرة، أسطر جديدة) وتصفية أي عنصر
// معندوش صور خالص.
//
// ليه GET؟ عشان تقدر تضربه من المتصفح زي ما طلبت. لكن كتابة في قاعدة البيانات
// عن طريق GET حاجة خطرة لو اتسابت مكشوفة (أي حد/بوت/برنامج Prefetch ممكن
// يشغّلها من غير قصد) — فحطيت حماية بسيطة: لازم تبعت ?secret=... في الرابط
// يطابق SEED_SECRET في env. وخليتها Idempotent (بتتجاهل أي عنصر اتستورد قبل
// كده عن طريق التحقق من sourceUrl) عشان لو ضغطت الرابط غلط مرتين مش هتتكرر
// المشاريع.
//
// طريقة الاستخدام:
//   https://your-domain.com/api/admin/seed-projects?secret=YOUR_SEED_SECRET
//
// بعد ما تخلص استيراد، احذف الراوت ده أو امسح SEED_SECRET من env، مش محتاج
// يفضل شغال بعد أول استيراد.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import instagramProjects from "@/lib/seed-data/instagram-projects.json";

type InstagramItem = {
  title: string;
  description: string;
  main_image: string;
  gallery_image_1: string;
  gallery_image_2: string;
  gallery_image_3: string;
  gallery_image_4: string;
  gallery_image_5: string;
  metadata: { original_type: string; source_url: string };
};

// بيشيل الهاشتاجات (#كلمة)، الأندرسكور (بيتحول لمسافة)، أرقام التليفون،
// الأسطر الجديدة، والمسافات الزيادة. مبيعملش إعادة صياغة للعنوان — بس تنظيف
// الرموز زي ما طلبت بالظبط.
function cleanTitle(raw: string): string {
  return raw
    .replace(/#/g, " ") // شيل علامة الهاشتاج نفسها
    .replace(/_/g, " ") // حوّل الأندرسكور بين كلمات الهاشتاج لمسافة عادية
    .replace(/\n/g, " ") // شيل أسطر جديدة
    .replace(/\+?\d{9,}/g, "") // شيل أي رقم تليفون طويل مبعثر جوه العنوان
    .replace(/\s{2,}/g, " ") // اطوي المسافات الزيادة
    .trim();
}

function collectGallery(item: InstagramItem): string[] {
  return [
    item.main_image,
    item.gallery_image_1,
    item.gallery_image_2,
    item.gallery_image_3,
    item.gallery_image_4,
    item.gallery_image_5,
  ].filter((url) => Boolean(url && url.trim().length > 0));
}

function slugify(ar: string, fallback: string): string {
  const base = ar
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, "") // سيب العربي/الإنجليزي/الأرقام بس
    .trim()
    .replace(/\s+/g, "-");
  return base.length > 0 ? base : fallback;
}

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const items = instagramProjects as InstagramItem[];

  const created: string[] = [];
  const skippedNoImage: string[] = [];
  const skippedExisting: string[] = [];

  for (const [index, item] of items.entries()) {
    const gallery = collectGallery(item);
    const sourceUrl = item.metadata?.source_url;

    // متعملش مشروع بدون ولا صورة واحدة — مفيش فايدة منه في المعرض
    if (gallery.length === 0) {
      skippedNoImage.push(sourceUrl ?? `index-${index}`);
      continue;
    }

    // تجاهل لو اتستورد قبل كده (idempotent)
    if (sourceUrl) {
      const existing = await prisma.project.findUnique({ where: { sourceUrl } });
      if (existing) {
        skippedExisting.push(sourceUrl);
        continue;
      }
    }

    const cleanedTitle = cleanTitle(item.title) || `عمل منفذ ${index + 1}`;
    const slugBase = slugify(cleanedTitle, `project-${index + 1}`);

    // تأكد إن الـ slug فريد لو فيه تكرار (عناوين Instagram كتير متشابهة)
    let slug = slugBase;
    let suffix = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      suffix += 1;
      slug = `${slugBase}-${suffix}`;
    }

    await prisma.project.create({
      data: {
        title: cleanedTitle,
        slug,
        projectType: "OTHER", // مش مصنّف؛ الأدمن يحدد النوع الفعلي (فيلا/شقة/مكتب/تجاري) يدويًا بعدين
        gallery,
        sourceUrl: sourceUrl ?? null,
        // ملاحظة: العناوين الأصلية من Instagram مكررة وضعيفة كنص تسويقي (كابشن
        // مقتطع بـ32 حرف من انستجرام). يفضل الأدمن يراجع العناوين يدويًا بعد
        // الاستيراد ويكتبها بشكل أقوى للـ SEO — الراوت ده مبيخترعش عناوين
        // جديدة، بينظف الموجود بس زي ما طلبت بالظبط.
      },
    });

    created.push(slug);
  }

  revalidateTag("projects");

  return NextResponse.json({
    createdCount: created.length,
    created,
    skippedNoImageCount: skippedNoImage.length,
    skippedExistingCount: skippedExisting.length,
  });
}
