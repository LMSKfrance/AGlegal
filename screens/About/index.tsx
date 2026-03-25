import Layout from "@/components/Layout";
import Hero from "./Hero";
import Numbers from "./Numbers";
import Mission from "./Mission";
import Team from "../Universal/Team";
import Features from "./Features";
import FAQ from "../Universal/FAQ";
import Philosophy from "./Philosophy";
import CTA from "../Universal/CTA";
import { getAboutContent } from "@/lib/about";
import { AboutContentProvider } from "./AboutContentContext";

const AboutPage = async () => {
  const { page, sections, teamMembers } = await getAboutContent("en");
  const v = sections.sectionVisibility;

  return (
    <Layout>
      <AboutContentProvider value={{ page, sections, teamMembers }}>
        {v.hero && <Hero page={page} />}
        {v.numbers && <Numbers />}
        {v.mission && <Mission />}
        {v.team && <Team members={teamMembers} />}
        {v.features && <Features />}
        {v.philosophy && <Philosophy />}
        {v.faq && <FAQ />}
        <CTA />
      </AboutContentProvider>
    </Layout>
  );
};

export default AboutPage;
