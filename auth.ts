import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);
        if (!parsed.success) return null;
        const admin = await prisma.adminUser.findUnique({
          where: { email: parsed.data.email },
        });
        if (
          !admin ||
          !(await bcrypt.compare(parsed.data.password, admin.password))
        )
          return null;
        return { id: admin.id, name: admin.name, email: admin.email };
      },
    }),
  ],
});
