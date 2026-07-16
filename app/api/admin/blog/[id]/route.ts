import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const blogPatchSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  excerpt: z.string().optional().nullable(),
  contentHtml: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  keywords: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED", "ARCHIVED"]).optional(),
});

function wordsPerMinute(html: string) {
  const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 180));
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  return NextResponse.json(post);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;

  const parsed = blogPatchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { contentHtml, status, ...rest } = parsed.data;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const wasPublished = existing?.status === "PUBLISHED";
  const nowPublishing = status === "PUBLISHED" && !wasPublished;

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      ...(contentHtml
        ? { contentHtml, content: { type: "doc", html: contentHtml }, readingTime: wordsPerMinute(contentHtml) }
        : {}),
      ...(status ? { status } : {}),
      ...(nowPublishing ? { publishedAt: new Date() } : {}),
      activityLogs: {
        create: { action: nowPublishing ? "PUBLISHED" : "UPDATED", adminId: session.user.id },
      },
    },
  });

  revalidateTag("blog");
  return NextResponse.json(post);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  revalidateTag("blog");
  return new NextResponse(null, { status: 204 });
}
