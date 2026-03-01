import Layout from "@/components/Layout";
import Markdown from "./Markdown";

type ArticlePageProps = {
  article: {
    id: string;
    contentHtml: string;
    image: string;
    title: string;
    date: string;
    time: string;
  };
};

const ArticlePage = ({ article }: ArticlePageProps) => {
  return (
    <Layout>
      <Markdown article={article} />
    </Layout>
  );
};

export default ArticlePage;
