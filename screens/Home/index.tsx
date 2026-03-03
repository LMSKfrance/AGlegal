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
import { HomeContentProvider } from "./HomeContentContext";

const HomePage = async () => {
  // Server-side we default to English; client-side language
  // switching is handled by the LanguageContext.
  const locale: "en" | "ka" = "en";
  const [articles, homeContent] = await Promise.all([
    getSortedArticles(),
    getHomeContent(locale),
  ]);

  return (
    <Layout>
      <HomeContentProvider value={homeContent}>
        <Hero />
        <About />
        <Services />
        <Benefits />
        <Process />
        <Team />
        <News articles={articles} />
        <CTA />
      </HomeContentProvider>
    </Layout>
  );
};

export default HomePage;
