import { getContactSettings, upsertContactSettings, upsertContactPageSeo } from "@/lib/actions/contact";
import { getPageBySlug } from "@/lib/actions/pages";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [contact, seoPage] = await Promise.all([
    getContactSettings(),
    getPageBySlug("contact"),
  ]);

  return (
    <ContactForm
      contact={contact}
      saveAction={upsertContactSettings}
      seoPage={seoPage}
      saveSeoAction={upsertContactPageSeo}
    />
  );
}
