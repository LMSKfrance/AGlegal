import Layout from "@/components/Layout";
import Hero from "./Hero";
import { getContactSettings } from "@/lib/actions/contact";

const ContactPage = async () => {
  const contact = await getContactSettings();

  return (
    <Layout>
      <Hero contact={contact} />
    </Layout>
  );
};

export default ContactPage;
