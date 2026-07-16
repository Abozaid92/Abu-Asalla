"use client";
// components/content-blocks.tsx
// ============================================================
// عرض بلوكات المحتوى — "بطاقة عينات الدهان" (Paint Chip Card)
// ثيم فاتح، كل قسم له لون عينة دهان حقيقي على شكل "شريحة" فعلية
// (زي بطاقات العينات اللي بتاخدها من محل الدهانات) بدل الدوائر المسطحة.
// ============================================================

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "./reveal";
import {
  ContentBlock,
  ListCardItem,
  PricingRow,
  FaqItem,
} from "@/lib/content-blocks";

// عينات دهان حقيقية بأسماء ألوان طلاء — مش ألوان عشوائية
const SWATCHES = [
  { hex: "#B9812F", name: "عسلي" },
  { hex: "#A24E30", name: "طوبي" },
  { hex: "#5C6B4C", name: "زيتوني" },
  { hex: "#8A6A4F", name: "بني دافئ" },
  { hex: "#2E4A4A", name: "أخضر داكن" },
  { hex: "#9C7A2E", name: "خردلي" },
];

function swatchFor(index: number) {
  return SWATCHES[index % SWATCHES.length];
}

// شريحة عينة دهان حقيقية: مستطيل بحافة سفلية مقطوعة + لمعة ضوء زي الدهان الحقيقي
function PaintChip({
  hex,
  className = "",
}: {
  hex: string;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-[7px] shadow-[0_10px_22px_-4px_rgba(42,36,28,0.35)] ring-1 ring-black/5 ${className}`}
      style={{
        backgroundColor: hex,
        clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
      }}
    >
      <div
        className="pointer-events-none absolute -left-2 -top-3 h-8 w-10 rotate-[18deg] rounded-full opacity-40 blur-[6px]"
        style={{
          background: "radial-gradient(circle, #fff 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// إطار مشترك: شريحة العينة + رقم كتالوج + اسمها + المحتوى
function SwatchSection({
  index,
  label,
  children,
}: {
  index: number;
  label?: string;
  children: React.ReactNode;
}) {
  const swatch = swatchFor(index);
  const code = String(index + 1).padStart(2, "0");
  return (
    <section className="relative mx-auto grid w-[min(1100px,calc(100%-48px))] grid-cols-[76px_1fr] gap-9 py-14 max-[760px]:grid-cols-[46px_1fr] max-[760px]:gap-5 max-[760px]:py-10">
      <div className="flex flex-col items-center pt-1">
        <PaintChip
          hex={swatch.hex}
          className="h-[68px] w-[58px] max-[760px]:h-11 max-[760px]:w-9"
        />
        <span
          className="mt-2.5 whitespace-nowrap font-[family-name:var(--font-display-ar)] text-[11px] font-bold tracking-[0.05em] max-[760px]:hidden"
          style={{ color: swatch.hex }}
        >
          N°{code}
        </span>
        <span className="mt-0.5 whitespace-nowrap text-[10px] font-medium text-[#9C9280] max-[760px]:hidden">
          {swatch.name}
        </span>
        <div className="mt-4 w-px flex-1 bg-gradient-to-b from-[#E4DAC8] to-transparent" />
      </div>
      <div className="min-w-0 pt-1">
        {label && (
          <p
            className="mb-3 text-xs font-bold tracking-[0.1em]"
            style={{ color: swatch.hex }}
          >
            {label}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="bg-[#FAF7F0] text-[#2A241C] font-[family-name:var(--font-body-ar)]">
      {blocks.map((block, i) => (
        <Reveal key={i}>
          <BlockRenderer block={block} index={i} />
        </Reveal>
      ))}
    </div>
  );
}

function BlockRenderer({
  block,
  index,
}: {
  block: ContentBlock;
  index: number;
}) {
  switch (block.type) {
    case "intro":
      return (
        <SwatchSection index={index} label="نظرة عامة">
          <p
            className="max-w-[680px] text-[18px] leading-[2] text-[#4A4234] first-letter:float-right first-letter:mr-[-0.02em] first-letter:ml-3 first-letter:font-[family-name:var(--font-display-ar)] first-letter:text-[58px] first-letter:font-bold first-letter:leading-[0.75] first-letter:text-[color:var(--sw)]"
            style={{ ["--sw" as string]: swatchFor(index).hex }}
          >
            {block.text}
          </p>
        </SwatchSection>
      );

    case "list_cards":
      return (
        <SwatchSection index={index} label={block.title}>
          <div className="grid grid-cols-2 gap-5 max-[760px]:grid-cols-1">
            {block.items.map((item: ListCardItem) => {
              const sw = swatchFor(index);
              return (
                <div
                  key={item.title}
                  className="group relative rounded-[10px] border border-[#E9E0CE] bg-white p-6 shadow-[0_2px_10px_rgba(42,36,28,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(42,36,28,0.1)]"
                >
                  <div
                    className="mb-4 h-[3px] w-10 rounded-full"
                    style={{ backgroundColor: sw.hex }}
                  />
                  <h3 className="mb-3 font-[family-name:var(--font-display-ar)] text-[17px] font-semibold text-[#2A241C]">
                    {item.title}
                  </h3>
                  <p className="text-[14.5px] leading-[1.95] text-[#6B6252]">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </SwatchSection>
      );

    case "steps":
      return (
        <SwatchSection index={index} label={block.title}>
          <ol className="relative border-r-2 border-[#E9E0CE] pr-9">
            {block.items.map((step, i) => {
              const sw = swatchFor(index);
              return (
                <li key={i} className="relative pb-11 last:pb-0">
                  <span
                    className="absolute right-[-45px] top-0 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-[0_4px_10px_rgba(42,36,28,0.2)]"
                    style={{ backgroundColor: sw.hex }}
                  >
                    {i + 1}
                  </span>
                  <p className="pt-1 text-[15px] leading-[2] text-[#4A4234]">
                    {step.text}
                  </p>
                </li>
              );
            })}
          </ol>
        </SwatchSection>
      );

    case "tips":
      return (
        <SwatchSection index={index} label={block.title}>
          <div className="grid grid-cols-2 gap-3.5 max-[760px]:grid-cols-1">
            {block.items.map((tip, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-[8px] bg-white p-4 ring-1 ring-[#EDE5D5]"
              >
                <span
                  className="mt-[7px] h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: swatchFor(index).hex }}
                />
                <p className="text-sm leading-[1.9] text-[#4A4234]">{tip}</p>
              </div>
            ))}
          </div>
        </SwatchSection>
      );

    case "section":
      return (
        <SwatchSection index={index} label={block.title}>
          <div className="grid gap-6">
            {block.paragraphs.map((p, i) => (
              <ParagraphBlock key={i} text={p} accent={swatchFor(index).hex} />
            ))}
          </div>
        </SwatchSection>
      );

    case "pricing_table":
      return (
        <SwatchSection index={index} label={block.title}>
          <div className="overflow-x-auto rounded-[10px] border border-[#E9E0CE] bg-white">
            <table className="w-full min-w-[420px] border-collapse text-right">
              <tbody>
                {block.rows.map((row: PricingRow, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#EDE5D5] last:border-b-0 even:bg-[#FBF8F1]"
                  >
                    <td className="px-5 py-4 text-[15px] text-[#3A3327]">
                      {row.item}
                    </td>
                    <td
                      className="px-5 py-4 text-left text-[15px] font-bold whitespace-nowrap"
                      style={{ color: swatchFor(index).hex }}
                    >
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note && (
            <p className="mt-4 text-xs leading-[1.9] text-[#8A8074]">
              {block.note}
            </p>
          )}
        </SwatchSection>
      );

    case "why_us":
      return (
        <SwatchSection index={index} label={block.title}>
          <div className="rounded-[12px] bg-white p-8 shadow-[0_2px_10px_rgba(42,36,28,0.05)]">
            <div className="grid gap-4">
              {block.paragraphs.map((p, i) => (
                <p key={i} className="text-[17px] leading-[2] text-[#3A3327]">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </SwatchSection>
      );

    case "related_services":
      return (
        <SwatchSection index={index} label="اقترب أكتر من مشروعك">
          <p className="mb-5 max-w-[600px] text-[15px] leading-[1.95] text-[#4A4234]">
            {block.text}
          </p>
          <div className="flex flex-wrap gap-3">
            {block.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border-2 bg-white px-5 py-2.5 text-sm font-semibold no-underline transition-colors duration-200 hover:bg-[#FBF3E4]"
                style={{
                  borderColor: `${swatchFor(index).hex}44`,
                  color: swatchFor(index).hex,
                }}
              >
                {link.label} ←
              </Link>
            ))}
          </div>
        </SwatchSection>
      );

    case "faq":
      return (
        <SwatchSection index={index} label={block.title}>
          <div className="divide-y divide-[#EDE5D5] rounded-[10px] border border-[#EDE5D5] bg-white px-6">
            {block.items.map((item: FaqItem, i) => (
              <FaqRow key={i} item={item} accent={swatchFor(index).hex} />
            ))}
          </div>
        </SwatchSection>
      );

    case "cta":
      return (
        <section
          className="relative my-6 overflow-hidden py-20 text-center"
          style={{
            background: `linear-gradient(120deg, ${swatchFor(index).hex} 0%, ${swatchFor(index + 2).hex} 100%)`,
          }}
        >
          <div className="mx-auto w-[min(760px,calc(100%-48px))]">
            <p className="font-[family-name:var(--font-display-ar)] text-[24px] font-semibold leading-[1.7] text-white">
              {block.text}
            </p>
            <Link
              href="#quote"
              className="mt-7 inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#2A241C] no-underline transition-transform duration-300 hover:-translate-y-0.5"
            >
              اطلب عرض سعر الآن ←
            </Link>
          </div>
        </section>
      );

    default:
      return null;
  }
}

function ParagraphBlock({ text, accent }: { text: string; accent: string }) {
  // بعض الفقرات جوايها bullet list مكتوبة بـ "- " على أسطر منفصلة (زي WPC/PVC)
  const lines = text.split("\n").filter(Boolean);
  const isListy =
    lines.length > 1 && lines.slice(1).some((l) => l.trim().startsWith("-"));

  if (!isListy) {
    return (
      <p className="max-w-[680px] text-[15.5px] leading-[2] text-[#4A4234]">
        {text}
      </p>
    );
  }

  const [heading, ...rest] = lines;
  return (
    <div className="max-w-[680px] rounded-[10px] bg-white p-6 ring-1 ring-[#EDE5D5]">
      <p
        className="mb-3 font-[family-name:var(--font-display-ar)] font-bold"
        style={{ color: accent }}
      >
        {heading}
      </p>
      <ul className="grid gap-2.5">
        {rest.map((line, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-[14.5px] leading-[1.9] text-[#4A4234]"
          >
            <span
              className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span>{line.replace(/^-\s*/, "")}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqRow({ item, accent }: { item: FaqItem; accent: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="block w-full py-5 text-right"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-semibold text-[#2A241C]">
          {item.q}
        </span>
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-transform duration-300"
          style={{
            backgroundColor: `${accent}18`,
            color: accent,
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </div>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="mt-3 max-w-[640px] text-sm leading-[1.95] text-[#6B6252]">
            {item.a}
          </p>
        </div>
      </div>
    </button>
  );
}
