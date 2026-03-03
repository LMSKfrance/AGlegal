import { db } from "@/lib/db";
import { articles, teamMembers, services, pages } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export async function getAdminStats() {
  const [articlesCount, teamCount, servicesCount, pagesCount] = await Promise.all([
    db.select({ count: count() }).from(articles),
    db.select({ count: count() }).from(teamMembers),
    db.select({ count: count() }).from(services),
    db.select({ count: count() }).from(pages),
  ]);
  return {
    articles: articlesCount[0]?.count ?? 0,
    teamMembers: teamCount[0]?.count ?? 0,
    services: servicesCount[0]?.count ?? 0,
    pages: pagesCount[0]?.count ?? 0,
  };
}
