"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";

export type PageFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getPagesList() {
  return db.select().from(pages).orderBy(asc(pages.sortOrder), asc(pages.id));
}

export async function getPageById(id: number) {
  const rows = await db.select().from(pages).where(eq(pages.id, id));
  return rows[0] ?? null;
}

export async function getPageBySlug(slug: string) {
  const rows = await db.select().from(pages).where(eq(pages.slug, slug));
  return rows[0] ?? null;
}

export async function createPage(prev: PageFormState, formData: FormData): Promise<PageFormState> {
  const titleEn = (formData.get("titleEn") as string)?.trim();
  if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

  const slugInput = (formData.get("slug") as string)?.trim();
  const slug = slugInput ? slugify(slugInput) : slugify(titleEn);
  if (!slug) return { error: "Slug is required (e.g. about, contact).", fieldErrors: { slug: "Required" } };

  const existing = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, slug));
  if (existing.length) return { error: "A page with this slug already exists." };

  await db.insert(pages).values({
    slug,
    titleEn,
    titleKa: (formData.get("titleKa") as string)?.trim() || null,
    contentEn: (formData.get("contentEn") as string)?.trim() || null,
    contentKa: (formData.get("contentKa") as string)?.trim() || null,
    metaDescriptionEn: (formData.get("metaDescriptionEn") as string)?.trim() || null,
    metaDescriptionKa: (formData.get("metaDescriptionKa") as string)?.trim() || null,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/pages");
  revalidatePath("/admin");
  return { success: true };
}

export async function updatePage(id: number, prev: PageFormState, formData: FormData): Promise<PageFormState> {
  const titleEn = (formData.get("titleEn") as string)?.trim();
  if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

  const existing = await getPageById(id);
  if (!existing) return { error: "Page not found." };

  const slugInput = (formData.get("slug") as string)?.trim();
  const newSlug = slugInput ? slugify(slugInput) : existing.slug;
  if (!newSlug) return { error: "Slug is required.", fieldErrors: { slug: "Required" } };

  if (newSlug !== existing.slug) {
    const conflict = await db.select().from(pages).where(eq(pages.slug, newSlug));
    if (conflict.length) return { error: "Another page already uses this slug." };
  }

  await db
    .update(pages)
    .set({
      slug: newSlug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      contentEn: (formData.get("contentEn") as string)?.trim() || null,
      contentKa: (formData.get("contentKa") as string)?.trim() || null,
      metaDescriptionEn: (formData.get("metaDescriptionEn") as string)?.trim() || null,
      metaDescriptionKa: (formData.get("metaDescriptionKa") as string)?.trim() || null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(pages.id, id));

  revalidatePath("/admin/pages");
  revalidatePath("/admin");
  return { success: true };
}

export async function deletePage(id: number): Promise<void> {
  const row = await getPageById(id);
  if (!row) {
    redirect("/admin/pages?toast=error");
    return;
  }
  await db.delete(pages).where(eq(pages.id, id));
  revalidatePath("/admin/pages");
  revalidatePath("/admin");
  redirect("/admin/pages?toast=success");
}
