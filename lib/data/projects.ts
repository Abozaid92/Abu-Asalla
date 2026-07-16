import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const projectTypeLabels: Record<string, string> = {
  VILLA: "فيلا",
  APARTMENT: "شقة",
  OFFICE: "مكتب",
  COMMERCIAL: "تجاري",
  OTHER: "أخرى",
};

export const getFeaturedProjects = unstable_cache(
  async (limit = 8) => {
    return prisma.project.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
  ["projects:featured"],
  { tags: ["projects"] }
);

export const getAllProjects = unstable_cache(
  async () => {
    return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  },
  ["projects:all"],
  { tags: ["projects"] }
);

export const getBeforeAfterProjects = unstable_cache(
  async (limit = 6) => {
    return prisma.project.findMany({
      where: { beforeImage: { not: null }, afterImage: { not: null } },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
  ["projects:beforeAfter"],
  { tags: ["projects"] }
);

export const getProjectSlugs = unstable_cache(
  async () => {
    const rows = await prisma.project.findMany({ select: { slug: true } });
    return rows.map((r) => r.slug);
  },
  ["projects:slugs"],
  { tags: ["projects"] }
);

export const getProjectBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.project.findUnique({
      where: { slug },
      include: { service: true, area: true },
    });
  },
  ["projects:bySlug"],
  { tags: ["projects"] }
);
