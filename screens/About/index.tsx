import Layout from "@/components/Layout";
import Hero from "./Hero";
import Numbers from "./Numbers";
import Mission from "./Mission";
import Team from "../Universal/Team";
import Features from "./Features";
import FAQ from "../Universal/FAQ";
import Philosophy from "./Philosophy";
import { getPageBySlug } from "@/lib/actions/pages";

const AboutPage = async () => {
  const page = await getPageBySlug("about");

  return (
    <Layout>
      <Hero page={page} />
      <Numbers />
      <Mission />
      <Team />
      <Features />
      <Philosophy />
      <FAQ />
    </Layout>
  );
};

export default AboutPage;
