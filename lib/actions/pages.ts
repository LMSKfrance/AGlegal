"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "./history";

export type PageFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getPagesList() {
  try {
    return await db.select().from(pages).orderBy(asc(pages.sortOrder), asc(pages.id));
  } catch (err) {
    console.error("[getPagesList]", err);
    return [];
  }
}

export async function getPageById(id: number) {
  try {
    const rows = await db.select().from(pages).where(eq(pages.id, id));
    return rows[0] ?? null;
  } catch (err) {
    console.error("[getPageById]", err);
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  try {
    const rows = await db.select().from(pages).where(eq(pages.slug, slug));
    return rows[0] ?? null;
  } catch (err) {
    console.error("[getPageBySlug]", err);
    return null;
  }
}

export async function createPage(prev: PageFormState, formData: FormData): Promise<PageFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

    const slugInput = (formData.get("slug") as string)?.trim();
    const slug = slugInput ? slugify(slugInput) : slugify(titleEn);
    if (!slug) return { error: "Slug is required (e.g. about, contact).", fieldErrors: { slug: "Required" } };

    const existing = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, slug));
    if (existing.length) return { error: "A page with this slug already exists." };

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    await db.insert(pages).values({
      slug,
      titleEn,
      titleKa: trim("titleKa"),
      contentEn: trim("contentEn"),
      contentKa: trim("contentKa"),
      metaDescriptionEn: trim("metaDescriptionEn"),
      metaDescriptionKa: trim("metaDescriptionKa"),
      seoTitleEn: trim("seoTitleEn"),
      seoTitleKa: trim("seoTitleKa"),
      ogTitleEn: trim("ogTitleEn"),
      ogTitleKa: trim("ogTitleKa"),
      ogDescriptionEn: trim("ogDescriptionEn"),
      ogDescriptionKa: trim("ogDescriptionKa"),
      ogImage: trim("ogImage"),
      updatedAt: new Date().toISOString(),
    });

    revalidatePath("/admin/pages");
    revalidatePath("/admin");
    revalidatePath(`/${slug}`);
    await logSave("Pages", titleEn, "created");
    return { success: true };
  } catch (err) {
    console.error("[createPage]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function updatePage(id: number, prev: PageFormState, formData: FormData): Promise<PageFormState> {
  try {
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

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    await db
      .update(pages)
      .set({
        slug: newSlug,
        titleEn,
        titleKa: trim("titleKa"),
        contentEn: trim("contentEn"),
        contentKa: trim("contentKa"),
        metaDescriptionEn: trim("metaDescriptionEn"),
        metaDescriptionKa: trim("metaDescriptionKa"),
        seoTitleEn: trim("seoTitleEn"),
        seoTitleKa: trim("seoTitleKa"),
        ogTitleEn: trim("ogTitleEn"),
        ogTitleKa: trim("ogTitleKa"),
        ogDescriptionEn: trim("ogDescriptionEn"),
        ogDescriptionKa: trim("ogDescriptionKa"),
        ogImage: trim("ogImage"),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(pages.id, id));

    revalidatePath("/admin/pages");
    revalidatePath("/admin");
    revalidatePath(`/${newSlug}`);
    if (newSlug !== existing.slug) revalidatePath(`/${existing.slug}`);
    await logSave("Pages", titleEn, "updated");
    return { success: true };
  } catch (err) {
    console.error("[updatePage]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deletePage(id: number): Promise<void> {
  let deleted = false;
  let slug = "";
  try {
    const row = await getPageById(id);
    if (row) {
      slug = row.slug;
      await db.delete(pages).where(eq(pages.id, id));
      revalidatePath("/admin/pages");
      revalidatePath("/admin");
      revalidatePath(`/${slug}`);
      await logSave("Pages", row.titleEn, "deleted");
      deleted = true;
    }
  } catch (err) {
    console.error("[deletePage]", err);
  }
  redirect(deleted ? "/admin/pages?toast=success" : "/admin/pages?toast=error");
}
