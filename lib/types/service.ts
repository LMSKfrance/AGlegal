/**
 * Service types – template for DB-backed service detail pages.
 * Use these interfaces when migrating to a database (e.g. Prisma, Drizzle).
 */

/** DB row shape – adjust to match your schema */
export interface ServiceDbRow {
  id: string | number;
  slug: string;
  title: string;
  description?: string | null;
  text1: string;
  text2: string;
  quote: string;
  image?: string | null;
  imageUrl?: string | null;
  thumbnailImage?: string | null;
  thumbnail_image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** View model used by service detail page components */
export interface Service {
  id: number | string;
  slug: string;
  title: string;
  description?: string;
  text1: string;
  text2: string;
  quote: string;
  image: string;
  ogImage?: string | null;
  thumbnail_image: string;
  clickable: number;
}
