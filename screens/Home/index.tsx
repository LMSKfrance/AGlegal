import Layout from "@/components/Layout";
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Benefits from "./Benefits";
import Process from "./Process";
import News from "./News";
import CTA from "../Universal/CTA";
import Team from "../Universal/Team";

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <Services />
      <Benefits />
      <Process />
      <Team />
      <News />
      <CTA />
    </Layout>
  );
};

export default HomePage;
