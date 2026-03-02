import { getNewsArticleBySlug } from "@/lib/news";
import ArticlePage from "@/screens/Article";
import { notFound } from "next/navigation";

const NewsArticlePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
};

export default NewsArticlePage;
