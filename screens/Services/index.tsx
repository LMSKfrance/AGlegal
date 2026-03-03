import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "@/screens/Universal/CTA";
import { getServices } from "@/lib/services";
import type { Locale } from "@/lib/db/locale";

const ServicesPage = async () => {
  const locale: Locale = "en";
  const services = await getServices(locale);

  return (
    <Layout>
      <Hero services={services} />
      <CTA />
    </Layout>
  );
};

export default ServicesPage;
