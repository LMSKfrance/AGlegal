import Layout from "@/components/Layout";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Benefits from "./Benefits";
import Process from "./Process";
import News from "./News";
import CTA from "../Universal/CTA";
import Team from "../Universal/Team";
import { getSortedArticles, type Article } from "@/lib/articles";
import { getHomeContent, getHomeSectionVisibility, HOME_SECTION_IDS, type HomeContent, type HomeSectionVisibility } from "@/lib/home";
import { HomeContentProvider } from "./HomeContentContext";

const EMPTY_HOME_CONTENT: HomeContent = {
  hero: { brand: "", title: "", cta: "", description: "", image: "" },
  about: { title: "", description: "", image: "" },
  servicesHeading: { title: "", description: "" },
  benefitsHeading: { title: "" },
  processHeading: { title: "", description: "" },
  services: [],
  benefits: [],
  tabs: [],
  teamMembers: [],
  cta: { subtitle: "", title: "", button: "", buttonUrl: "/appointment" },
};

const ALL_VISIBLE: HomeSectionVisibility = Object.fromEntries(
  HOME_SECTION_IDS.map((id) => [id, true])
) as HomeSectionVisibility;

const HomePage = async () => {
  let articles: Article[] = [];
  let contentEn: HomeContent = EMPTY_HOME_CONTENT;
  let contentKa: HomeContent = EMPTY_HOME_CONTENT;
  let sectionVisibility: HomeSectionVisibility = ALL_VISIBLE;

  try {
    [articles, contentEn, contentKa, sectionVisibility] = await Promise.all([
      getSortedArticles(),
      getHomeContent("en"),
      getHomeContent("ka"),
      getHomeSectionVisibility(),
    ]);
  } catch (err) {
    console.error("[HomePage]", err);
  }

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
