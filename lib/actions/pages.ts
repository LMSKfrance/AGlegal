"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "./history";

export type PageFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };
export type TeamPageSeoState = { success?: boolean; error?: string };

export async function upsertTeamPageSeo(
  _prev: TeamPageSeoState,
  formData: FormData
): Promise<TeamPageSeoState> {
  try {
    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;

    const existing = await db.select().from(pages).where(eq(pages.slug, "team")).limit(1);
    let ogImagePath: string | null = existing[0]?.ogImage ?? null;
    const removeOg = formData.get("removeOgImage") === "1";
    if (removeOg) {
      ogImagePath = null;
    } else {
      const ogImageFile = formData.get("ogImage");
      if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
        const { uploadImage } = await import("@/lib/actions/upload");
        const fd = new FormData();
        fd.append("image", ogImageFile);
        const result = await uploadImage(fd);
        if (result.success) ogImagePath = result.path;
      }
    }

    const payload = {
      slug: "team",
      titleEn: "Team",
      metaDescriptionEn: trim("metaDescriptionEn"),
      metaDescriptionKa: trim("metaDescriptionKa"),
      seoTitleEn: trim("seoTitleEn"),
      seoTitleKa: trim("seoTitleKa"),
      ogTitleEn: trim("ogTitleEn"),
      ogTitleKa: trim("ogTitleKa"),
      ogDescriptionEn: trim("ogDescriptionEn"),
      ogDescriptionKa: trim("ogDescriptionKa"),
      ogImage: ogImagePath,
      updatedAt: new Date().toISOString(),
    };

    if (existing.length) {
      await db.update(pages).set(payload).where(eq(pages.slug, "team"));
    } else {
      await db.insert(pages).values(payload);
    }

    revalidatePath("/team");
    revalidatePath("/admin/team");
    await logSave("Team", "Page SEO", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertTeamPageSeo]", err);
    return { error: "Failed to save. Please try again." };
  }
}

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

    const { uploadImage } = await import("@/lib/actions/upload");

    const ogImageFile = formData.get("ogImage");
    let ogImagePath: string | null = null;
    if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const heroImageFile = formData.get("heroImage");
    let heroImagePath: string | null = null;
    if (heroImageFile && heroImageFile instanceof File && heroImageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", heroImageFile);
      const result = await uploadImage(fd);
      if (result.success) heroImagePath = result.path;
    }

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
      ogImage: ogImagePath,
      heroImage: heroImagePath,
      ctaTextEn: trim("ctaTextEn"),
      ctaTextKa: trim("ctaTextKa"),
      ctaUrl: trim("ctaUrl"),
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

    const { uploadImage } = await import("@/lib/actions/upload");

    const ogImageFile = formData.get("ogImage");
    let ogImagePath: string | null = existing.ogImage;
    if (formData.get("removeOgImage") === "1") {
      ogImagePath = null;
    } else if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const heroImageFile = formData.get("heroImage");
    let heroImagePath: string | null = existing.heroImage ?? null;
    if (formData.get("removeHeroImage") === "1") {
      heroImagePath = null;
    } else if (heroImageFile && heroImageFile instanceof File && heroImageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", heroImageFile);
      const result = await uploadImage(fd);
      if (result.success) heroImagePath = result.path;
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
        ogImage: ogImagePath,
        heroImage: heroImagePath,
        ctaTextEn: trim("ctaTextEn"),
        ctaTextKa: trim("ctaTextKa"),
        ctaUrl: trim("ctaUrl"),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(pages.id, id));

    revalidatePath("/admin/pages");
    revalidatePath("/admin");
    revalidatePath(`/${newSlug}`);
    if (newSlug !== existing.slug) revalidatePath(`/${existing.slug}`);
    await logSave("Pages", titleEn, "updated", { type: "page", id: existing.id, data: existing });
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
      await logSave("Pages", row.titleEn, "deleted", { type: "page", id: row.id, data: row });
      deleted = true;
    }
  } catch (err) {
    console.error("[deletePage]", err);
  }
  redirect(deleted ? "/admin/pages?toast=success" : "/admin/pages?toast=error");
}
