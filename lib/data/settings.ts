import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

const DEFAULT_SETTINGS = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "966553588708",
  instagramUrl: "https://www.instagram.com/ssalmalbkhyty/",
  heroVideoUrl: null as string | null,
  yearsExperience: null as number | null,
  projectsCount: null as number | null,
  workingHours: null as string | null,
};

// السطر ده singleton (id ثابت = 1). لو الصف لسه مش موجود في قاعدة البيانات
// (قبل أول seed) بنرجع قيم افتراضية بدل ما نكسر الصفحة.
export const getSiteSettings = unstable_cache(
  async () => {
    const row = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    return row ?? { id: 1, updatedAt: new Date(), ...DEFAULT_SETTINGS };
  },
  ["settings:singleton"],
  { tags: ["settings"] }
);
