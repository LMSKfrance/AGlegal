import {
  getHomeHeroSettings,
  getHomeAboutSettings,
  getHomeSectionHeadingsSettings,
  getHomeBenefitsList,
  getHomeProcessStepsList,
  upsertHomeHeroSettings,
  upsertHomeAboutSettings,
  upsertHomeSectionHeadingsSettings,
} from "@/lib/actions/home";
import { getHomeSectionVisibility } from "@/lib/home";
import HomeForm from "./HomeForm";

export const dynamic = "force-dynamic";

export default async function HomepagePage() {
  const [hero, about, headings, benefits, processSteps, visibility] = await Promise.all([
    getHomeHeroSettings(),
    getHomeAboutSettings(),
    getHomeSectionHeadingsSettings(),
    getHomeBenefitsList(),
    getHomeProcessStepsList(),
    getHomeSectionVisibility(),
  ]);

  return (
    <HomeForm
      heroAction={upsertHomeHeroSettings}
      aboutAction={upsertHomeAboutSettings}
      headingsAction={upsertHomeSectionHeadingsSettings}
      hero={hero}
      about={about}
      headings={headings}
      benefits={benefits}
      processSteps={processSteps}
      visibility={visibility}
    />
  );
}
