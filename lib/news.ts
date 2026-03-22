import { getArticleData } from "./articles";
import type { Locale } from "@/lib/db/locale";

export type NewsArticleData = {
  id: string;
  contentHtml: string;
  image: string;
  ogImage?: string | null;
  title: string;
  description?: string;
  date: string;
  time?: string;
};

export async function getNewsArticleBySlug(
  slug: string,
  locale: Locale = "en"
): Promise<NewsArticleData | null> {
  try {
    const data = await getArticleData(slug, locale);
    return {
      id: data.id,
      contentHtml: data.contentHtml,
      image: data.image || "",
      ogImage: data.ogImage,
      title: data.title,
      description: data.description ?? undefined,
      date: data.date,
      time: data.time ?? undefined,
    };
  } catch {
    return null;
  }
}
