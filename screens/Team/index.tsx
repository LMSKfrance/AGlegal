import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "../Universal/CTA";
import { getTeamMembers } from "@/lib/team";
import { getTeamPageContent } from "@/lib/actions/settings";
import type { Locale } from "@/lib/db/locale";

const TeamPage = async () => {
  const locale: Locale = "en";
  const [members, pageContent] = await Promise.all([
    getTeamMembers(locale),
    getTeamPageContent(),
  ]);

  const title = locale === "ka" ? (pageContent.titleKa || pageContent.titleEn) : pageContent.titleEn;
  const description = locale === "ka" ? (pageContent.descriptionKa || pageContent.descriptionEn) : pageContent.descriptionEn;

  return (
    <Layout>
      <Hero members={members} title={title} description={description} />
      <CTA />
    </Layout>
  );
};

export default TeamPage;
