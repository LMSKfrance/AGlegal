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

const HomePage = () => {
  const articles = getSortedArticles();

  return (
    <Layout>
      <Hero />
      <About />
      <Services />
      <Benefits />
      <Process />
      <Team />
      <News articles={articles} />
      <CTA />
    </Layout>
  );
};

export default HomePage;
