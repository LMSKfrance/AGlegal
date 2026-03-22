"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const SITE_ONLINE_KEY = "site.online";
const OFFLINE_TITLE_KEY = "site.offline_title";
const OFFLINE_MESSAGE_KEY = "site.offline_message";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function upsertSetting(key: string, value: string) {
  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, key))
    .limit(1);

  if (existing) {
    await db
      .update(siteSettings)
      .set({ valueEn: value, updatedAt: new Date().toISOString() })
      .where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, valueEn: value, group: "site" });
  }
}

async function getSetting(key: string): Promise<string | null> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    return row?.valueEn ?? null;
  } catch {
    return null;
  }
}

// ─── Online / Offline status ──────────────────────────────────────────────────

export async function getSiteOnlineStatus(): Promise<boolean> {
  const val = await getSetting(SITE_ONLINE_KEY);
  if (val === null) return true; // default: online
  return val !== "0";
}

export async function setSiteOnlineStatus(online: boolean) {
  await upsertSetting(SITE_ONLINE_KEY, online ? "1" : "0");
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}

// ─── Offline page content ────────────────────────────────────────────────────

export async function getOfflinePageContent(): Promise<{ title: string; message: string }> {
  const [title, message] = await Promise.all([
    getSetting(OFFLINE_TITLE_KEY),
    getSetting(OFFLINE_MESSAGE_KEY),
  ]);
  return {
    title: title || "AG Legal",
    message: message || "This website is temporarily offline. Please check back soon.",
  };
}

export async function saveOfflinePageContent(title: string, message: string) {
  await Promise.all([
    upsertSetting(OFFLINE_TITLE_KEY, title.trim() || "AG Legal"),
    upsertSetting(OFFLINE_MESSAGE_KEY, message.trim() || "This website is temporarily offline. Please check back soon."),
  ]);
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
