import { getAboutSectionSettings } from "@/lib/about";
import { upsertAboutSectionSettings } from "@/lib/actions/about";
import AboutForm from "./AboutForm";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const settings = await getAboutSectionSettings();
  return <AboutForm settings={settings} saveAction={upsertAboutSectionSettings} />;
}
