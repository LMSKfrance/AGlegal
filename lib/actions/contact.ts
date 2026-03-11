"use server";

import { db } from "@/lib/db";
import { contactSettings } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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

    if (!email && !phone) {
      return { error: "Provide at least an email or a phone number." };
    }

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
    return { success: true };
  } catch (err) {
    console.error("[upsertContactSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}
