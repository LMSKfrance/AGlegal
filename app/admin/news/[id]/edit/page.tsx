import { notFound } from "next/navigation";
import { getNewsById, updateNews } from "@/lib/actions/news";
import NewsForm from "../../NewsForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getNewsById(Number(id));
  if (!article) notFound();

  const action = updateNews.bind(null, article.id);
  return <NewsForm action={action} article={article} />;
}
