import {
  getHomeHeroSettings,
  getHomeAboutSettings,
  getHomeSectionHeadingsSettings,
  getHomeBenefitsList,
  getHomeProcessStepsList,
  getHomeCTASettings,
  upsertHomeHeroSettings,
  upsertHomeAboutSettings,
  upsertHomeSectionHeadingsSettings,
  upsertHomeCTASettings,
} from "@/lib/actions/home";
import { getHomeSectionVisibility } from "@/lib/home";
import HomeForm from "./HomeForm";

export const dynamic = "force-dynamic";

export default async function HomepagePage() {
  const [hero, about, headings, benefits, processSteps, cta, visibility] = await Promise.all([
    getHomeHeroSettings(),
    getHomeAboutSettings(),
    getHomeSectionHeadingsSettings(),
    getHomeBenefitsList(),
    getHomeProcessStepsList(),
    getHomeCTASettings(),
    getHomeSectionVisibility(),
  ]);

  return (
    <HomeForm
      heroAction={upsertHomeHeroSettings}
      aboutAction={upsertHomeAboutSettings}
      headingsAction={upsertHomeSectionHeadingsSettings}
      ctaAction={upsertHomeCTASettings}
      hero={hero}
      about={about}
      headings={headings}
      benefits={benefits}
      processSteps={processSteps}
      cta={cta}
      visibility={visibility}
    />
  );
}
