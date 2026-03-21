import { createNews } from "@/lib/actions/news";
import NewsForm from "../NewsForm";

export default function NewArticlePage() {
  return <NewsForm action={createNews} />;
}
