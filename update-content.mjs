// سكريبت لتحديث حقل content لخدمات أبو أصالة من ملف content-data.json
// التشغيل: node update-content.mjs
// تجربة بدون تعديل فعلي: DRY_RUN=1 node update-content.mjs

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const DRY_RUN = process.env.DRY_RUN === "1";

async function main() {
  const dataPath = join(__dirname, "content-data.json");
  const contentMap = JSON.parse(readFileSync(dataPath, "utf-8"));
  const ids = Object.keys(contentMap);

  console.log(`هحدث ${ids.length} خدمة${DRY_RUN ? " (وضع تجربة - DRY_RUN، مفيش تعديل فعلي)" : ""}`);
  console.log("");

  let ok = 0;
  let fail = 0;

  for (const id of ids) {
    const content = contentMap[id];
    try {
      const service = await prisma.service.findUnique({ where: { id } });
      if (!service) {
        console.log(`تخطي: ${id} (مش موجود في الداتابيز)`);
        fail++;
        continue;
      }

      const words = content.split(/\s+/).filter(Boolean).length;

      if (!DRY_RUN) {
        await prisma.service.update({
          where: { id },
          data: { content },
        });
      }

      console.log(`تم: ${service.name} (${words} كلمة)`);
      ok++;
    } catch (err) {
      console.log(`فشل: ${id} - ${err.message}`);
      fail++;
    }
  }

  console.log("");
  console.log(`النتيجة: ${ok} تم، ${fail} فشل`);

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error("خطأ عام:", err);
  await prisma.$disconnect();
  process.exit(1);
});
