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
import HomeForm from "./HomeForm";

export const dynamic = "force-dynamic";

export default async function HomepagePage() {
  const [hero, about, headings, benefits, processSteps, cta, seo, visibility] = await Promise.all([
    getHomeHeroSettings(),
    getHomeAboutSettings(),
    getHomeSectionHeadingsSettings(),
    getHomeBenefitsList(),
    getHomeProcessStepsList(),
    getHomeCTASettings(),
    getHomeSeoSettings(),
    getHomeSectionVisibility(),
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
    />
  );
}
