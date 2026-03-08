import Layout from "@/components/Layout";
import Hero from "./Hero";
import { getContactSettings } from "@/lib/actions/contact";
import { getPageBySlug } from "@/lib/actions/pages";

const ContactPage = async () => {
  const [contact, page] = await Promise.all([
    getContactSettings(),
    getPageBySlug("contact"),
  ]);

  return (
    <Layout>
      <Hero contact={contact} page={page} />
    </Layout>
  );
};

export default ContactPage;
