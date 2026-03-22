import { getAboutSectionSettings } from "@/lib/about";
import { upsertAboutSectionSettings, upsertAboutHeroContent, setAboutSectionVisibilityFromForm, upsertAboutMissionSection, upsertAboutPhilosophySection } from "@/lib/actions/about";
import { getPageBySlug } from "@/lib/actions/pages";
import { getFaqList } from "@/lib/actions/faq";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, page, faqs] = await Promise.all([
    getAboutSectionSettings(),
    getPageBySlug("about"),
    getFaqList(),
  ]);

  return (
    <AboutForm
      settings={settings}
      saveSettingsAction={upsertAboutSectionSettings}
      visibilityAction={setAboutSectionVisibilityFromForm}
      page={page}
      saveHeroAction={upsertAboutHeroContent}
      saveMissionSectionAction={upsertAboutMissionSection}
      savePhilosophySectionAction={upsertAboutPhilosophySection}
      faqs={faqs}
    />
  );
}
