import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

async function authenticate(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    // NextAuth v5: signIn بينجح بيرمي redirect داخلي (مش AuthError)، فلازم
    // نمرره زي ما هو ونتعامل بس مع أخطاء الدخول الفعلية.
    if (error instanceof AuthError) {
      redirect("/admin/login?error=1");
    }
    throw error;
  }
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="admin-login-shell">
      <section className="admin-login-card glass">
        <div className="admin-brand-mark">أ أ</div>
        <p className="eyebrow">لوحة أبو أصاله</p>
        <h1>تسجيل دخول الإدارة</h1>
        <p className="sub">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        <form action={authenticate}>
          <label>
            البريد الإلكتروني
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              autoComplete="username"
            />
          </label>
          <label>
            كلمة المرور
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>
          {error && (
            <p className="form-error">البريد أو كلمة المرور غير صحيحة.</p>
          )}
          <button className="a-btn a-btn-primary" type="submit">
            تسجيل الدخول
          </button>
        </form>
        <Link href="/" className="back-link">
          ← العودة للموقع
        </Link>
      </section>
    </main>
  );
}
