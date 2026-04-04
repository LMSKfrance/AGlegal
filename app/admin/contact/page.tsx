import { getContactSettings, upsertContactSettings, upsertContactPageSeo, getContactFormVisible, setContactFormVisible } from "@/lib/actions/contact";
import { getPageBySlug } from "@/lib/actions/pages";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [contact, seoPage, formVisible] = await Promise.all([
    getContactSettings(),
    getPageBySlug("contact"),
    getContactFormVisible(),
  ]);

  return (
    <ContactForm
      contact={contact}
      saveAction={upsertContactSettings}
      seoPage={seoPage}
      saveSeoAction={upsertContactPageSeo}
      formVisible={formVisible}
      setFormVisibleAction={setContactFormVisible}
    />
  );
}
