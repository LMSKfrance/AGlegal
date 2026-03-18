"use server";

import { db } from "@/lib/db";
import { adminProfile } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export type ProfileFormState = {
  success?: boolean;
  error?: string;
};

export async function getAdminProfile() {
  const [profile] = await db.select().from(adminProfile).limit(1);
  return profile ?? null;
}

export async function updateAdminProfile(
  prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  try {
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const currentPassword = (formData.get("currentPassword") as string) ?? "";
    const newPassword = (formData.get("newPassword") as string)?.trim();
    const confirmPassword = (formData.get("confirmPassword") as string)?.trim();

    if (!name) return { error: "Name is required." };
    if (!email) return { error: "Email is required." };

    const [profile] = await db.select().from(adminProfile).limit(1);
    if (!profile) return { error: "Admin profile not found." };

    // Verify current password before any change
    const validCurrent = await bcrypt.compare(currentPassword, profile.passwordHash);
    if (!validCurrent) return { error: "Current password is incorrect." };

    let passwordHash = profile.passwordHash;
    if (newPassword) {
      if (newPassword !== confirmPassword) return { error: "New passwords do not match." };
      if (newPassword.length < 6) return { error: "Password must be at least 6 characters." };
      passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await db
      .update(adminProfile)
      .set({ name, email, passwordHash, updatedAt: new Date().toISOString() })
      .where(eq(adminProfile.id, profile.id));

    return { success: true };
  } catch {
    return { error: "Failed to update profile." };
  }
}
