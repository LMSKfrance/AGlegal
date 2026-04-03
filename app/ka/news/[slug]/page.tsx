import { getNewsArticleBySlug } from "@/lib/news";
import ArticlePage from "@/screens/Article";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const NewsArticleKa = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug, "ka");

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
};

export default NewsArticleKa;
