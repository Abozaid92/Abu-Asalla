// Rate limiter بسيط في الذاكرة (in-memory) لمنع سبام فورم عام زي طلب عرض
// السعر. ده كافي كخط دفاع أول ضد بوتات بسيطة، لكن له حدود مهمة لازم تعرفها:
//
// - على Vercel serverless، كل instance ليه ذاكرته الخاصة، فمفيش ضمان إن كل
//   طلبات نفس الـ IP هتتحسب في نفس الـ Map (لو فتح أكتر من instance).
// - لو حبيت حماية أقوى وموثوقة عبر كل الـ instances، الخيار الأنسب هو Redis
//   (زي ما استخدمت في مشروع Post Me) أو خدمة جاهزة زي Vercel Firewall/Arcjet.
//
// المهم دلوقتي: ده أفضل بكتير من مفيش حماية خالص.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > limit) return true;
  return false;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
