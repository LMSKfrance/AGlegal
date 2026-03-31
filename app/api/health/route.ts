import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { articles, teamMembers, services, pages } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const result: Record<string, unknown> = {
    tursoUrl: process.env.TURSO_DATABASE_URL ? "set" : "MISSING",
    tursoToken: process.env.TURSO_AUTH_TOKEN ? "set" : "MISSING",
    db: "error",
    counts: null,
    error: null,
  };

  try {
    const [a, t, s, p] = await Promise.all([
      db.select({ count: count() }).from(articles),
      db.select({ count: count() }).from(teamMembers),
      db.select({ count: count() }).from(services),
      db.select({ count: count() }).from(pages),
    ]);
    result.db = "ok";
    result.counts = {
      articles: a[0]?.count ?? 0,
      teamMembers: t[0]?.count ?? 0,
      services: s[0]?.count ?? 0,
      pages: p[0]?.count ?? 0,
    };
  } catch (err) {
    result.error = String(err);
  }

  return NextResponse.json(result);
}
