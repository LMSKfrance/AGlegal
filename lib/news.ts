/**
 * News data layer – template for DB-backed news.
 * Replace getNewsArticleBySlug implementation with a DB query when ready.
 */
import { getArticleData } from "./articles";
import type { NewsArticle } from "./types/news";

export type NewsArticleData = {
  id: string;
  contentHtml: string;
  image: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
};

/**
 * Fetch a single news article by slug.
 * Currently uses file-based articles; swap for DB when migrating.
 *
 * Example DB implementation:
 *   const article = await db.newsArticle.findUnique({ where: { slug } });
 *   return mapDbToNewsArticle(article);
 */
export async function getNewsArticleBySlug(
  slug: string
): Promise<NewsArticleData | null> {
  try {
    const data = await getArticleData(slug);
    return {
      id: data.id,
      contentHtml: data.contentHtml,
      image: data.image || "",
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
    };
  } catch {
    return null;
  }
}

/**
 * Map DB entity to NewsArticle (for future use).
 */
export function mapDbToNewsArticle(row: {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  content: string;
  imageUrl?: string | null;
  thumbnailUrl?: string | null;
  publishedAt: Date;
  readTimeMinutes?: number | null;
  tags?: string[] | null;
  category?: string | null;
}): NewsArticle {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? undefined,
    contentHtml: row.content,
    image: row.imageUrl ?? undefined,
    thumbnailImage: row.thumbnailUrl ?? undefined,
    date: row.publishedAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    readTime: row.readTimeMinutes ? `${row.readTimeMinutes} min` : undefined,
    tags: row.tags ?? undefined,
    category: row.category ?? undefined,
  };
}
