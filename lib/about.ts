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
  // Stat cards
  stat1Value: string;
  stat1LabelEn: string;
  stat1LabelKa: string;
  stat2Value: string;
  stat2LabelEn: string;
  stat2LabelKa: string;
  stat3Value: string;
  stat3LabelEn: string;
  stat3LabelKa: string;
  missionTitleEn: string;
  missionTitleKa: string;
  missionDescriptionEn: string;
  missionDescriptionKa: string;
  missionTab1Image: string;
  missionTab2Image: string;
  missionTab3Image: string;
  // Mission tab text
  missionTab1TitleEn: string;
  missionTab1TitleKa: string;
  missionTab1DescEn: string;
  missionTab1DescKa: string;
  missionTab2TitleEn: string;
  missionTab2TitleKa: string;
  missionTab2DescEn: string;
  missionTab2DescKa: string;
  missionTab3TitleEn: string;
  missionTab3TitleKa: string;
  missionTab3DescEn: string;
  missionTab3DescKa: string;
  featuresTitleEn: string;
  featuresTitleKa: string;
  // Features items
  featuresItem1TitleEn: string;
  featuresItem1TitleKa: string;
  featuresItem1DescEn: string;
  featuresItem1DescKa: string;
  featuresItem2TitleEn: string;
  featuresItem2TitleKa: string;
  featuresItem2DescEn: string;
  featuresItem2DescKa: string;
  featuresItem3TitleEn: string;
  featuresItem3TitleKa: string;
  featuresItem3DescEn: string;
  featuresItem3DescKa: string;
  featuresItem4TitleEn: string;
  featuresItem4TitleKa: string;
  featuresItem4DescEn: string;
  featuresItem4DescKa: string;
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
  "about.numbers.stat1.value",
  "about.numbers.stat1.label",
  "about.numbers.stat2.value",
  "about.numbers.stat2.label",
  "about.numbers.stat3.value",
  "about.numbers.stat3.label",
  "about.mission.title",
  "about.mission.description",
  "about.mission.tab1.image",
  "about.mission.tab2.image",
  "about.mission.tab3.image",
  "about.mission.tab1.title",
  "about.mission.tab1.desc",
  "about.mission.tab2.title",
  "about.mission.tab2.desc",
  "about.mission.tab3.title",
  "about.mission.tab3.desc",
  "about.features.title",
  "about.features.item1.title",
  "about.features.item1.desc",
  "about.features.item2.title",
  "about.features.item2.desc",
  "about.features.item3.title",
  "about.features.item3.desc",
  "about.features.item4.title",
  "about.features.item4.desc",
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
  stat1Value: "",
  stat1LabelEn: "",
  stat1LabelKa: "",
  stat2Value: "",
  stat2LabelEn: "",
  stat2LabelKa: "",
  stat3Value: "",
  stat3LabelEn: "",
  stat3LabelKa: "",
  missionTitleEn: "",
  missionTitleKa: "",
  missionDescriptionEn: "",
  missionDescriptionKa: "",
  missionTab1Image: "",
  missionTab2Image: "",
  missionTab3Image: "",
  missionTab1TitleEn: "",
  missionTab1TitleKa: "",
  missionTab1DescEn: "",
  missionTab1DescKa: "",
  missionTab2TitleEn: "",
  missionTab2TitleKa: "",
  missionTab2DescEn: "",
  missionTab2DescKa: "",
  missionTab3TitleEn: "",
  missionTab3TitleKa: "",
  missionTab3DescEn: "",
  missionTab3DescKa: "",
  featuresTitleEn: "",
  featuresTitleKa: "",
  featuresItem1TitleEn: "",
  featuresItem1TitleKa: "",
  featuresItem1DescEn: "",
  featuresItem1DescKa: "",
  featuresItem2TitleEn: "",
  featuresItem2TitleKa: "",
  featuresItem2DescEn: "",
  featuresItem2DescKa: "",
  featuresItem3TitleEn: "",
  featuresItem3TitleKa: "",
  featuresItem3DescEn: "",
  featuresItem3DescKa: "",
  featuresItem4TitleEn: "",
  featuresItem4TitleKa: "",
  featuresItem4DescEn: "",
  featuresItem4DescKa: "",
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
    const getEn = (key: string) => rows[key]?.valueEn ?? "";
    const getKa = (key: string) => rows[key]?.valueKa ?? "";
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
      numbersTitleEn: getEn("about.numbers.title"),
      numbersTitleKa: getKa("about.numbers.title"),
      numbersDescriptionEn: getEn("about.numbers.description"),
      numbersDescriptionKa: getKa("about.numbers.description"),
      stat1Value: getEn("about.numbers.stat1.value"),
      stat1LabelEn: getEn("about.numbers.stat1.label"),
      stat1LabelKa: getKa("about.numbers.stat1.label"),
      stat2Value: getEn("about.numbers.stat2.value"),
      stat2LabelEn: getEn("about.numbers.stat2.label"),
      stat2LabelKa: getKa("about.numbers.stat2.label"),
      stat3Value: getEn("about.numbers.stat3.value"),
      stat3LabelEn: getEn("about.numbers.stat3.label"),
      stat3LabelKa: getKa("about.numbers.stat3.label"),
      missionTitleEn: getEn("about.mission.title"),
      missionTitleKa: getKa("about.mission.title"),
      missionDescriptionEn: getEn("about.mission.description"),
      missionDescriptionKa: getKa("about.mission.description"),
      missionTab1Image: getEn("about.mission.tab1.image"),
      missionTab2Image: getEn("about.mission.tab2.image"),
      missionTab3Image: getEn("about.mission.tab3.image"),
      missionTab1TitleEn: getEn("about.mission.tab1.title"),
      missionTab1TitleKa: getKa("about.mission.tab1.title"),
      missionTab1DescEn: getEn("about.mission.tab1.desc"),
      missionTab1DescKa: getKa("about.mission.tab1.desc"),
      missionTab2TitleEn: getEn("about.mission.tab2.title"),
      missionTab2TitleKa: getKa("about.mission.tab2.title"),
      missionTab2DescEn: getEn("about.mission.tab2.desc"),
      missionTab2DescKa: getKa("about.mission.tab2.desc"),
      missionTab3TitleEn: getEn("about.mission.tab3.title"),
      missionTab3TitleKa: getKa("about.mission.tab3.title"),
      missionTab3DescEn: getEn("about.mission.tab3.desc"),
      missionTab3DescKa: getKa("about.mission.tab3.desc"),
      featuresTitleEn: getEn("about.features.title"),
      featuresTitleKa: getKa("about.features.title"),
      featuresItem1TitleEn: getEn("about.features.item1.title"),
      featuresItem1TitleKa: getKa("about.features.item1.title"),
      featuresItem1DescEn: getEn("about.features.item1.desc"),
      featuresItem1DescKa: getKa("about.features.item1.desc"),
      featuresItem2TitleEn: getEn("about.features.item2.title"),
      featuresItem2TitleKa: getKa("about.features.item2.title"),
      featuresItem2DescEn: getEn("about.features.item2.desc"),
      featuresItem2DescKa: getKa("about.features.item2.desc"),
      featuresItem3TitleEn: getEn("about.features.item3.title"),
      featuresItem3TitleKa: getKa("about.features.item3.title"),
      featuresItem3DescEn: getEn("about.features.item3.desc"),
      featuresItem3DescKa: getKa("about.features.item3.desc"),
      featuresItem4TitleEn: getEn("about.features.item4.title"),
      featuresItem4TitleKa: getKa("about.features.item4.title"),
      featuresItem4DescEn: getEn("about.features.item4.desc"),
      featuresItem4DescKa: getKa("about.features.item4.desc"),
      philosophyTitleEn: getEn("about.philosophy.title"),
      philosophyTitleKa: getKa("about.philosophy.title"),
      philosophyDescriptionEn: getEn("about.philosophy.description"),
      philosophyDescriptionKa: getKa("about.philosophy.description"),
      philosophyCard1Image: getEn("about.philosophy.card1.image"),
      philosophyCard2Image: getEn("about.philosophy.card2.image"),
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
