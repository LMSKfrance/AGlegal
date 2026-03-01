import Layout from "@/components/Layout";
import CTA from "@/screens/Universal/CTA";
import Hero from "./Hero";

type ServicePageProps = {
  service: {
    id: number;
    image: string;
    title: string;
    text1: string;
    text2: string;
    quote: string;
    thumbnail_image: string;
    slug: string;
  };
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
