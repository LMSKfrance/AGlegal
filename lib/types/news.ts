/**
 * News article type – template for DB-backed news pages.
 * Use this interface when migrating to a database (e.g. Prisma, Drizzle).
 */
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  description?: string;
  contentHtml: string;
  image?: string;
  thumbnailImage?: string;
  date: string;
  readTime?: string;
  tags?: string[];
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Shape returned by getArticleData – compatible with NewsArticle */
export type NewsArticleView = Pick<
  NewsArticle,
  "id" | "title" | "description" | "contentHtml" | "image" | "date" | "readTime"
> & {
  time?: string; // legacy alias for readTime
};
