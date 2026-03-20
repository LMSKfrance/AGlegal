"use server";

import { db } from "@/lib/db";
import { adminProfile } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";

export type ProfileFormState = {
  success?: boolean;
  error?: string;
};

async function ensureTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS admin_profile (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      email TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT ''
    )
  `);
}

export async function getAdminProfile() {
  try {
    await ensureTable();
    const [profile] = await db.select().from(adminProfile).limit(1);
    return profile ?? null;
  } catch {
    return null;
  }
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

    await ensureTable();
    const [profile] = await db.select().from(adminProfile).limit(1);

    if (!profile) {
      // First-time setup: create the profile row using the provided password
      if (!currentPassword) return { error: "Password is required for initial setup." };
      if (newPassword && newPassword !== confirmPassword) return { error: "New passwords do not match." };
      if (newPassword && newPassword.length < 6) return { error: "Password must be at least 6 characters." };
      const passwordHash = await bcrypt.hash(newPassword || currentPassword, 12);
      await db.insert(adminProfile).values({ id: 1, name, email, passwordHash, updatedAt: new Date().toISOString() });
      return { success: true };
    }

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
