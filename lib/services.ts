import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { pick, type Locale } from "@/lib/db/locale";
import type { Service } from "./types/service";

export type { Service } from "./types/service";

export async function getServiceBySlug(
  slug: string,
  locale: Locale = "en"
): Promise<Service | null> {
  try {
    const rows = await db.select().from(services).where(eq(services.slug, slug));
    const row = rows[0];
    if (!row) return null;
    return mapRow(row, locale);
  } catch (err) {
    console.error("[getServiceBySlug]", err);
    return null;
  }
}

export async function getServices(locale: Locale = "en"): Promise<Service[]> {
  try {
    const rows = await db.select().from(services).orderBy(asc(services.sortOrder));
    return rows.map((row) => mapRow(row, locale));
  } catch (err) {
    console.error("[getServices]", err);
    return [];
  }
}

function mapRow(
  row: typeof services.$inferSelect,
  locale: Locale
): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: pick(locale, row.titleEn, row.titleKa),
    description: pick(locale, row.descriptionEn, row.descriptionKa) ?? undefined,
    text1: pick(locale, row.text1En, row.text1Ka) ?? "",
    text2: pick(locale, row.text2En, row.text2Ka) ?? "",
    quote: pick(locale, row.quoteEn, row.quoteKa) ?? "",
    image: row.image ?? "",
    ogImage: row.ogImage,
    thumbnail_image: row.thumbnailImage ?? "",
    clickable: row.clickable ?? 1,
  };
}
