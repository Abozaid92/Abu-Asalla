import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// راجع تعليق _shared.ts: المدونة مؤجلة عن المسار العام /api/admin/[resource]
// لأنها محتاجة authorId من الجلسة تلقائيًا + تحويل محتوى بسيط لـ Json (Tiptap
// doc) بدل ما تتبعت خام. لسه من غير تنقية HTML كاملة (sanitize)، فالمحتوى
// بيتخزن كنص عادي في contentHtml — لو هتضيف محرر Tiptap حقيقي لاحقًا، أضف
// تنقية (DOMPurify/rehype-sanitize) قبل الحفظ هنا.

const blogSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().optional().nullable(),
  contentHtml: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).default("DRAFT"),
});

function wordsPerMinute(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } }, category: true },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const parsed = blogSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { contentHtml, status, ...rest } = parsed.data;

  const post = await prisma.blogPost.create({
    data: {
      ...rest,
      contentHtml,
      content: { type: "doc", html: contentHtml },
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      readingTime: wordsPerMinute(contentHtml),
      authorId: session.user.id,
      activityLogs: {
        create: { action: "CREATED", adminId: session.user.id },
      },
    },
  });

  revalidateTag("blog");
  return NextResponse.json(post, { status: 201 });
}
