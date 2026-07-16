import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = z.object({ email: z.string().email(), password: z.string().min(8) }).safeParse(credentials);
        if (!parsed.success) return null;
        const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
        if (!admin || !(await bcrypt.compare(parsed.data.password, admin.password))) return null;
        return { id: admin.id, name: admin.name, email: admin.email };
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  callbacks: {
    // ده اللي فعليًا بيمنع الدخول لـ /admin/* من غير تسجيل دخول عبر middleware.
    // في النسخة القديمة كان الـ callback ده متحط غلط جوه matcher في middleware.ts
    // وده مكانش بيعمل حاجة خالص — Next.js middleware config بيقرأ matcher بس.
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const isLoginPage = request.nextUrl.pathname === "/admin/login";
      if (isLoginPage) return true; // اسمح بصفحة تسجيل الدخول نفسها من غير حلقة redirect لا نهائية
      return isLoggedIn;
    },
  },
});
