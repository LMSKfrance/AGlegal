import Layout from "@/components/Layout";
import NewsListing from "./NewsListing";
import CTA from "../Universal/CTA";
import { getSortedArticles } from "@/lib/articles";
import type { Locale } from "@/lib/db/locale";

const NewsPage = async ({ locale = "en" }: { locale?: Locale }) => {
  const articles = await getSortedArticles(locale);

  return (
    <Layout>
      <NewsListing articles={articles} />
      <CTA />
    </Layout>
  );
};

export default NewsPage;
