import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth for /admin is temporarily open — will be re-wired when linking functions
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
