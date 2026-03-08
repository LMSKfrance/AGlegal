import Layout from "@/components/Layout";
import Hero from "./Hero";
import CTA from "../Universal/CTA";
import { getPageBySlug } from "@/lib/actions/pages";

const AppointmentPage = async () => {
  const page = await getPageBySlug("appointment");

  return (
    <Layout>
      <Hero page={page} />
      <CTA />
    </Layout>
  );
};

export default AppointmentPage;
