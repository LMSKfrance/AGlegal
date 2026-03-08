import Layout from "@/components/Layout";
import NewsListing from "./NewsListing";
import CTA from "../Universal/CTA";
import { getSortedArticles } from "@/lib/articles";

const NewsPage = async () => {
  const articles = await getSortedArticles();

  return (
    <Layout>
      <NewsListing articles={articles} />
      <CTA />
    </Layout>
  );
};

export default NewsPage;
