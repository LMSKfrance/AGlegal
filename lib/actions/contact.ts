"use server";

import { db } from "@/lib/db";
import { contactSettings, pages, siteSettings } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { logSave } from "./history";

export async function getContactFormVisible(): Promise<boolean> {
  try {
    const rows = await db.select({ valueEn: siteSettings.valueEn })
      .from(siteSettings).where(eq(siteSettings.key, "contact.form.visible")).limit(1);
    if (!rows.length) return true; // visible by default
    return rows[0].valueEn !== "0";
  } catch {
    return true;
  }
}

export async function setContactFormVisible(visible: boolean): Promise<void> {
  try {
    const existing = await db.select({ id: siteSettings.id })
      .from(siteSettings).where(eq(siteSettings.key, "contact.form.visible")).limit(1);
    const payload = { key: "contact.form.visible", valueEn: visible ? "1" : "0", valueKa: null, group: "contact", updatedAt: new Date().toISOString() };
    if (!existing.length) await db.insert(siteSettings).values(payload);
    else await db.update(siteSettings).set(payload).where(eq(siteSettings.id, existing[0].id));
    revalidatePath("/contact");
    revalidatePath("/ka/contact");
    revalidatePath("/admin/contact");
  } catch (err) {
    console.error("[setContactFormVisible]", err);
  }
}

export type ContactSeoFormState = { success?: boolean; error?: string };

export async function upsertContactPageSeo(
  _prev: ContactSeoFormState,
  formData: FormData
): Promise<ContactSeoFormState> {
  try {
    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;

    const existing = await db.select().from(pages).where(eq(pages.slug, "contact")).limit(1);
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
      slug: "contact",
      titleEn: trim("titleEn") ?? "Contact",
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
      updatedAt: new Date().toISOString(),
    };

    if (existing.length) {
      await db.update(pages).set(payload).where(eq(pages.slug, "contact"));
    } else {
      await db.insert(pages).values(payload);
    }

    revalidatePath("/contact");
    revalidatePath("/admin/contact");
    await logSave("Contact", "Page SEO", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertContactPageSeo]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function getContactSettings() {
  const rows = await db.select().from(contactSettings).limit(1);
  return rows[0] ?? null;
}

export async function upsertContactSettings(
  prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  try {
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();

    const values = {
      titleEn: (formData.get("titleEn") as string)?.trim() || null,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      subtitleEn: (formData.get("subtitleEn") as string)?.trim() || null,
      subtitleKa: (formData.get("subtitleKa") as string)?.trim() || null,
      addressEn: (formData.get("addressEn") as string)?.trim() || null,
      addressKa: (formData.get("addressKa") as string)?.trim() || null,
      email: email || null,
      phone: phone || null,
      secondaryPhone: (formData.get("secondaryPhone") as string)?.trim() || null,
      facebookUrl: (formData.get("facebookUrl") as string)?.trim() || null,
      instagramUrl: (formData.get("instagramUrl") as string)?.trim() || null,
      linkedinUrl: (formData.get("linkedinUrl") as string)?.trim() || null,
      xUrl: (formData.get("xUrl") as string)?.trim() || null,
      mapEmbedUrl: (formData.get("mapEmbedUrl") as string)?.trim() || null,
      updatedAt: new Date().toISOString(),
    } as const;

    const existing = await getContactSettings();
    if (!existing) {
      await db.insert(contactSettings).values(values);
    } else {
      await db
        .update(contactSettings)
        .set(values)
        .where(eq(contactSettings.id, existing.id));
    }

    revalidatePath("/contact");
    revalidatePath("/admin/contact");
    await logSave("Contact", "Contact settings", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertContactSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}
