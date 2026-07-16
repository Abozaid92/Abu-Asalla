"use client";

import { useState } from "react";
import { BeforeAfterSlider } from "@/components/before-after-slider";

type BaItem = { key: string; before: string; after: string; title: string; meta: string };

export function BeforeAfterCarousel({ items }: { items: BaItem[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + items.length) % items.length);
  }

  return (
    <div className="w-full">
      <BeforeAfterSlider key={item.key} before={item.before} after={item.after} title={item.title} />
      <div className="ba-carousel-bar mt-[18px] flex items-center justify-between">
        <div className="flex items-baseline gap-2.5 text-sm text-[var(--text-2)]">
          <b className="text-base text-[var(--text-1)]">{item.title}</b>
          <span>{item.meta}</span>
        </div>
        {items.length > 1 && (
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label="السابق"
              onClick={() => go(-1)}
              className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] transition-colors duration-[250ms] ease hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <span className="min-w-[44px] text-center text-[13px] text-[var(--text-3)]">
              {index + 1} / {items.length}
            </span>
            <button
              type="button"
              aria-label="التالي"
              onClick={() => go(1)}
              className="grid h-[42px] w-[42px] place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-1)] transition-colors duration-[250ms] ease hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
