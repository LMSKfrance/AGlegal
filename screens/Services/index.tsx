import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "@/screens/Universal/CTA";
import { getServices } from "@/lib/services";
import { getPageBySlug } from "@/lib/actions/pages";
import type { Locale } from "@/lib/db/locale";

const ServicesPage = async () => {
  const locale: Locale = "en";
  const [services, page] = await Promise.all([
    getServices(locale),
    getPageBySlug("services"),
  ]);

  return (
    <Layout>
      <Hero services={services} page={page} />
      <CTA />
    </Layout>
  );
};

export default ServicesPage;
