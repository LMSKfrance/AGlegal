"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "./history";

export type NewsFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getNewsList() {
  try {
    return await db.select().from(articles).orderBy(desc(articles.date), desc(articles.id));
  } catch (err) {
    console.error("[getNewsList]", err);
    return [];
  }
}

export async function getNewsById(id: number) {
  try {
    const rows = await db.select().from(articles).where(eq(articles.id, id));
    return rows[0] ?? null;
  } catch (err) {
    console.error("[getNewsById]", err);
    return null;
  }
}

export async function createNews(prev: NewsFormState, formData: FormData): Promise<NewsFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

    const date = (formData.get("date") as string)?.trim();
    if (!date) return { error: "Date is required", fieldErrors: { date: "Required" } };

    const slug = slugify(titleEn) || `news-${Date.now()}`;
    const existing = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug));
    if (existing.length) return { error: "An article with this title already exists (slug conflict)." };

    const imageFile = formData.get("image");
    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const tagsRaw = formData.get("tags") as string | null;
    const tags: string[] = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    const now = new Date().toISOString();
    await db.insert(articles).values({
      slug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
      descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
      contentEn: (formData.get("contentEn") as string)?.trim() || null,
      contentKa: (formData.get("contentKa") as string)?.trim() || null,
      image: imagePath,
      date,
      time: (formData.get("time") as string)?.trim() || null,
      tags: tags.length ? tags : null,
      type: (formData.get("type") as string)?.trim() || null,
      updatedAt: now,
    });

    revalidatePath("/admin/news");
    revalidatePath("/admin");
    await logSave("News", titleEn, "created");
    return { success: true };
  } catch (err) {
    console.error("[createNews]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function updateNews(id: number, prev: NewsFormState, formData: FormData): Promise<NewsFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

    const date = (formData.get("date") as string)?.trim();
    if (!date) return { error: "Date is required", fieldErrors: { date: "Required" } };

    const existing = await getNewsById(id);
    if (!existing) return { error: "Article not found." };

    const newSlug = slugify(titleEn) || existing.slug;
    if (newSlug !== existing.slug) {
      const conflict = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, newSlug));
      if (conflict.length) return { error: "Another article already uses this title (slug conflict)." };
    }

    const imageFile = formData.get("image");
    let imagePath: string | null = existing.image;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const tagsRaw = formData.get("tags") as string | null;
    const tags: string[] = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    await db
      .update(articles)
      .set({
        slug: newSlug,
        titleEn,
        titleKa: (formData.get("titleKa") as string)?.trim() || null,
        descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
        descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
        contentEn: (formData.get("contentEn") as string)?.trim() || null,
        contentKa: (formData.get("contentKa") as string)?.trim() || null,
        image: imagePath,
        date,
        time: (formData.get("time") as string)?.trim() || null,
        tags: tags.length ? tags : null,
        type: (formData.get("type") as string)?.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(articles.id, id));

    revalidatePath("/admin/news");
    revalidatePath("/admin");
    revalidatePath(`/news/${existing.slug}`);
    await logSave("News", titleEn, "updated");
    return { success: true };
  } catch (err) {
    console.error("[updateNews]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deleteNews(id: number): Promise<void> {
  let deleted = false;
  try {
    const row = await getNewsById(id);
    if (row) {
      await db.delete(articles).where(eq(articles.id, id));
      revalidatePath("/admin/news");
      revalidatePath("/admin");
      await logSave("News", row.titleEn, "deleted");
      deleted = true;
    }
  } catch (err) {
    console.error("[deleteNews]", err);
  }
  redirect(deleted ? "/admin/news?toast=success" : "/admin/news?toast=error");
}
