import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "../Universal/CTA";
import { getTeamMembers } from "@/lib/team";
import type { Locale } from "@/lib/db/locale";

const TeamPage = async () => {
  const locale: Locale = "en";
  const members = await getTeamMembers(locale);

  return (
    <Layout>
      <Hero members={members} />
      <CTA />
    </Layout>
  );
};

export default TeamPage;
