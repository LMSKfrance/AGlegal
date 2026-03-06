import { getNewsArticleBySlug } from "@/lib/news";
import ArticlePage from "@/screens/Article";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  if (!article) return { title: "News" };
  return {
    title: `${article.title} | AG Legal`,
    description: article.description,
    openGraph: {
      title: `${article.title} | AG Legal`,
      description: article.description,
      images: article.image ? [{ url: article.image, alt: article.title }] : [],
    },
  };
}

const NewsArticlePage = async ({ params }: Props) => {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
};

export default NewsArticlePage;
