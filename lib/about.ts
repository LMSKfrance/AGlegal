import { inArray } from "drizzle-orm";
import { getPageBySlug } from "@/lib/actions/pages";
import { getAboutTeamMembers, getTeamMembers } from "@/lib/team";
import type { Locale } from "@/lib/db/locale";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

// Section visibility (read-only here; mutations in lib/actions/about)
export const ABOUT_SECTION_IDS = [
  "hero",
  "numbers",
  "mission",
  "team",
  "features",
  "philosophy",
  "faq",
] as const;

export type AboutSectionId = (typeof ABOUT_SECTION_IDS)[number];
export type AboutSectionVisibility = Record<AboutSectionId, boolean>;

export type AboutSectionSettings = {
  numbersTitleEn: string;
  numbersTitleKa: string;
  numbersDescriptionEn: string;
  numbersDescriptionKa: string;
  missionTitleEn: string;
  missionTitleKa: string;
  missionDescriptionEn: string;
  missionDescriptionKa: string;
  missionTab1Image: string;
  missionTab2Image: string;
  missionTab3Image: string;
  featuresTitleEn: string;
  featuresTitleKa: string;
  philosophyTitleEn: string;
  philosophyTitleKa: string;
  philosophyDescriptionEn: string;
  philosophyDescriptionKa: string;
  philosophyCard1Image: string;
  philosophyCard2Image: string;
  sectionVisibility: AboutSectionVisibility;
};

export type AboutTeamMemberEntry = { id: number; showOnAbout: boolean; aboutOrder: number };

const ABOUT_KEYS = [
  "about.numbers.title",
  "about.numbers.description",
  "about.mission.title",
  "about.mission.description",
  "about.mission.tab1.image",
  "about.mission.tab2.image",
  "about.mission.tab3.image",
  "about.features.title",
  "about.philosophy.title",
  "about.philosophy.description",
  "about.philosophy.card1.image",
  "about.philosophy.card2.image",
] as const;

const ABOUT_VISIBILITY_KEYS = ABOUT_SECTION_IDS.map((id) => `about.section.${id}.visible`);

async function getSettingsMap(keys: string[]) {
  if (!keys.length) return {} as Record<string, { valueEn: string | null; valueKa: string | null }>;
  try {
    const rows = await db
      .select({ key: siteSettings.key, valueEn: siteSettings.valueEn, valueKa: siteSettings.valueKa })
      .from(siteSettings)
      .where(inArray(siteSettings.key, keys));
    const map: Record<string, { valueEn: string | null; valueKa: string | null }> = {};
    for (const row of rows) map[row.key] = { valueEn: row.valueEn, valueKa: row.valueKa };
    return map;
  } catch (err) {
    console.error("[getSettingsMap]", err);
    return {} as Record<string, { valueEn: string | null; valueKa: string | null }>;
  }
}

function parseVisibility(value: string | null | undefined): boolean {
  return value === "1" || value === "true" || value === "";
}

const DEFAULT_ABOUT_SECTION_SETTINGS: AboutSectionSettings = {
  numbersTitleEn: "",
  numbersTitleKa: "",
  numbersDescriptionEn: "",
  numbersDescriptionKa: "",
  missionTitleEn: "",
  missionTitleKa: "",
  missionDescriptionEn: "",
  missionDescriptionKa: "",
  missionTab1Image: "",
  missionTab2Image: "",
  missionTab3Image: "",
  featuresTitleEn: "",
  featuresTitleKa: "",
  philosophyTitleEn: "",
  philosophyTitleKa: "",
  philosophyDescriptionEn: "",
  philosophyDescriptionKa: "",
  philosophyCard1Image: "",
  philosophyCard2Image: "",
  sectionVisibility: {
    hero: true,
    numbers: true,
    mission: true,
    team: true,
    features: true,
    philosophy: true,
    faq: true,
  },
};

export async function getAboutSectionSettings(): Promise<AboutSectionSettings> {
  try {
    const allKeys = [...(ABOUT_KEYS as unknown as string[]), ...ABOUT_VISIBILITY_KEYS];
    const rows = await getSettingsMap(allKeys);
    const get = (key: string, which: "valueEn" | "valueKa") => rows[key]?.[which] ?? "";
    const sectionVisibility: AboutSectionVisibility = {
      hero: parseVisibility(rows["about.section.hero.visible"]?.valueEn ?? "1"),
      numbers: parseVisibility(rows["about.section.numbers.visible"]?.valueEn ?? "1"),
      mission: parseVisibility(rows["about.section.mission.visible"]?.valueEn ?? "1"),
      team: parseVisibility(rows["about.section.team.visible"]?.valueEn ?? "1"),
      features: parseVisibility(rows["about.section.features.visible"]?.valueEn ?? "1"),
      philosophy: parseVisibility(rows["about.section.philosophy.visible"]?.valueEn ?? "1"),
      faq: parseVisibility(rows["about.section.faq.visible"]?.valueEn ?? "1"),
    };
    return {
      numbersTitleEn: get("about.numbers.title", "valueEn"),
      numbersTitleKa: get("about.numbers.title", "valueKa"),
      numbersDescriptionEn: get("about.numbers.description", "valueEn"),
      numbersDescriptionKa: get("about.numbers.description", "valueKa"),
      missionTitleEn: get("about.mission.title", "valueEn"),
      missionTitleKa: get("about.mission.title", "valueKa"),
      missionDescriptionEn: get("about.mission.description", "valueEn"),
      missionDescriptionKa: get("about.mission.description", "valueKa"),
      missionTab1Image: get("about.mission.tab1.image", "valueEn"),
      missionTab2Image: get("about.mission.tab2.image", "valueEn"),
      missionTab3Image: get("about.mission.tab3.image", "valueEn"),
      featuresTitleEn: get("about.features.title", "valueEn"),
      featuresTitleKa: get("about.features.title", "valueKa"),
      philosophyTitleEn: get("about.philosophy.title", "valueEn"),
      philosophyTitleKa: get("about.philosophy.title", "valueKa"),
      philosophyDescriptionEn: get("about.philosophy.description", "valueEn"),
      philosophyDescriptionKa: get("about.philosophy.description", "valueKa"),
      philosophyCard1Image: get("about.philosophy.card1.image", "valueEn"),
      philosophyCard2Image: get("about.philosophy.card2.image", "valueEn"),
      sectionVisibility,
    };
  } catch (err) {
    console.error("[getAboutSectionSettings]", err);
    return DEFAULT_ABOUT_SECTION_SETTINGS;
  }
}

export async function getAboutContent(locale: Locale = "en") {
  try {
    const [page, sections, aboutMembers] = await Promise.all([
      getPageBySlug("about"),
      getAboutSectionSettings(),
      getAboutTeamMembers(locale),
    ]);
    // Fall back to all published team members when none are marked for the About page
    const teamMembers = aboutMembers.length > 0 ? aboutMembers : await getTeamMembers(locale);
    return { page, sections, teamMembers };
  } catch (err) {
    console.error("[getAboutContent]", err);
    return { page: null, sections: DEFAULT_ABOUT_SECTION_SETTINGS, teamMembers: [] };
  }
}
