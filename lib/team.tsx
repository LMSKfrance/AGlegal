import { db } from "@/lib/db";
import { teamMembers, teamMemberSocials } from "@/lib/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { pick, type Locale } from "@/lib/db/locale";
import type { TeamMember } from "./types/team";
import { SUPPORTED_PLATFORMS } from "./utils/socialIcons";

export type { TeamMember } from "./types/team";

async function getSocialsForMember(memberId: number) {
  try {
    return await db
      .select()
      .from(teamMemberSocials)
      .where(eq(teamMemberSocials.teamMemberId, memberId));
  } catch {
    return [];
  }
}

export async function getTeamMemberBySlug(
  slug: string,
  locale: Locale = "en"
): Promise<TeamMember | null> {
  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.slug, slug), eq(teamMembers.published, 1)));
    const row = rows[0];
    if (!row) return null;

    const socials = await getSocialsForMember(row.id);
    return mapRow(row, socials, locale);
  } catch (err) {
    console.error("[getTeamMemberBySlug]", err);
    return null;
  }
}

export async function getTeamMembers(
  locale: Locale = "en"
): Promise<TeamMember[]> {
  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.published, 1))
      .orderBy(asc(teamMembers.sortOrder));

    return Promise.all(
      rows.map(async (row) => {
        const socials = await getSocialsForMember(row.id);
        return mapRow(row, socials, locale);
      })
    );
  } catch (err) {
    console.error("[getTeamMembers]", err);
    return [];
  }
}

export async function getHomeTeamMembers(locale: Locale = "en"): Promise<TeamMember[]> {
  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.showOnHome, 1), eq(teamMembers.published, 1)))
      .orderBy(asc(teamMembers.homeOrder), asc(teamMembers.sortOrder), asc(teamMembers.id));

    return Promise.all(
      rows.map(async (row) => {
        const socials = await getSocialsForMember(row.id);
        return mapRow(row, socials, locale);
      })
    );
  } catch (err) {
    console.error("[getHomeTeamMembers]", err);
    return [];
  }
}

export async function getAboutTeamMembers(locale: Locale = "en"): Promise<TeamMember[]> {
  try {
    const rows = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.showOnAbout, 1), eq(teamMembers.published, 1)))
      .orderBy(asc(teamMembers.aboutOrder), asc(teamMembers.sortOrder), asc(teamMembers.id));

    return Promise.all(
      rows.map(async (row) => {
        const socials = await getSocialsForMember(row.id);
        return mapRow(row, socials, locale);
      })
    );
  } catch (err) {
    console.error("[getAboutTeamMembers]", err);
    return [];
  }
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
    imagePosition: (row.imagePosition ?? "top") as "top" | "center" | "bottom",
    ogImage: row.ogImage,
    socials: socials
      .filter((s) => SUPPORTED_PLATFORMS.includes(s.platform as typeof SUPPORTED_PLATFORMS[number]))
      .map((s) => ({
        id: s.id,
        name: s.platform,
        link: s.link,
      })),
  };
}
