# البرومبت الرئيسي — بناء موقع "أبو أصالة للدهانات والديكور"

> ملاحظة لأي نموذج/Agent هيشتغل على هذا الملف: ده Spec تنفيذي كامل، مش بريف تسويقي.
> نفّذ حرفيًا. لو فيه تعارض بين هذا الملف وأي افتراض افتراضي عندك (زي استخدام
> Server Components العادي بدل الـ caching المطلوب هنا)، الأولوية لِما هو مكتوب هنا.
> اقرأ أيضًا REQUIREMENTS.md و schema.prisma و SPECKIT.md المرفقين قبل ما تبدأ.

## 0. السياق التجاري

- العميل: "أبو أصالة للدهانات والديكور" — معلم/شركة دهانات وديكورات في الرياض، السعودية.
- المرجعية البصرية المطلوبة: Algedra، Antonovich Design، CK Architecture (دبي) — **مش** مواقع المنافسين المحليين الضعيفة (حشو كلمات، ووردبريس جاهز، مفيش نظام حجز حقيقي).
- نوع الموقع: **Service/Portfolio + Lead Generation** — لا يوجد بيع أونلاين، لا سلة، لا دفع. التحويل = فورم طلب عرض سعر + واتساب مباشر.
- رقم واتساب العمل: `+966553588708` (استخدمه من env، مش هارد كود — التفاصيل تحت).
- مفيش سوشيال ميديا للعميل غير إنستجرام: `https://www.instagram.com/ssalmalbkhyty/`
- الموقع مش لشركة عندها موقع فعلي يُزار، فـ **مفيش خريطة Google Maps** في صفحة اتصل بنا — بس فورم + واتساب + ساعات العمل.

## 1. Stack (إلزامي)

| الطبقة | الاختيار |
|---|---|
| Framework | Next.js (App Router), TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL + Prisma ORM (استخدم `schema.prisma` المرفق كما هو، ما تضيفش موديلات ecommerce تاني) |
| Auth | NextAuth v5، Credentials provider بس، **JWT session strategy** (مش Database session — عشان كده الـ schema مفيهوش Account/Session). أدمن واحد بس محفوظ في `AdminUser`، مفيش تسجيل عام. |
| صور وفيديو | Cloudinary، `f_auto,q_auto` لكل صورة، فيديو الهيرو عبر Cloudinary video transformation مضغوط (تفاصيل قسم 9) |
| Forms | react-hook-form + Zod |
| رندر | راجع قسم "استراتيجية الكاش" (قسم 4) — الأولوية لتعليماته الصريحة |
| Hosting | Vercel |
| Analytics | GA4 + Google Ads Conversion Tag + Google Search Console |
| محرر المدونة | Tiptap v3 (زي ما هو، من غير أي تغيير في الفلسفة) |

## 2. بنية المجلدات

```
/app
  /(marketing)
    /page.tsx                          → الرئيسية
    /خدمات/page.tsx                    → فهرس الخدمات
    /خدمات/[slug]/page.tsx             → صفحة خدمة مفردة
    /اعمالنا/page.tsx                  → معرض الأعمال
    /اعمالنا/[slug]/page.tsx           → مشروع مفرد (Case Study)
    /مناطق/[city-slug]/page.tsx        → صفحات المناطق (Local SEO)
    /المدونة/page.tsx
    /المدونة/[slug]/page.tsx
    /من-نحن/page.tsx
    /اتصل-بنا/page.tsx
    /الأسئلة-الشائعة/page.tsx
    /سياسة-الخصوصية/page.tsx
    /الشروط-والأحكام/page.tsx
  /admin (protected بالكامل، middleware يمنع أي وصول من غير جلسة أدمن صالحة)
    /login/page.tsx
    /dashboard/page.tsx
    /categories/page.tsx               → إضافة/تعديل قسم رئيسي وفرعي
    /services/page.tsx + /services/new/page.tsx + /services/[id]/edit/page.tsx
    /projects/page.tsx + /projects/new/page.tsx + /projects/[id]/edit/page.tsx   (ده اللي كنت سايبه "منتج")
    /blog/page.tsx + /blog/new/page.tsx + /blog/[id]/edit/page.tsx
    /areas/page.tsx  (CRUD مناطق)
    /quotes/page.tsx  (عرض طلبات عروض الأسعار الواردة)
    /testimonials/page.tsx
    /settings/page.tsx  (SiteSettings)
  /api
    /auth/[...nextauth]/route.ts
    /categories/route.ts + /categories/[id]/route.ts
    /services/route.ts + /services/[id]/route.ts
    /projects/route.ts + /projects/[id]/route.ts
    /areas/route.ts + /areas/[id]/route.ts
    /blog/route.ts + /blog/[id]/route.ts
    /faqs/route.ts + /faqs/[id]/route.ts
    /testimonials/route.ts + /testimonials/[id]/route.ts
    /quote-request/route.ts        → POST بس (فورم عام) + GET/PATCH محمي للأدمن
    /whatsapp-conversion/route.ts   → لتسجيل Conversion Event لجوجل أدز
sitemap.ts
robots.ts
```

