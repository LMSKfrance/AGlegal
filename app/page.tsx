import HomePage from "@/screens/Home";
import { getHomeSeoSettings } from "@/lib/actions/home";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomeSeoSettings();
  return {
    title: seo.seoTitleEn || "AG Legal",
    description: seo.metaDescriptionEn || undefined,
    openGraph: {
      title: seo.ogTitleEn || seo.seoTitleEn || "AG Legal",
      description: seo.ogDescriptionEn || seo.metaDescriptionEn || undefined,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    },
  };
}

export default function Home() {
  return <HomePage />;
}
