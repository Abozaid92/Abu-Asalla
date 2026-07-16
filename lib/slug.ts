export function slugifyArabic(value: string) {
  return value.normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g, "").replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-");
}

export function canonical(path: string) { return new URL(path, process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").toString(); }
