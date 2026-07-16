// lib/types/content-blocks.ts
// ============================================================
// أنواع بلوكات المحتوى (Service.contentBlocks) — JSON array مخزّن كنص
// ============================================================

export type IntroBlock = { type: "intro"; text: string };

export type ListCardItem = { title: string; text: string };
export type ListCardsBlock = {
  type: "list_cards";
  title: string;
  items: ListCardItem[];
};

export type StepItem = { text: string };
export type StepsBlock = { type: "steps"; title: string; items: StepItem[] };

export type TipsBlock = { type: "tips"; title: string; items: string[] };

export type SectionBlock = {
  type: "section";
  title: string;
  paragraphs: string[];
};

export type PricingRow = { item: string; price: string };
export type PricingTableBlock = {
  type: "pricing_table";
  title: string;
  rows: PricingRow[];
  note?: string;
};

export type WhyUsBlock = {
  type: "why_us";
  title: string;
  paragraphs: string[];
};

export type RelatedLink = { href: string; label: string };
export type RelatedServicesBlock = {
  type: "related_services";
  text: string;
  links: RelatedLink[];
};

export type FaqItem = { q: string; a: string };
export type FaqBlock = { type: "faq"; title: string; items: FaqItem[] };

export type CtaBlock = { type: "cta"; text: string };

export type ContentBlock =
  | IntroBlock
  | ListCardsBlock
  | StepsBlock
  | TipsBlock
  | SectionBlock
  | PricingTableBlock
  | WhyUsBlock
  | RelatedServicesBlock
  | FaqBlock
  | CtaBlock;

/**
 * Service.contentBlocks متخزّن كـ string (JSON.stringify لمصفوفة).
 * الدالة دي بترجعه parsed وبتتجاهل أي بلوك من نوع غير معروف بدل ما تكسر الصفحة.
 */
export function parseContentBlocks(
  raw: string | unknown[] | null | undefined,
): ContentBlock[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (b): b is ContentBlock =>
        b &&
        typeof b === "object" &&
        typeof (b as any).type === "string" &&
        [
          "intro",
          "list_cards",
          "steps",
          "tips",
          "section",
          "pricing_table",
          "why_us",
          "related_services",
          "faq",
          "cta",
        ].includes((b as any).type),
    );
  } catch {
    return [];
  }
}
