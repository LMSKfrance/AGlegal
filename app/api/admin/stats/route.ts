import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { articles, teamMembers, services, pages } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const [newsCount] = await db.select({ count: sql<number>`count(*)` }).from(articles);
    const [teamCount] = await db.select({ count: sql<number>`count(*)` }).from(teamMembers);
    const [servicesCount] = await db.select({ count: sql<number>`count(*)` }).from(services);
    const [pagesCount] = await db.select({ count: sql<number>`count(*)` }).from(pages);

    return NextResponse.json({
      news: newsCount.count,
      team: teamCount.count,
      services: servicesCount.count,
      pages: pagesCount.count,
    });
  } catch (err) {
    console.error("[API stats]", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
