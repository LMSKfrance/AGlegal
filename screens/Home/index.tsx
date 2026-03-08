import Layout from "@/components/Layout";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Benefits from "./Benefits";
import Process from "./Process";
import News from "./News";
import CTA from "../Universal/CTA";
import Team from "../Universal/Team";
import { getSortedArticles } from "@/lib/articles";
import { getHomeContent } from "@/lib/home";
import { getHomeSectionVisibility } from "@/lib/home";
import { HomeContentProvider } from "./HomeContentContext";

const HomePage = async () => {
  const [articles, contentEn, contentKa, sectionVisibility] = await Promise.all([
    getSortedArticles(),
    getHomeContent("en"),
    getHomeContent("ka"),
    getHomeSectionVisibility(),
  ]);

  const v = sectionVisibility;

  return (
    <Layout>
      <HomeContentProvider value={{ contentEn, contentKa }}>
        {v.hero && <Hero />}
        {v.about && <About />}
        {v.services && <Services />}
        {v.benefits && <Benefits />}
        {v.process && <Process />}
        {v.team && <Team />}
        {v.news && <News articles={articles} />}
        {v.cta && <CTA />}
      </HomeContentProvider>
    </Layout>
  );
};

export default HomePage;
