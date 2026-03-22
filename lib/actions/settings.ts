"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const SITE_ONLINE_KEY = "site.online";

export async function getSiteOnlineStatus(): Promise<boolean> {
  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, SITE_ONLINE_KEY))
      .limit(1);
    if (!row) return true; // default: online
    return row.valueEn !== "0";
  } catch {
    return true; // on DB error, default to online
  }
}

export async function setSiteOnlineStatus(online: boolean) {
  const value = online ? "1" : "0";
  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.key, SITE_ONLINE_KEY))
    .limit(1);

  if (existing) {
    await db
      .update(siteSettings)
      .set({ valueEn: value, updatedAt: new Date().toISOString() })
      .where(eq(siteSettings.key, SITE_ONLINE_KEY));
  } else {
    await db.insert(siteSettings).values({
      key: SITE_ONLINE_KEY,
      valueEn: value,
      group: "site",
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
}