كل route تحت `/api/*` (ما عدا `POST /api/quote-request` العام) لازم يتحقق من جلسة الأدمن قبل أي `POST/PATCH/DELETE`. اعمل CRUD كامل (Create/Read/Update/Delete) لكل مورد مذكور فوق، بـ validation عبر Zod على كل input.

## 3. أهم قاعدة تقنية: **ترميز الروابط العربية**

هذا الموقع بالكامل بروابط عربية (`/خدمات/دهانات-داخلية-الرياض` إلخ). أي خطأ في الترميز هيكسر التوجيه بالكامل. اتبع هذا حرفيًا:

1. **الـ slug المخزّن في قاعدة البيانات لازم يكون نص عربي خام (Unicode)** — مش Percent-Encoded، ومن غير Tashkeel، ومسافات مُستبدلة بـ `-`. اعمل دالة `slugify(ar)` مركزية تُستخدم في كل مكان بيتولد فيه slug (مش تكتب `encodeURIComponent` وتخزنها).
2. **App Router بيدي لك `params.slug` مفكوك (decoded) تلقائيًا** — يعني متعملش `decodeURIComponent` تاني عليه، ده هيسبب Double-Decoding ويبوظ أي حرف فيه `%`. لو عايز تتأكد، اطبعه في التطوير وقارنه بالـ DB مباشرة.
3. **لما تبني أي `href`**، استخدم `next/link` مباشرة بالنص العربي الخام (`<Link href={`/خدمات/${service.slug}`}>`) — Next بيتكفل بالترميز الصحيح وقت الرندر. **ممنوع تعمل `encodeURIComponent` يدوي على الـ href قبل ما تحطه في Link**، ده هيرمز مرتين.
4. **في `sitemap.ts`**: لازم كل `loc` يكون URI صالح — استخدم `new URL(path, BASE_URL).toString()` (الـ URL constructor بيرمّز صح مرة واحدة بس). متكتبش الرابط العربي كنص خام جوه XML.
5. **في `generateMetadata` / `alternates.canonical`**: استخدم نفس منطق `new URL()`، ومتخليش canonical يختلف عن اللي في sitemap ولا اللي في href الفعلي (حتى لو الاختلاف Percent-encoding بسيط) — جوجل بيتعامل معاهم كصفحتين مختلفتين لو مش متطابقين حرفيًا.
6. اعمل اختبار يدوي واحد على الأقل لصفحة فيها اسم خدمة بمسافة وهمزة (زي "دهانات-فيلا-كاملة") تأكد إنه بيفتح، بيتعمله revalidate صح، وموجود في sitemap بشكل صحيح.

## 4. استراتيجية الكاش (SSR + Revalidate — إلزامي لكل الصفحات الديناميكية من DB)

مطلوب صراحةً: **SSR مع `revalidate = 86400`**، مع `unstable_cache` و`revalidateTag` لكل جلب بيانات من DB. طبّق كالتالي:

