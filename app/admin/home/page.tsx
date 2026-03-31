import {
  getHomeHeroSettings,
  getHomeAboutSettings,
  getHomeSectionHeadingsSettings,
  getHomeBenefitsList,
  getHomeProcessStepsList,
  getHomeCTASettings,
  getHomeSeoSettings,
  upsertHomeHeroSettings,
  upsertHomeAboutSettings,
  upsertHomeSectionHeadingsSettings,
  upsertHomeCTASettings,
  upsertHomeSeoSettings,
} from "@/lib/actions/home";
import { getHomeSectionVisibility } from "@/lib/home";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import HomeForm from "./HomeForm";

export const dynamic = "force-dynamic";

async function getPresentationsMeta() {
  let rows: (typeof siteSettings.$inferSelect)[] = [];
  try {
    rows = await db
      .select()
      .from(siteSettings)
      .where(inArray(siteSettings.key, ["presentations.en", "presentations.ka"]));
  } catch (err) {
    console.error("[getPresentationsMeta] DB error:", err);
  }

  let en: { filename: string; sizeLabel: string } | null = null;
  let ka: { filename: string; sizeLabel: string } | null = null;

  for (const row of rows) {
    if (!row.valueEn) continue;
    try {
      const meta = JSON.parse(row.valueEn);
      if (row.key === "presentations.en") en = { filename: meta.filename, sizeLabel: meta.sizeLabel };
      if (row.key === "presentations.ka") ka = { filename: meta.filename, sizeLabel: meta.sizeLabel };
    } catch {}
  }
  return { en, ka };
}

export default async function HomepagePage() {
  const [hero, about, headings, benefits, processSteps, cta, seo, visibility, presentations] = await Promise.all([
    getHomeHeroSettings(),
    getHomeAboutSettings(),
    getHomeSectionHeadingsSettings(),
    getHomeBenefitsList(),
    getHomeProcessStepsList(),
    getHomeCTASettings(),
    getHomeSeoSettings(),
    getHomeSectionVisibility(),
    getPresentationsMeta(),
  ]);

  return (
    <HomeForm
      heroAction={upsertHomeHeroSettings}
      aboutAction={upsertHomeAboutSettings}
      headingsAction={upsertHomeSectionHeadingsSettings}
      ctaAction={upsertHomeCTASettings}
      seoAction={upsertHomeSeoSettings}
      hero={hero}
      about={about}
      headings={headings}
      benefits={benefits}
      processSteps={processSteps}
      cta={cta}
      seo={seo}
      visibility={visibility}
      presentationEn={presentations.en}
      presentationKa={presentations.ka}
    />
  );
}
