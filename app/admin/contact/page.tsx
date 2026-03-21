import { getContactSettings, upsertContactSettings } from "@/lib/actions/contact";
import ContactForm from "./ContactForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await getContactSettings();
  return <ContactForm contact={contact} saveAction={upsertContactSettings} />;
}
