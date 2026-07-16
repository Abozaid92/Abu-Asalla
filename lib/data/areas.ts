import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getAllAreas = unstable_cache(
  async () => {
    return prisma.area.findMany({ orderBy: { name: "asc" } });
  },
  ["areas:all"],
  { tags: ["areas"] }
);

export const getAreaSlugs = unstable_cache(
  async () => {
    const rows = await prisma.area.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["areas:slugs"],
  { tags: ["areas"] }
);

export const getAreaBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.area.findUnique({
      where: { slug },
      include: { projects: { take: 6, orderBy: { createdAt: "desc" } } },
    });
  },
  ["areas:bySlug"],
  { tags: ["areas"] }
);
