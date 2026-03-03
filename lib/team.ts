import { db } from "@/lib/db";
import { teamMembers, teamMemberSocials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { pick, type Locale } from "@/lib/db/locale";
import type { TeamMember } from "./types/team";

export type { TeamMember } from "./types/team";

export async function getTeamMemberBySlug(
  slug: string,
  locale: Locale = "en"
): Promise<TeamMember | null> {
  const rows = db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.slug, slug))
    .all();
  const row = rows[0];
  if (!row) return null;

  const socials = db
    .select()
    .from(teamMemberSocials)
    .where(eq(teamMemberSocials.teamMemberId, row.id))
    .all();

  return mapRow(row, socials, locale);
}

export async function getTeamMembers(
  locale: Locale = "en"
): Promise<TeamMember[]> {
  const rows = db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder))
    .all();

  return rows.map((row) => {
    const socials = db
      .select()
      .from(teamMemberSocials)
      .where(eq(teamMemberSocials.teamMemberId, row.id))
      .all();
    return mapRow(row, socials, locale);
  });
}

export async function getHomeTeamMembers(locale: Locale = "en"): Promise<TeamMember[]> {
  const rows = db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.showOnHome, 1))
    .orderBy(asc(teamMembers.homeOrder), asc(teamMembers.sortOrder), asc(teamMembers.id))
    .all();

  return rows.map((row) => {
    const socials = db
      .select()
      .from(teamMemberSocials)
      .where(eq(teamMemberSocials.teamMemberId, row.id))
      .all();
    return mapRow(row, socials, locale);
  });
}

export async function getOtherTeamMembers(
  excludeSlug: string,
  locale: Locale = "en"
): Promise<TeamMember[]> {
  const members = await getTeamMembers(locale);
  return members.filter((m) => m.slug !== excludeSlug);
}

function mapRow(
  row: typeof teamMembers.$inferSelect,
  socials: (typeof teamMemberSocials.$inferSelect)[],
  locale: Locale
): TeamMember {
  return {
    id: row.id,
    slug: row.slug,
    title: pick(locale, row.titleEn, row.titleKa),
    position: pick(locale, row.positionEn, row.positionKa) ?? "",
    description: pick(locale, row.descriptionEn, row.descriptionKa) ?? "",
    quote: pick(locale, row.quoteEn, row.quoteKa) ?? "",
    text1: pick(locale, row.text1En, row.text1Ka) ?? "",
    text2: pick(locale, row.text2En, row.text2Ka) ?? "",
    image: row.image ?? "",
    socials: socials.map((s) => ({
      id: s.id,
      name: s.platform,
      link: s.link,
    })),
  };
}
