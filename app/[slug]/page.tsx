import { getPageBySlug } from "@/lib/actions/pages";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LegalPage from "@/screens/LegalPage";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};
  return {
    title: `${page.seoTitleEn || page.titleEn} | AG Legal`,
    description: page.metaDescriptionEn ?? undefined,
    openGraph: {
      title: page.ogTitleEn || page.titleEn,
      description: page.ogDescriptionEn ?? undefined,
      images: page.ogImage ? [{ url: page.ogImage }] : [],
    },
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <LegalPage
      titleEn={page.titleEn}
      titleKa={page.titleKa ?? null}
      contentEn={page.contentEn ?? ""}
      contentKa={page.contentKa ?? null}
      heroImage={page.heroImage ?? null}
      ctaTextEn={page.ctaTextEn ?? null}
      ctaTextKa={page.ctaTextKa ?? null}
      ctaUrl={page.ctaUrl ?? null}
    />
  );
}
