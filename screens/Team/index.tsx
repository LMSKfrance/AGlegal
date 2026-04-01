import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "../Universal/CTA";
import { getTeamMembers } from "@/lib/team";
import { getTeamPageContent } from "@/lib/actions/settings";

const TeamPage = async () => {
  const [membersEn, membersKa, pageContent] = await Promise.all([
    getTeamMembers("en"),
    getTeamMembers("ka"),
    getTeamPageContent(),
  ]);

  return (
    <Layout>
      <Hero
        membersEn={membersEn}
        membersKa={membersKa}
        titleEn={pageContent.titleEn ?? ""}
        titleKa={pageContent.titleKa ?? ""}
        descriptionEn={pageContent.descriptionEn ?? ""}
        descriptionKa={pageContent.descriptionKa ?? ""}
        showHeader={pageContent.showHeader}
      />
      <CTA />
    </Layout>
  );
};

export default TeamPage;