```ts
// lib/data/services.ts
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.service.findUnique({
      where: { slug, isActive: true },
      include: { faqs: true, category: true },
    });
  },
  ["service-by-slug"],
  { tags: ["services"], revalidate: 86400 }
);
```

وفي الصفحة نفسها:

```ts
export const revalidate = 86400; // fallback على مستوى الـ segment كمان
```

**عند أي تعديل/إضافة/حذف من الأدمن (API routes)**: نادِ `revalidateTag("services")` (أو التاج المناسب: `"projects"`, `"areas"`, `"blog"`, `"faqs"`, `"testimonials"`) فورًا بعد نجاح العملية، عشان المحتوى يتحدّث فورًا للزوار من غير ما تستنى الـ 24 ساعة. كل موديل له tag خاص بيه، وبعض الصفحات (زي صفحة خدمة مفردة اللي بتعرض FAQ ومشاريع مرتبطة) محتاجة تنادي أكتر من tag لو اتغيرت.

الصفحة الرئيسية والصفحات الثابتة (من نحن، سياسة الخصوصية) ممكن تكون SSG عادي بدون DB fetch متكرر لو المحتوى فيها ثابت غالبًا، لكن أي حتة بتجيب بيانات حية (مشاريع مميزة، آخر المقالات) تتبع نفس نمط `unstable_cache` + tag.

