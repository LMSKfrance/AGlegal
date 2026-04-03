import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "@/screens/Universal/CTA";
import { getServices, type Service } from "@/lib/services";
import { getPageBySlug } from "@/lib/actions/pages";
import type { Locale } from "@/lib/db/locale";

const ServicesPage = async ({ locale = "en" }: { locale?: Locale }) => {
  let services: Service[] = [];
  let page = null;
  try {
    [services, page] = await Promise.all([
      getServices(locale),
      getPageBySlug("services"),
    ]);
  } catch (err) {
    console.error("[ServicesPage]", err);
  }

  return (
    <Layout>
      <Hero services={services} page={page} />
      <CTA />
    </Layout>
  );
};

export default ServicesPage;
