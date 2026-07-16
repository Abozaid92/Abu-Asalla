import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getPublishedTestimonials = unstable_cache(
  async (limit = 6) => {
    return prisma.testimonial.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
  ["testimonials:published"],
  { tags: ["testimonials"] }
);
