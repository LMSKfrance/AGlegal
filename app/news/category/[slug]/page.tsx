import Layout from "@/components/Layout";
import NewsListing from "@/screens/News/NewsListing";
import CTA from "@/screens/Universal/CTA";
import { getSortedArticles } from "@/lib/articles";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const CATEGORY_SLUGS: Record<string, string> = {
  "corporate-law": "Corporate Law",
  "family-law": "Family Law",
  "real-estate": "Real Estate",
  "personal-injury": "Personal Injury",
  "criminal-defense": "Criminal Defense",
  immigration: "Immigration",
  "legal-trends": "Legal Trends",
  "case-studies": "Case Studies",
  "tips-guides": "Tips & Guides",
};

const NewsCategoryPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const category = CATEGORY_SLUGS[slug];

  if (!category) {
    notFound();
  }

  const articles = await getSortedArticles();

  return (
    <Layout>
      <NewsListing articles={articles} initialTag={category} />
      <CTA />
    </Layout>
  );
};

export default NewsCategoryPage;
