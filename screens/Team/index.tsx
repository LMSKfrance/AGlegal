import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "../Universal/CTA";
import { getTeamMembers } from "@/lib/team";
import { getTeamPageContent } from "@/lib/actions/settings";
import { pick, type Locale } from "@/lib/db/locale";

const TeamPage = async () => {
  const locale: Locale = "en";
  const [members, pageContent] = await Promise.all([
    getTeamMembers(locale),
    getTeamPageContent(),
  ]);

  const title = pick(locale, pageContent.titleEn, pageContent.titleKa) || pageContent.titleEn;
  const description = pick(locale, pageContent.descriptionEn, pageContent.descriptionKa) || pageContent.descriptionEn;

  return (
    <Layout>
      <Hero members={members} title={title} description={description} />
      <CTA />
    </Layout>
  );
};

export default TeamPage;
