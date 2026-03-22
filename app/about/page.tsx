import AboutPage from "@/screens/About";
import { getPageBySlug } from "@/lib/actions/pages";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about");
  if (!page) return {};
  return {
    title: page.seoTitleEn || page.titleEn || undefined,
    description: page.metaDescriptionEn || undefined,
    openGraph: {
      title: page.ogTitleEn || page.seoTitleEn || page.titleEn || undefined,
      description: page.ogDescriptionEn || page.metaDescriptionEn || undefined,
      images: page.ogImage ? [{ url: page.ogImage, alt: page.titleEn }] : [],
    },
  };
}

const About = () => {
  return <AboutPage />;
};

export default About;