## 5. متغيرات البيئة (كل الأسرار من env، من غير أي هارد كود)

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_BASE_URL=https://your-domain.com     ← يُستخدم لبناء كل canonical/OG/sitemap
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_WHATSAPP_NUMBER=+966553588708
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=
GOOGLE_ADS_CONVERSION_LABEL=
ADMIN_SEED_EMAIL=            ← يُستخدم مرة واحدة في seed script لإنشاء أول AdminUser
ADMIN_SEED_PASSWORD=
```

استخدم `NEXT_PUBLIC_BASE_URL` كمصدر واحد في `lib/constants.ts` (`export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!`) وابني منه كل `canonical` و`Open Graph url` و`sitemap loc` — ممنوع أي دومين هارد كود في أي ملف.

## 6. نظام الهوية البصرية

**الفلسفة**: فخامة minimal، مساحات بيضاء كبيرة، صور تتنفس، لا ازدحام بصري، حركة ناعمة بدل الجمود. **تجنب البني/الذهبي التقليدي المستهلك في كل مواقع الديكور العربية.**

المتغيرات (مصدر واحد في `globals.css`، ممنوع تكرارها Hardcoded في أي مكون):

```css
--surface: #ffffff;
--bg: #f7f6f4;
--bg-deep: #f0eee9;
--text-1: #1a1a1a;
--text-2: #4a4a45;
--text-3: #8a8880;
--accent: #2b2b28;       /* أسود دافئ بدل الذهبي التقليدي */
--accent-warm: #a67c52;  /* لمسة واحدة فقط، مش استخدام مكثف */
--border: rgba(26,26,26,.08);
--shadow-sm: 0 1px 2px rgba(0,0,0,.04), 0 1px 3px rgba(0,0,0,.06);
--shadow-md: 0 4px 6px rgba(0,0,0,.05), 0 10px 15px rgba(0,0,0,.08);
```

**الطباعة**: خط عربي احترافي (IBM Plex Sans Arabic أو Almarai أو Cairo) — وزن أثقل للعناوين، أخف للنصوص. `line-height: 1.7+` للفقرات العربية. RTL كامل — تأكد إن كل الأسهم/السلايدرات/الأيقونات الاتجاهية معكوسة صح (استخدم `rtl:` variants في Tailwind أو `[dir=rtl]` selectors، ومتعتمدش على transform يدوي منسي).

**الحركة (مهم جدًا — القاعدة اللي طلبتها بالحرف: "ميضيفش انميشن مبتذلة")**:
- استخدم Framer Motion لكن بحركات مقصودة وواضحة الغرض، مش زخرفة عشوائية.
- المسموح: fade+slide بسيط (`opacity + y: 20→0`)، staggered reveal للبطاقات عند الدخول في viewport، hover scale خفيف جدًا (1.02-1.03) على البطاقات، underline/expand ناعم على الروابط، parallax خفيف جدًا للصور الكبيرة (مش أكتر من 10-15% إزاحة).
- **الممنوع**: bounce الزنبركي المبالغ فيه، spin/rotate بلا سبب، gradient نص متحرك بألوان قوس قزح، confetti، اهتزاز الأزرار، أي حركة أطول من 400ms على تفاعل مستخدم مباشر (hover/click).
- Scroll reveal بسيط للأقسام (IntersectionObserver + fade/slide مرة واحدة بس، مش loop).
- كل الانتقالات 200-400ms، `ease-out`.

## 7. مكونات مطلوبة

Header (sticky، لوجو، قائمة **Dropdown** — على الموبايل لازم تفتح بالنقر مش بالـ hover، كل الروابط من قاعدة البيانات مش هارد كود)، Footer (قسم 10)، Hero (فيديو خلفية + عنوان + CTA مزدوج)، ServiceCard، PortfolioGrid (فلاتر نوع مكان × نوع خدمة)، BeforeAfterSlider (drag تفاعلي)، TestimonialCarousel، QuoteForm، WhatsAppFloatingButton (ثابت، رسالة مُعبّأة مسبقًا تختلف حسب الصفحة الحالية)، FAQAccordion (يغذي FAQPage schema)، TrustBadges (سنين خبرة / عدد مشاريع — من SiteSettings)، Breadcrumb (يغذي BreadcrumbList schema)، StickyMobileCTA.

## 8. الصفحة الرئيسية (بنيتها مقترحة مني — عدّل حسب ذوقك)

1. Hero: فيديو خلفية (قسم 9) + عنوان قوي + CTA مزدوج ("اطلب عرض سعر" / "واتساب فوري")
2. TrustBadges شريط رفيع تحت الهيرو مباشرة
3. قسم الخدمات: بطاقات بهوية بصرية لافتة فعلاً (مش قوالب Tailwind الافتراضية) — كل بطاقة تربط لصفحة الخدمة المفردة، مع hover تفاعلي واضح
4. قسم "أعمالنا": 6-8 مشاريع (`isFeatured: true`) + رابط لمعرض الأعمال الكامل
5. قسم شهادات العملاء (يظهر فقط لو فيه `Testimonial` بـ `isPublished: true` — لو الجدول فاضي، اخفِ القسم بالكامل بدل ما تعرض بيانات وهمية، راجع قسم 12)
6. قسم تغطية المناطق (روابط سريعة لأهم 4-6 صفحات مناطق)
7. تيزر أحدث 3 مقالات من المدونة
8. فورم طلب عرض سعر مدمج قبل الفوتر
9. WhatsAppFloatingButton ثابت في كل الصفحات

## 9. الفيديو (فيديو أبو أصالة وهو شغال)

الرابط:
```
https://res.cloudinary.com/dfhecwiib/video/upload/v1783957144/AQOZrHokhtHWfh51Dm_F768X4SoPQLbmmLFE67wgwQaKdnu2eibOhA6BWWHTbjDsc4lK4FRwczhl2-DYZC21w2JsHZACSYSjEgrCbVk_online-video-cutter.com_online-video-cutter.com_itxny0.mp4
```

الحجم الحالي كبير — لازم يتحمل Lazy عشان السرعة (LCP). طبّق:
- استخدم Cloudinary transformation في الرابط نفسه: `q_auto,f_auto` (ولو ممكن `w_1280` لأنه فيديو خلفية مش محتاج 4K) بدل الرابط الخام.
- لا تحمّل الفيديو أبدًا بشكل مباشر في الـ initial HTML. استخدم `poster` image (صورة ثابتة عالية الجودة من نفس المشهد) تظهر فورًا، وحمّل الفيديو نفسه عبر IntersectionObserver لما الـ Hero يدخل الشاشة، أو بعد `requestIdleCallback`/بعد أول تفاعل.
- `preload="none"`، `muted`, `playsInline`, `loop`.
- كل فيديوهات تانية في الموقع (لو أضيفت لمشاريع المعرض) بنفس المنطق: lazy + poster + Cloudinary optimized.

## 10. الفوتر

- لوجو الموقع
- روابط متداخلة: الخدمات (كل خدمة)، المناطق، من نحن، اتصل بنا، الأسئلة الشائعة، سياسة الخصوصية، الشروط والأحكام
- أيقونة إنستجرام بس (مفيش سوشيال ميديا تانية)
- سطر: **Powered by Ibrahim Abouzaid** يربط لـ `https://protofolio-smoky.vercel.app/en`

