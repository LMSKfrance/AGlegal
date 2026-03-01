import Layout from "@/components/Layout";
import Hero from "./Hero";
import About from "./About";
import Offices from "./Offices";
import Services from "./Services";
import Benefits from "./Benefits";
import Process from "./Process";
import Testimonials from "./Testimonials";
import FAQ from "../Universal/FAQ";
import News from "./News";
import CTA from "../Universal/CTA";
import Team from "../Universal/Team";

const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <Offices />
      <Services />
      <Benefits />
      <Process />
      <Testimonials />
      <Team />
      <FAQ />

      <News />
      <CTA />
    </Layout>
  );
};

export default HomePage;
