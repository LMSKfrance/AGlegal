import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use the Edge-safe config (no bcryptjs / Node.js crypto) for middleware.
// The full auth.ts config (with Credentials + bcrypt) is only used on the server.
export default NextAuth(authConfig).auth;

export const config = {
  // Exclude /admin/login from middleware to prevent redirect loops
  matcher: ["/admin/((?!login$|login/).*)", "/api/auth/(.*)"],
};
