// ============================================================
// apply-content-blocks.ts
// بياخد ناتج parse-service-content.ts (فيه contentBlocks لكل عنصر)
// ويعمل update لحقل contentBlocks بس في الداتابيز — عمرو ما بيلمس content
// شرط: كل عنصر لازم يكون فيه "slug" (أو "id") عشان نعرف نربطه بالسطر الصح
// ============================================================

import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_R2xg7KkdfMrn@ep-lucky-fog-adhzz89s-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    },
  },
});

async function main() {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error(
      "usage: npx tsx apply-content-blocks.ts <parsed-output.json>",
    );
    process.exit(1);
  }

  const items: any[] = JSON.parse(
    fs.readFileSync(path.resolve(inputPath), "utf-8"),
  );

  let done = 0;
  let skipped = 0;

  for (const item of items) {
    if (!item.contentBlocks) {
      console.warn("تخطي عنصر بدون contentBlocks");
      skipped++;
      continue;
    }
    if (!item.slug && !item.id) {
      console.warn("تخطي عنصر بدون slug أو id — مينفعش نحدد الصف في الداتابيز");
      skipped++;
      continue;
    }

    const where = item.id ? { id: item.id } : { slug: item.slug };

    try {
      await prisma.service.update({
        where,
        data: { contentBlocks: item.contentBlocks },
      });
      done++;
      console.log(`تم: ${item.slug ?? item.id}`);
    } catch (err) {
      console.error(
        `فشل: ${item.slug ?? item.id}`,
        err instanceof Error ? err.message : err,
      );
      skipped++;
    }
  }

  console.log(`\nالنتيجة: ${done} تم، ${skipped} اتخطى`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
