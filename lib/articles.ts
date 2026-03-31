import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { pick, type Locale } from "@/lib/db/locale";
import moment from "moment";

export type Article = {
  id: string;
  image?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  tags: string[];
  type?: "main" | "side";
};

export const getSortedArticles = async (locale: Locale = "en"): Promise<Article[]> => {
  try {
    const rows = await db.select().from(articles).orderBy(desc(articles.date));
    return rows.map((row) => mapRow(row, locale));
  } catch (err) {
    console.error("[getSortedArticles]", err);
    return [];
  }
};

export const getArticleData = async (id: string, locale: Locale = "en") => {
  try {
    const rows = await db.select().from(articles).where(eq(articles.slug, id));
    const row = rows[0];
    if (!row) throw new Error(`Article not found: ${id}`);

    return {
      id: row.slug,
      contentHtml: pick(locale, row.contentEn, row.contentKa) ?? "",
      image: row.image,
      ogImage: row.ogImage,
      title: pick(locale, row.titleEn, row.titleKa),
      description: pick(locale, row.descriptionEn, row.descriptionKa) ?? "",
      date: moment(row.date, "YYYY-MM-DD").format("MMM D, YYYY"),
      time: row.time,
    };
  } catch (err) {
    console.error("[getArticleData]", err);
    throw err;
  }
};

function mapRow(
  row: typeof articles.$inferSelect,
  locale: Locale
): Article {
  return {
    id: row.slug,
    image: row.image ?? undefined,
    title: pick(locale, row.titleEn, row.titleKa),
    description: pick(locale, row.descriptionEn, row.descriptionKa) ?? "",
    date: moment(row.date, "YYYY-MM-DD").format("MMM D, YYYY"),
    time: row.time ?? undefined,
    tags: row.tags ?? [],
    type: row.type as Article["type"],
  };
}
