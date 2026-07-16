import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getActiveServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        heroImage: true,
        priceNote: true,
      },
    });
  },
  ["services:list"],
  { tags: ["services"] }
);

export const getServiceSlugs = unstable_cache(
  async () => {
    const rows = await prisma.service.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  },
  ["services:slugs"],
  { tags: ["services"] }
);

export const getServiceBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.service.findFirst({
      where: { slug, isActive: true },
      include: {
        faqs: { orderBy: { order: "asc" } },
        testimonials: { where: { isPublished: true } },
      },
    });
  },
  ["services:bySlug"],
  { tags: ["services"] }
);
