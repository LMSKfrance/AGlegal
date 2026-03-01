import { getArticleData } from "@/lib/articles";
import ArticlePage from "@/screens/Article";

const Article = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const articleData = await getArticleData(slug);

  return <ArticlePage article={articleData} />;
};

export default Article;