## 11. صفحة المشروع المفرد (Case Study) — تفاصيل بصرية

- BeforeAfterSlider بحركة سلسة فعلاً (drag محسوب بـ pointer events، مش CSS hover بسيط) — لو المشروع مفيهوش صور قبل/بعد حقيقية، اعرض معرض صور عادي عالي الجودة بدل ما تجبر Slider فاضي.
- استخدم `next/image` بأعلى جودة متاحة من Cloudinary (`q_auto:best` أو تحديد جودة صريحة لصور المعرض تحديدًا، بعكس الصور العادية في الموقع اللي ممكن تكون `q_auto` عادي) لأن هذه الصور هي أقوى دليل بصري للتحويل.
- Lightbox للتكبير (`yet-another-react-lightbox` موجودة بالفعل في المشروع القديم لو عايز تعيد استخدامها).

## 12. قاعدة صارمة بخصوص الشهادات/التقييمات

**لن نضيف تقييمات وهمية منسوبة لعملاء غير حقيقيين.** لو `Testimonial` فاضية، اخفِ القسم بالكامل من الواجهة بدل ما تظهر بيانات مصطنعة. التفاصيل والسبب في REQUIREMENTS.md قسم "قرارات مقصودة".

## 13. SEO التقني — Schema.org

طبّق كل الـ JSON-LD المذكورة في السبك الأصلي (LocalBusiness/HomeAndConstructionBusiness في الـ layout، Service + BreadcrumbList + FAQPage في كل صفحة خدمة، Article/BlogPosting في كل مقال، ImageObject لكل صورة رئيسية في المعرض، FAQPage في صفحة الأسئلة الشائعة المجمّعة). حطها داخل الصفحة نفسها عبر:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
/>
```

تحقق بعد كل نشر عبر Google Rich Results Test. Metadata فريد لكل صفحة (title 50-60 حرف، description 140-160 حرف)، `alternates.canonical` مبني من `BASE_URL`، Open Graph كامل، **بدون Twitter Card** (العميل مفيهوش تويتر/X).

## 14. الأداء والقبول

Lighthouse Performance ≥ 95 (موبايل) + Accessibility، LCP < 2.5s، CLS < 0.1، INP < 200ms، كل صورة بـ alt حقيقي وصفي، `next/image` إجباري، الموقع متجاوب 100% على الموبايل، Internal linking فعلي بين خدمة↔منطقة↔مقال، Breadcrumb ظاهر، مفيش نص مكرر حرفيًا بين صفحتين.

## 15. خريطة سريعة لاستراتيجيات SEO/النمو (مرجع، تفاصيل التنفيذ في SPECKIT.md)

القائمة الطويلة اللي بعتها (Keyword Research → Franchise SEO) مقسّمة في SPECKIT.md لمجموعات، كل مجموعة موضّح جنبها فين بالظبط بتتنفذ في هذا الـ Spec (schema markup، صفحات المناطق، الربط الداخلي، إلخ)، وإيه اللي هو نشاط تسويقي مستمر بعد الإطلاق مش جزء من بناء الموقع نفسه (Backlink outreach، Digital PR، Editorial calendar شهري، إلخ) — متحاولش "تنفذ" الجزء التسويقي المستمر ده كـ كود، ده عمل بعد الإطلاق.

---
راجع REQUIREMENTS.md لتفاصيل كل صفحة كـ Functional Requirements، و SPECKIT.md للخطة التقنية والـ Tasks المرتبة.
