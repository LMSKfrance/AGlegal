import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((_req) => {
  // authorized callback in auth.ts handles redirect to /admin/login when not authenticated
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
