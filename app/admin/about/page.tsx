import { getAboutSectionSettings } from "@/lib/about";
import { upsertAboutSectionSettings, upsertAboutHeroContent, setAboutSectionVisibilityFromForm, upsertAboutMissionSection, upsertAboutPhilosophySection } from "@/lib/actions/about";
import { getPageBySlug } from "@/lib/actions/pages";
import { getFaqList } from "@/lib/actions/faq";
import { getTeamList, toggleShowOnAboutMember } from "@/lib/actions/team";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, page, faqs, teamMembers] = await Promise.all([
    getAboutSectionSettings(),
    getPageBySlug("about"),
    getFaqList(),
    getTeamList(),
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
      teamMembers={teamMembers}
      toggleAboutMemberAction={toggleShowOnAboutMember}
    />
  );
}
