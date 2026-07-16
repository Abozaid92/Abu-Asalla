// أيقونات SVG مضمّنة بدل استيراد مكتبة أيقونات كاملة (lucide/heroicons) —
// كل أيقونة كام بايت بس، بتترندر مع الصفحة من غير أي طلب شبكة إضافي أو JS
// إضافي، فمفيش أي تأثير على LCP/INP.

import type { CSSProperties } from "react";

type IconProps = { className?: string; style?: CSSProperties };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconGrid(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconLayers(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="M12 3l9 5-9 5-9-5 9-5Z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  );
}

export function IconTag(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="M20.5 12.5 12.5 20.5a2 2 0 0 1-2.83 0l-6.17-6.17a2 2 0 0 1 0-2.83L11.5 3.5H19a1.5 1.5 0 0 1 1.5 1.5v7.5Z" />
      <circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconBriefcase(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M8 7.5V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1.5" />
      <path d="M3 12.5h18" />
    </svg>
  );
}

export function IconEdit(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
    </svg>
  );
}

export function IconMapPin(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="M20 10.5c0 6-8 11-8 11s-8-5-8-11a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </svg>
  );
}

export function IconMail(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}

export function IconStar(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="m12 3 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.8 6.1 21l1.2-6.5-4.8-4.6L9.1 9 12 3Z" />
    </svg>
  );
}

export function IconSettings(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.96 19a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1.04H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.04-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.14.62.71 1.04 1.56 1.04H21a2 2 0 1 1 0 4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </svg>
  );
}

export function IconLogout(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function IconClipboard(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <rect x="6" y="4" width="12" height="17" rx="2" />
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M9 11h6M9 15h6" />
    </svg>
  );
}

export function IconPlus(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconTrend(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function IconNewspaper(p: IconProps) {
  return (
    <svg {...base} className={p.className} style={p.style as CSSProperties}>
      <rect x="3" y="5" width="14" height="14" rx="2" />
      <path d="M17 8h4v9a2 2 0 0 1-2 2H7" />
      <path d="M7 9h6M7 12h6M7 15h3" />
    </svg>
  );
}

export function IconWhatsapp(p: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={p.className} style={p.style as CSSProperties} fill="currentColor">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.34-1.31a9.9 9.9 0 0 0 4.7 1.19h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm5.82 14.1c-.24.68-1.4 1.3-1.93 1.35-.5.05-.98.24-3.3-.69-2.8-1.12-4.6-3.98-4.74-4.17-.14-.19-1.14-1.51-1.14-2.88 0-1.37.72-2.04.97-2.32.25-.28.55-.35.73-.35.19 0 .37 0 .53.01.17.01.4-.06.62.48.24.58.8 2 .87 2.14.07.14.11.31.02.5-.09.19-.14.31-.27.47-.14.17-.29.37-.41.5-.14.14-.28.29-.12.57.16.28.72 1.2 1.55 1.94 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.33.07.12.07.68-.16 1.36Z" />
    </svg>
  );
}
