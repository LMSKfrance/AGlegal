import { getHomeHeroSettings, getHomeAboutSettings, upsertHomeHeroSettings, upsertHomeAboutSettings } from "@/lib/actions/home";
import HomeForm from "./HomeForm";

export const dynamic = "force-dynamic";

export default async function HomepagePage() {
  const [hero, about] = await Promise.all([
    getHomeHeroSettings(),
    getHomeAboutSettings(),
  ]);

  return (
    <HomeForm
      heroAction={upsertHomeHeroSettings}
      aboutAction={upsertHomeAboutSettings}
      hero={hero}
      about={about}
    />
  );
}
