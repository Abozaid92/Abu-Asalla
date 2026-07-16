import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getPublishedPosts = unstable_cache(
  async () => {
    return prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    });
  },
  ["blog:published"],
  { tags: ["blog"] }
);

export const getPostSlugs = unstable_cache(
  async () => {
    const rows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
  ["blog:slugs"],
  { tags: ["blog"] }
);

export const getPostBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: { category: true, tags: true },
    });
  },
  ["blog:bySlug"],
  { tags: ["blog"] }
);
