"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function BeforeAfterSlider({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title?: string;
}) {
  const [pos, setPos] = useState(50);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(98, Math.max(2, pct)));
  }, []);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (dragging.current) updateFromClientX(e.clientX);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      className="ba-slider relative aspect-[4/3] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-[var(--radius-sm)] bg-[#111] shadow-[var(--shadow)] max-[760px]:aspect-[3/4]"
      ref={wrapRef}
      onPointerDown={(e) => {
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        dragging.current = true;
        updateFromClientX(e.clientX);
      }}
    >
      <img
        src={after}
        alt={title ? `${title} - بعد` : "بعد"}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="pointer-events-none block h-full w-full object-cover"
      />
      <img
        src={before}
        alt={title ? `${title} - قبل` : "قبل"}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* الخط الرفيع */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_4px_rgba(0,0,0,.4)]"
        style={{ left: `${pos}%` }}
      />

      {/* الـ grip */}
      <div
        className="pointer-events-none absolute top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,.3)]"
        style={{ left: `${pos}%` }}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2.2"
        >
          <path d="M14 6l6 6-6 6M10 6l-6 6 6 6" />
        </svg>
      </div>

      <span className="pointer-events-none absolute top-[18px] left-[18px] rounded-full bg-[rgba(20,18,15,0.55)] px-[15px] py-[6px] text-xs font-bold tracking-[0.02em] text-white backdrop-blur-[6px]">
        قبل
      </span>
      <span className="pointer-events-none absolute top-[18px] right-[18px] rounded-full bg-[rgba(20,18,15,0.55)] px-[15px] py-[6px] text-xs font-bold tracking-[0.02em] text-white backdrop-blur-[6px]">
        بعد
      </span>
    </div>
  );
}
