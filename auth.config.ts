import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: { signIn: "/admin/login" },
  providers: [], // فاضية هنا، هتتحط في auth.ts الرئيسي
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = Boolean(auth?.user);
      const isLoginPage = request.nextUrl.pathname === "/admin/login";
      if (isLoginPage) return true;
      return isLoggedIn;
    },
  },
} satisfies NextAuthConfig;
