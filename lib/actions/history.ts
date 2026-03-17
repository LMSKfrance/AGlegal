"use server";

import { db } from "@/lib/db";
import { saveHistory, articles, teamMembers, teamMemberSocials, services, pages } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type HistoryAction = "created" | "updated" | "deleted";

export type SnapshotParam = {
  type: string;
  id: number;
  data: unknown;
};

export async function logSave(
  section: string,
  label: string,
  action: HistoryAction,
  snapshot?: SnapshotParam,
) {
  try {
    await db.insert(saveHistory).values({
      section,
      label,
      action,
      snapshotType: snapshot?.type ?? null,
      snapshotId: snapshot?.id ?? null,
      snapshot: snapshot ? JSON.stringify(snapshot.data) : null,
    });
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

export async function rollbackSave(historyId: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const [entry] = await db.select().from(saveHistory).where(eq(saveHistory.id, historyId));
    if (!entry) return { error: "History entry not found." };
    if (!entry.snapshotType || !entry.snapshot) {
      return { error: "No snapshot available for this entry." };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = JSON.parse(entry.snapshot);
    const id = entry.snapshotId;
    const type = entry.snapshotType;
    const action = entry.action;

    if (type === "news") {
      const { id: _id, createdAt: _c, ...fields } = data;
      if (action === "updated" && id) {
        await db.update(articles).set({ ...fields, updatedAt: new Date().toISOString() }).where(eq(articles.id, id));
        revalidatePath("/admin/news");
        revalidatePath(`/news/${fields.slug}`);
        revalidatePath("/");
      } else if (action === "deleted") {
        const conflict = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, fields.slug));
        if (conflict.length) return { error: "Cannot restore: a news article with that slug already exists." };
        await db.insert(articles).values({ ...fields, updatedAt: new Date().toISOString() });
        revalidatePath("/admin/news");
        revalidatePath("/");
      }

    } else if (type === "team") {
      const { id: _id, createdAt: _c, socials, ...fields } = data;
      if (action === "updated" && id) {
        await db.update(teamMembers).set({ ...fields, updatedAt: new Date().toISOString() }).where(eq(teamMembers.id, id));
        if (Array.isArray(socials)) {
          await db.delete(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, id));
          for (const s of socials) {
            await db.insert(teamMemberSocials).values({ teamMemberId: id, platform: s.platform, link: s.link });
          }
        }
        revalidatePath("/admin/team");
        revalidatePath("/team", "layout");
        revalidatePath("/");
      } else if (action === "deleted") {
        const conflict = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.slug, fields.slug));
        if (conflict.length) return { error: "Cannot restore: a team member with that slug already exists." };
        const [inserted] = await db.insert(teamMembers).values({ ...fields, updatedAt: new Date().toISOString() }).returning({ id: teamMembers.id });
        if (inserted && Array.isArray(socials)) {
          for (const s of socials) {
            await db.insert(teamMemberSocials).values({ teamMemberId: inserted.id, platform: s.platform, link: s.link });
          }
        }
        revalidatePath("/admin/team");
        revalidatePath("/team", "layout");
        revalidatePath("/");
      }

    } else if (type === "service") {
      const { id: _id, createdAt: _c, ...fields } = data;
      if (action === "updated" && id) {
        await db.update(services).set({ ...fields, updatedAt: new Date().toISOString() }).where(eq(services.id, id));
        revalidatePath("/admin/services");
        revalidatePath("/services", "layout");
        revalidatePath("/");
      } else if (action === "deleted") {
        const conflict = await db.select({ id: services.id }).from(services).where(eq(services.slug, fields.slug));
        if (conflict.length) return { error: "Cannot restore: a service with that slug already exists." };
        await db.insert(services).values({ ...fields, updatedAt: new Date().toISOString() });
        revalidatePath("/admin/services");
        revalidatePath("/services", "layout");
        revalidatePath("/");
      }

    } else if (type === "page") {
      const { id: _id, createdAt: _c, ...fields } = data;
      if (action === "updated" && id) {
        await db.update(pages).set({ ...fields, updatedAt: new Date().toISOString() }).where(eq(pages.id, id));
        revalidatePath("/admin/pages");
        revalidatePath(`/${fields.slug}`);
      } else if (action === "deleted") {
        const conflict = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, fields.slug));
        if (conflict.length) return { error: "Cannot restore: a page with that slug already exists." };
        await db.insert(pages).values({ ...fields, updatedAt: new Date().toISOString() });
        revalidatePath("/admin/pages");
        revalidatePath(`/${fields.slug}`);
      }

    } else {
      return { error: "Restore is not supported for this type of entry." };
    }

    await logSave(entry.section, entry.label, "updated");
    return { success: true };
  } catch (err) {
    console.error("[rollbackSave]", err);
    return { error: "Restore failed. Please try again." };
  }
}
