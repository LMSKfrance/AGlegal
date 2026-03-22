"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "./history";

export type ServiceFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getServicesList() {
  try {
    return await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
  } catch (err) {
    console.error("[getServicesList]", err);
    return [];
  }
}

export async function getServiceById(id: number) {
  try {
    const rows = await db.select().from(services).where(eq(services.id, id));
    return rows[0] ?? null;
  } catch (err) {
    console.error("[getServiceById]", err);
    return null;
  }
}

export async function createService(prev: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

    const slug = slugify(titleEn) || `service-${Date.now()}`;
    const existing = await db.select({ id: services.id }).from(services).where(eq(services.slug, slug));
    if (existing.length) return { error: "A service with this title already exists (slug conflict)." };

    const imageFile = formData.get("image");
    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const thumbFile = formData.get("thumbnailImage");
    let thumbPath: string | null = null;
    if (thumbFile && thumbFile instanceof File && thumbFile.size > 0) {
      const fd = new FormData();
      fd.append("image", thumbFile);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (result.success) thumbPath = result.path;
    }

    const homeCardFile = formData.get("homeCardImage");
    let homeCardPath: string | null = null;
    if (homeCardFile && homeCardFile instanceof File && homeCardFile.size > 0) {
      const fd = new FormData();
      fd.append("image", homeCardFile);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (result.success) homeCardPath = result.path;
    }

    const ogImageFile = formData.get("ogImage");
    let ogImagePath: string | null = null;
    if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const showOnHome = formData.get("showOnHome") ? 1 : 0;
    const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? "0";
    const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;
    const clickable = formData.get("clickable") ? 1 : 0;

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    await db.insert(services).values({
      slug,
      titleEn,
      titleKa: trim("titleKa"),
      descriptionEn: trim("descriptionEn"),
      descriptionKa: trim("descriptionKa"),
      text1En: trim("text1En"),
      text1Ka: trim("text1Ka"),
      text2En: trim("text2En"),
      text2Ka: trim("text2Ka"),
      quoteEn: trim("quoteEn"),
      quoteKa: trim("quoteKa"),
      image: imagePath,
      thumbnailImage: thumbPath,
      showOnHome,
      homeOrder,
      homeShortDescriptionEn: trim("homeShortDescriptionEn"),
      homeShortDescriptionKa: trim("homeShortDescriptionKa"),
      homeLearnMoreUrl: trim("homeLearnMoreUrl"),
      homeCardImage: homeCardPath,
      clickable,
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
    });

    revalidatePath("/admin/services");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/services", "layout");
    await logSave("Services", titleEn, "created");
    return { success: true };
  } catch (err) {
    console.error("[createService]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function updateService(id: number, prev: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Title (EN) is required", fieldErrors: { titleEn: "Required" } };

    const existing = await getServiceById(id);
    if (!existing) return { error: "Service not found." };

    const newSlug = slugify(titleEn) || existing.slug;
    if (newSlug !== existing.slug) {
      const conflict = await db.select().from(services).where(eq(services.slug, newSlug));
      if (conflict.length) return { error: "Another service already uses this title (slug conflict)." };
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

    const thumbFile = formData.get("thumbnailImage");
    let thumbPath: string | null = existing.thumbnailImage;
    if (thumbFile && thumbFile instanceof File && thumbFile.size > 0) {
      const fd = new FormData();
      fd.append("image", thumbFile);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (result.success) thumbPath = result.path;
    }

    const homeCardFile = formData.get("homeCardImage");
    let homeCardPath: string | null = existing.homeCardImage;
    if (homeCardFile && homeCardFile instanceof File && homeCardFile.size > 0) {
      const fd = new FormData();
      fd.append("image", homeCardFile);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (result.success) homeCardPath = result.path;
    }

    const ogImageFile = formData.get("ogImage");
    let ogImagePath: string | null = existing.ogImage;
    if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const showOnHome = formData.get("showOnHome") ? 1 : 0;
    const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? `${existing.homeOrder ?? 0}`;
    const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;
    const clickable = formData.get("clickable") ? 1 : 0;

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    await db
      .update(services)
      .set({
        slug: newSlug,
        titleEn,
        titleKa: trim("titleKa"),
        descriptionEn: trim("descriptionEn"),
        descriptionKa: trim("descriptionKa"),
        text1En: trim("text1En"),
        text1Ka: trim("text1Ka"),
        text2En: trim("text2En"),
        text2Ka: trim("text2Ka"),
        quoteEn: trim("quoteEn"),
        quoteKa: trim("quoteKa"),
        image: imagePath,
        thumbnailImage: thumbPath,
        showOnHome,
        homeOrder,
        homeShortDescriptionEn: trim("homeShortDescriptionEn"),
        homeShortDescriptionKa: trim("homeShortDescriptionKa"),
        homeLearnMoreUrl: trim("homeLearnMoreUrl"),
        homeCardImage: homeCardPath,
        clickable,
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
      })
      .where(eq(services.id, id));

    revalidatePath("/admin/services");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/services", "layout");
    await logSave("Services", titleEn, "updated", { type: "service", id: existing.id, data: existing });
    return { success: true };
  } catch (err) {
    console.error("[updateService]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deleteService(id: number): Promise<void> {
  let deleted = false;
  try {
    const row = await getServiceById(id);
    if (row) {
      await db.delete(services).where(eq(services.id, id));
      revalidatePath("/admin/services");
      revalidatePath("/admin");
      revalidatePath("/");
      revalidatePath("/services", "layout");
      await logSave("Services", row.titleEn, "deleted", { type: "service", id: row.id, data: row });
      deleted = true;
    }
  } catch (err) {
    console.error("[deleteService]", err);
  }
  redirect(deleted ? "/admin/services?toast=success" : "/admin/services?toast=error");
}

export async function reorderServices(orderedIds: number[]): Promise<void> {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        db.update(services).set({ sortOrder: index }).where(eq(services.id, id))
      )
    );
    revalidatePath("/admin/services");
    revalidatePath("/");
    revalidatePath("/services", "layout");
  } catch (err) {
    console.error("[reorderServices]", err);
  }
}
