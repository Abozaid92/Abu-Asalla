import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const getGeneralFaqs = unstable_cache(
  async () => {
    return prisma.faq.findMany({
      where: { scope: "GENERAL" },
      orderBy: { order: "asc" },
    });
  },
  ["faqs:general"],
  { tags: ["faqs"] }
);

export const getFaqsForService = unstable_cache(
  async (serviceId: string) => {
    return prisma.faq.findMany({
      where: { serviceId },
      orderBy: { order: "asc" },
    });
  },
  ["faqs:byService"],
  { tags: ["faqs"] }
);
