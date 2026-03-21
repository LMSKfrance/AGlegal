import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { adminProfile } from "@/lib/db/schema";

// Warn loudly but don't crash when AUTH_SECRET is missing (e.g. first deploy)
if (!process.env.AUTH_SECRET) {
  console.warn(
    "\n⚠️  AUTH_SECRET is not set! Admin login will not work.\n" +
    "   Generate one with: openssl rand -base64 32\n" +
    "   Then add it to your Netlify Environment Variables.\n"
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        // Try DB-stored admin profile first
        try {
          const [profile] = await db.select().from(adminProfile).limit(1);
          if (profile) {
            if (credentials.email !== profile.email) return null;
            const valid = await bcrypt.compare(credentials.password as string, profile.passwordHash);
            if (!valid) return null;
            return { id: "admin", email: profile.email, name: profile.name };
          }
        } catch (err) {
          console.error("[auth] DB lookup failed, falling back to env vars:", err);
        }

        // Fallback to env vars (before first DB profile is seeded or if DB is unreachable)
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;
        if (!email || !password) return null;
        if (credentials.email !== email || credentials.password !== password) return null;
        return { id: "admin", email, name: "Admin" };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
    authorized({ request, auth }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/admin/login")) return true;
      if (path.startsWith("/admin")) return !!auth;
      return true;
    },
  },
});
