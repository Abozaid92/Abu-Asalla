// ============================================================
// parse-service-content.ts
// يحول حقل content الخام (نص طويل بفواصل \n) لمصفوفة أقسام
// structured (JSON) عشان نخزنها في حقل جديد contentBlocks
// ما بيلمسش حقل content الأصلي أبداً - بيقرأه بس.
// ============================================================

import fs from "node:fs";
import path from "node:path";

// ---------- Types ----------

type Section =
  | { type: "intro"; text: string }
  | { type: "list_cards"; title: string; items: { title: string; text: string }[] }
  | { type: "steps"; title: string; items: { text: string }[] }
  | { type: "tips"; title: string; items: string[] }
  | { type: "pricing_table"; title: string; rows: { item: string; price: string }[]; note?: string }
  | { type: "why_us"; title: string; paragraphs: string[] }
  | { type: "cta"; text: string }
  | { type: "related_services"; text: string; links: { label: string; href: string }[] }
  | { type: "faq"; title: string; items: { q: string; a: string }[] }
  | { type: "section"; title: string; paragraphs: string[] };

// ---------- Helpers ----------

function splitBlocks(raw: string): string[] {
  return raw
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

function isHeader(block: string): boolean {
  // هيدر: سطر واحد قصير نسبياً وبينتهي بـ ":"
  return !block.includes("\n") && block.trim().endsWith(":") && block.length < 90;
}

function extractMarkdownLinks(text: string): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    links.push({ label: m[1], href: normalizeHref(m[2]) });
  }
  return links;
}

// الروابط في المصدر بصيغة عربية زي "خدماتنا/interior-painting-riyadh"
// نحولها لمسار حقيقي /خدماتنا/{slug} (عدّل البادئة لو مختلفة عندك)
function normalizeHref(raw: string): string {
  const clean = raw.trim().replace(/^\/+/, "");
  return "/" + clean;
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").trim();
}

// يحاول يفصل "اسم العنصر:\nالوصف" أو "اسم العنصر: الوصف" (سطر واحد)
function parseNameDescBlock(block: string): { title: string; text: string } {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2 && lines[0].endsWith(":")) {
    return { title: lines[0].replace(/:$/, ""), text: lines.slice(1).join(" ") };
  }
  // سطر واحد: "العنوان: النص"
  const idx = block.indexOf(":");
  if (idx > -1 && idx < 60) {
    return { title: block.slice(0, idx).trim(), text: block.slice(idx + 1).trim() };
  }
  return { title: lines[0] ?? "", text: lines.slice(1).join(" ") };
}

function parsePriceLines(block: string): { item: string; price: string }[] {
  return block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":");
      if (idx === -1) return { item: line, price: "" };
      return { item: line.slice(0, idx).trim(), price: line.slice(idx + 1).trim() };
    });
}

function classifyHeader(header: string): Section["type"] | "faq" | "why_us" | "steps" | "tips" | "pricing_table" | "list_cards" | "section" {
  const h = header.replace(/:$/, "").trim();
  if (/أسئلة شائعة/.test(h)) return "faq";
  if (/لماذا/.test(h)) return "why_us";
  if (/خطوات/.test(h)) return "steps";
  if (/نصائح/.test(h)) return "tips";
  if (/أسعار/.test(h)) return "pricing_table";
  if (/أنواع|ماركات|كيف تختار/.test(h)) return "list_cards";
  return "section";
}

// ---------- Main parser ----------

export function parseServiceContent(raw: string): Section[] {
  const blocks = splitBlocks(raw);
  const sections: Section[] = [];

  let current: { type: string; title: string; buffer: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const { type, title, buffer } = current;
    const joined = buffer.join("\n\n");

    if (type === "list_cards") {
      const items = buffer.map(parseNameDescBlock).filter((i) => i.title);
      sections.push({ type: "list_cards", title, items });
    } else if (type === "steps") {
      const items = buffer.map((b) => ({ text: b.replace(/\n/g, " ") }));
      sections.push({ type: "steps", title, items });
    } else if (type === "tips") {
      const items = joined.split("\n").map((l) => l.trim()).filter(Boolean);
      sections.push({ type: "tips", title, items });
    } else if (type === "pricing_table") {
      const rows = parsePriceLines(joined);
      // آخر سطر أحياناً بيكون جملة توضيحية عامة مش صف سعر فعلي (مفيهوش رقم/ريال)
      let note: string | undefined;
      if (rows.length > 1) {
        const last = rows[rows.length - 1];
        const looksLikePrice = /\d/.test(last.price) || /ريال|من\s|إلى\s/.test(last.price);
        if (!looksLikePrice && !last.price) {
          note = last.item;
          rows.pop();
        }
      }
      sections.push({ type: "pricing_table", title, rows, ...(note ? { note } : {}) });
    } else if (type === "faq") {
      const items: { q: string; a: string }[] = [];
      for (const b of buffer) {
        const qm = b.match(/س:\s*([\s\S]*?)\nج:\s*([\s\S]*)/);
        if (qm) items.push({ q: qm[1].trim(), a: qm[2].trim() });
      }
      sections.push({ type: "faq", title, items });
    } else if (type === "why_us") {
      sections.push({ type: "why_us", title, paragraphs: buffer });
    } else {
      sections.push({ type: "section", title, paragraphs: buffer });
    }
    current = null;
  };

  for (const block of blocks) {
    // روابط داخلية (فقرة "لو بتخطط تكمل التشطيب...")
    const links = extractMarkdownLinks(block);
    if (links.length > 0) {
      flush();
      sections.push({ type: "related_services", text: stripMarkdownLinks(block), links });
      continue;
    }

    // فقرة الدعوة لاتخاذ إجراء
    if (/تواصل معنا الآن/.test(block) && !block.endsWith(":")) {
      flush();
      sections.push({ type: "cta", text: block });
      continue;
    }

    if (isHeader(block)) {
      flush();
      const t = classifyHeader(block);
      current = { type: t, title: block.replace(/:$/, ""), buffer: [] };
      continue;
    }

    if (!current) {
      // أول فقرة قبل أي هيدر = المقدمة
      sections.push({ type: "intro", text: block });
      continue;
    }

    current.buffer.push(block);
  }
  flush();

  return sections;
}

// ---------- CLI ----------
// usage: npx tsx parse-service-content.ts input.json output.json
// input.json: array of objects, لازم كل عنصر فيه "content"
// وحبذا لو فيه "slug" أو "id" عشان نربطهم بالداتابيز بعدين

if (require.main === module) {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    console.error("usage: npx tsx parse-service-content.ts <input.json> <output.json>");
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(inputPath), "utf-8"));
  if (!Array.isArray(raw)) {
    console.error("الملف المدخل لازم يكون array");
    process.exit(1);
  }

  const result = raw.map((item: any, i: number) => {
    if (!item.content) {
      console.warn(`تحذير: العنصر رقم ${i} مفيهوش حقل content`);
      return item;
    }
    const contentBlocks = parseServiceContent(item.content);
    return { ...item, contentBlocks };
  });

  fs.writeFileSync(path.resolve(outputPath), JSON.stringify(result, null, 2), "utf-8");
  console.log(`تم: ${result.length} عنصر → ${outputPath}`);
}
