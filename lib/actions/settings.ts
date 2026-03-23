"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const SITE_ONLINE_KEY = "site.online";
const OFFLINE_TITLE_KEY = "site.offline_title";
const OFFLINE_MESSAGE_KEY = "site.offline_message";
const BOOKING_EMAIL_KEY = "notifications.booking_email";
const CONTACT_EMAIL_KEY = "notifications.contact_email";

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

// ─── Notification email recipients ───────────────────────────────────────────

export async function getEmailSettings(): Promise<{ bookingEmail: string; contactEmail: string }> {
  const [bookingEmail, contactEmail] = await Promise.all([
    getSetting(BOOKING_EMAIL_KEY),
    getSetting(CONTACT_EMAIL_KEY),
  ]);
  return {
    bookingEmail: bookingEmail ?? "",
    contactEmail: contactEmail ?? "",
  };
}

export type EmailSettingsState = { success?: boolean; error?: string };

// ─── Team page header ─────────────────────────────────────────────────────────

export async function getTeamPageContent(): Promise<{ title: string; description: string }> {
  const [title, description] = await Promise.all([
    getSetting("team.page_title"),
    getSetting("team.page_description"),
  ]);
  return {
    title: title ?? "Our team.",
    description: description ?? "",
  };
}

export type TeamPageContentState = { success?: boolean; error?: string };

export async function saveTeamPageContent(
  _prev: TeamPageContentState,
  formData: FormData
): Promise<TeamPageContentState> {
  try {
    const title = (formData.get("teamPageTitle") as string)?.trim() || "Our team.";
    const description = (formData.get("teamPageDescription") as string)?.trim() || "";
    await Promise.all([
      upsertSetting("team.page_title", title),
      upsertSetting("team.page_description", description),
    ]);
    revalidatePath("/team", "layout");
    revalidatePath("/admin/team");
    return { success: true };
  } catch {
    return { error: "Failed to save. Please try again." };
  }
}

export async function saveEmailSettings(
  _prev: EmailSettingsState,
  formData: FormData
): Promise<EmailSettingsState> {
  try {
    const bookingEmail = (formData.get("bookingEmail") as string)?.trim() ?? "";
    const contactEmail = (formData.get("contactEmail") as string)?.trim() ?? "";

    await Promise.all([
      upsertSetting(BOOKING_EMAIL_KEY, bookingEmail),
      upsertSetting(CONTACT_EMAIL_KEY, contactEmail),
    ]);

    revalidatePath("/admin/settings");
    return { success: true };
  } catch {
    return { error: "Failed to save. Please try again." };
  }
}
