import TeamPage from "@/screens/Team";
import { getPageBySlug } from "@/lib/actions/pages";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("team");
  if (!page) return {};
  return {
    title: page.seoTitleEn || page.titleEn || undefined,
    description: page.metaDescriptionEn || undefined,
    openGraph: {
      title: page.ogTitleEn || page.seoTitleEn || page.titleEn || undefined,
      description: page.ogDescriptionEn || page.metaDescriptionEn || undefined,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
  };
}

const Team = () => {
  return <TeamPage />;
};

export default Team;
