"use server";

import { db } from "@/lib/db";
import { saveHistory } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export type HistoryAction = "created" | "updated" | "deleted";

export async function logSave(section: string, label: string, action: HistoryAction) {
  try {
    await db.insert(saveHistory).values({ section, label, action });
  } catch (err) {
    // Never let history logging break the main save
    console.error("[logSave]", err);
  }
}

export async function getSaveHistory(limit = 100) {
  try {
    return await db
      .select()
      .from(saveHistory)
      .orderBy(desc(saveHistory.savedAt))
      .limit(limit);
  } catch {
    return [];
  }
}
