import Layout from "@/components/Layout";
import Hero from "./Hero";
import { getContactSettings, getContactFormVisible } from "@/lib/actions/contact";
import { getPageBySlug } from "@/lib/actions/pages";

const ContactPage = async () => {
  let contact = null;
  let page = null;
  let showForm = true;
  try {
    [contact, page, showForm] = await Promise.all([
      getContactSettings(),
      getPageBySlug("contact"),
      getContactFormVisible(),
    ]);
  } catch (err) {
    console.error("[ContactPage]", err);
  }

  return (
    <Layout>
      <Hero contact={contact} page={page} showForm={showForm} />
    </Layout>
  );
};

export default ContactPage;
