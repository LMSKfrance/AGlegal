import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse, type NextRequest } from "next/server";

// Use the Edge-safe config (no bcryptjs / Node.js crypto) for middleware.
// The full auth.ts config (with Credentials + bcrypt) is only used on the server.
const { auth } = NextAuth(authConfig);

export default auth(function middleware(request: NextRequest) {
  // Forward the pathname as a request header so server components (e.g. root
  // layout) can read it via `headers()` without needing a route param.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  // Run on all routes except static assets and Next.js internals.
  // The authConfig.callbacks.authorized handler still protects /admin/* routes.
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
