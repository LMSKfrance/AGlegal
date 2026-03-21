import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible auth config — no Node.js-only modules (bcrypt, @libsql/client).
 * Used by middleware.ts which runs in the Edge Runtime.
 * The full auth config (with Credentials provider + bcrypt) lives in auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" },
  // Required on Netlify: reverse proxy sets X-Forwarded-Host; without this
  // NextAuth v5 throws UntrustedHost on every authenticated request.
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      if (path.startsWith("/admin/login")) return true;
      if (path.startsWith("/admin")) return !!auth;
      return true;
    },
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
  },
} satisfies NextAuthConfig;
