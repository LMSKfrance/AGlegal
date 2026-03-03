"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";

export type ServiceFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getServicesList() {
  return db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
}

export async function getServiceById(id: number) {
  const rows = await db.select().from(services).where(eq(services.id, id));
  return rows[0] ?? null;
}

export async function createService(prev: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
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

  const showOnHome = formData.get("showOnHome") ? 1 : 0;
  const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? "0";
  const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;

  await db.insert(services).values({
    slug,
    titleEn,
    titleKa: (formData.get("titleKa") as string)?.trim() || null,
    descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
    descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
    text1En: (formData.get("text1En") as string)?.trim() || null,
    text1Ka: (formData.get("text1Ka") as string)?.trim() || null,
    text2En: (formData.get("text2En") as string)?.trim() || null,
    text2Ka: (formData.get("text2Ka") as string)?.trim() || null,
    quoteEn: (formData.get("quoteEn") as string)?.trim() || null,
    quoteKa: (formData.get("quoteKa") as string)?.trim() || null,
    image: imagePath,
    thumbnailImage: thumbPath,
    showOnHome,
    homeOrder,
    homeShortDescriptionEn: (formData.get("homeShortDescriptionEn") as string)?.trim() || null,
    homeShortDescriptionKa: (formData.get("homeShortDescriptionKa") as string)?.trim() || null,
    homeLearnMoreUrl: (formData.get("homeLearnMoreUrl") as string)?.trim() || null,
    homeCardImage: homeCardPath,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/services", "layout");
  return { success: true };
}

export async function updateService(id: number, prev: ServiceFormState, formData: FormData): Promise<ServiceFormState> {
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

  const showOnHome = formData.get("showOnHome") ? 1 : 0;
  const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? `${existing.homeOrder ?? 0}`;
  const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;

  await db
    .update(services)
    .set({
      slug: newSlug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
      descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
      text1En: (formData.get("text1En") as string)?.trim() || null,
      text1Ka: (formData.get("text1Ka") as string)?.trim() || null,
      text2En: (formData.get("text2En") as string)?.trim() || null,
      text2Ka: (formData.get("text2Ka") as string)?.trim() || null,
      quoteEn: (formData.get("quoteEn") as string)?.trim() || null,
      quoteKa: (formData.get("quoteKa") as string)?.trim() || null,
      image: imagePath,
      thumbnailImage: thumbPath,
      showOnHome,
      homeOrder,
      homeShortDescriptionEn: (formData.get("homeShortDescriptionEn") as string)?.trim() || null,
      homeShortDescriptionKa: (formData.get("homeShortDescriptionKa") as string)?.trim() || null,
      homeLearnMoreUrl: (formData.get("homeLearnMoreUrl") as string)?.trim() || null,
      homeCardImage: homeCardPath,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(services.id, id));

  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/services", "layout");
  return { success: true };
}

export async function deleteService(id: number): Promise<void> {
  const row = await getServiceById(id);
  if (!row) {
    redirect("/admin/services?toast=error");
    return;
  }
  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/admin/services");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/services", "layout");
  redirect("/admin/services?toast=success");
}
