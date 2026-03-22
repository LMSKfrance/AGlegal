"use server";

import { db } from "@/lib/db";
import { faqs } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logSave } from "./history";

export type FaqFormState = { success?: boolean; error?: string };

export async function getFaqList() {
  try {
    return await db.select().from(faqs).orderBy(asc(faqs.sortOrder), asc(faqs.id));
  } catch (err) {
    console.error("[getFaqList]", err);
    return [];
  }
}

export async function upsertFaq(
  id: number | null,
  _prev: FaqFormState,
  formData: FormData
): Promise<FaqFormState> {
  try {
    const questionEn = (formData.get("questionEn") as string)?.trim();
    const answerEn = (formData.get("answerEn") as string)?.trim();
    if (!questionEn) return { error: "Question (EN) is required." };
    if (!answerEn) return { error: "Answer (EN) is required." };

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (id) {
      await db
        .update(faqs)
        .set({
          questionEn,
          questionKa: trim("questionKa"),
          answerEn,
          answerKa: trim("answerKa"),
          sortOrder,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(faqs.id, id));
      await logSave("About", `FAQ: ${questionEn}`, "updated");
    } else {
      await db.insert(faqs).values({
        questionEn,
        questionKa: trim("questionKa"),
        answerEn,
        answerKa: trim("answerKa"),
        sortOrder,
      });
      await logSave("About", `FAQ: ${questionEn}`, "created");
    }

    revalidatePath("/about");
    revalidatePath("/admin/about");
    return { success: true };
  } catch (err) {
    console.error("[upsertFaq]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deleteFaq(id: number): Promise<FaqFormState> {
  try {
    await db.delete(faqs).where(eq(faqs.id, id));
    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", `FAQ #${id}`, "deleted");
    return { success: true };
  } catch (err) {
    console.error("[deleteFaq]", err);
    return { error: "Failed to delete." };
  }
}
