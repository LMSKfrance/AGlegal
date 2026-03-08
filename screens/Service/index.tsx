import Layout from "@/components/Layout";
import CTA from "@/screens/Universal/CTA";
import Hero from "./Hero";

import type { Service } from "@/lib/types/service";

type ServicePageProps = {
  service: Service;
};

const ServicePage = ({ service }: ServicePageProps) => {
  return (
    <Layout>
      <Hero service={service} />
      <CTA />
    </Layout>
  );
};

export default ServicePage;
