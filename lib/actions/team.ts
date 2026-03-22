"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { teamMembers, teamMemberSocials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "./history";

export type TeamFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getTeamList() {
  try {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));
  } catch (err) {
    console.error("[getTeamList]", err);
    return [];
  }
}

export async function getTeamMemberById(id: number) {
  try {
    const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).then((r) => r[0] ?? null);
    if (!member) return null;
    const socials = await db.select().from(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, id));
    return { ...member, socials };
  } catch (err) {
    console.error("[getTeamMemberById]", err);
    return null;
  }
}

export async function createTeamMember(prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Name (EN) is required", fieldErrors: { titleEn: "Required" } };

    const slug = slugify(titleEn) || `member-${Date.now()}`;
    const existing = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.slug, slug));
    if (existing.length) return { error: "A team member with this name already exists (slug conflict)." };

    const imageFile = formData.get("image");
    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const ogImageFile = formData.get("ogImage");
    let ogImagePath: string | null = null;
    if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const showOnHome = formData.get("showOnHome") ? 1 : 0;
    const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? "0";
    const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    const now = new Date().toISOString();
    await db.insert(teamMembers).values({
      slug,
      titleEn,
      titleKa: trim("titleKa"),
      positionEn: trim("positionEn"),
      positionKa: trim("positionKa"),
      descriptionEn: trim("descriptionEn"),
      descriptionKa: trim("descriptionKa"),
      quoteEn: trim("quoteEn"),
      quoteKa: trim("quoteKa"),
      text1En: trim("text1En"),
      text1Ka: trim("text1Ka"),
      text2En: trim("text2En"),
      text2Ka: trim("text2Ka"),
      image: imagePath,
      imagePosition: (formData.get("imagePosition") as string) || "top",
      published: formData.get("published") === "0" ? 0 : 1,
      showOnHome,
      homeOrder,
      metaDescriptionEn: trim("metaDescriptionEn"),
      metaDescriptionKa: trim("metaDescriptionKa"),
      seoTitleEn: trim("seoTitleEn"),
      seoTitleKa: trim("seoTitleKa"),
      ogTitleEn: trim("ogTitleEn"),
      ogTitleKa: trim("ogTitleKa"),
      ogDescriptionEn: trim("ogDescriptionEn"),
      ogDescriptionKa: trim("ogDescriptionKa"),
      ogImage: ogImagePath,
      updatedAt: now,
    });

    const [inserted] = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.slug, slug));
    const memberId = inserted?.id;
    if (memberId) {
      const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim();
      const twitterUrl = (formData.get("twitterUrl") as string)?.trim();
      if (linkedinUrl) await db.insert(teamMemberSocials).values({ teamMemberId: memberId, platform: "linkedin", link: linkedinUrl });
      if (twitterUrl) await db.insert(teamMemberSocials).values({ teamMemberId: memberId, platform: "twitter", link: twitterUrl });
    }

    revalidatePath("/admin/team");
    revalidatePath("/admin");
    revalidatePath("/team", "layout");
    revalidatePath("/");
    await logSave("Team", titleEn, "created");
    return { success: true };
  } catch (err) {
    console.error("[createTeamMember]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function updateTeamMember(id: number, prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Name (EN) is required", fieldErrors: { titleEn: "Required" } };

    const existing = await getTeamMemberById(id);
    if (!existing) return { error: "Team member not found." };

    const newSlug = slugify(titleEn) || existing.slug;
    if (newSlug !== existing.slug) {
      const conflict = await db.select().from(teamMembers).where(eq(teamMembers.slug, newSlug));
      if (conflict.length) return { error: "Another member already uses this name (slug conflict)." };
    }

    const imageFile = formData.get("image");
    let imagePath: string | null = existing.image;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const ogImageFile = formData.get("ogImage");
    let ogImagePath: string | null = existing.ogImage;
    if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const showOnHome = formData.get("showOnHome") ? 1 : 0;
    const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? `${existing.homeOrder ?? 0}`;
    const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;
    await db
      .update(teamMembers)
      .set({
        slug: newSlug,
        titleEn,
        titleKa: trim("titleKa"),
        positionEn: trim("positionEn"),
        positionKa: trim("positionKa"),
        descriptionEn: trim("descriptionEn"),
        descriptionKa: trim("descriptionKa"),
        quoteEn: trim("quoteEn"),
        quoteKa: trim("quoteKa"),
        text1En: trim("text1En"),
        text1Ka: trim("text1Ka"),
        text2En: trim("text2En"),
        text2Ka: trim("text2Ka"),
        image: imagePath,
        imagePosition: (formData.get("imagePosition") as string) || "top",
        published: formData.get("published") === "0" ? 0 : 1,
        showOnHome,
        homeOrder,
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
      })
      .where(eq(teamMembers.id, id));

    await db.delete(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, id));
    const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim();
    const twitterUrl = (formData.get("twitterUrl") as string)?.trim();
    if (linkedinUrl) await db.insert(teamMemberSocials).values({ teamMemberId: id, platform: "linkedin", link: linkedinUrl });
    if (twitterUrl) await db.insert(teamMemberSocials).values({ teamMemberId: id, platform: "twitter", link: twitterUrl });

    revalidatePath("/admin/team");
    revalidatePath("/admin");
    revalidatePath("/team", "layout");
    revalidatePath("/");
    await logSave("Team", titleEn, "updated", { type: "team", id: existing.id, data: existing });
    return { success: true };
  } catch (err) {
    console.error("[updateTeamMember]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deleteTeamMember(id: number): Promise<void> {
  let deleted = false;
  try {
    const row = await getTeamMemberById(id);
    if (row) {
      await db.delete(teamMembers).where(eq(teamMembers.id, id));
      revalidatePath("/admin/team");
      revalidatePath("/admin");
      revalidatePath("/team", "layout");
      revalidatePath("/");
      await logSave("Team", row.titleEn, "deleted", { type: "team", id: row.id, data: row });
      deleted = true;
    }
  } catch (err) {
    console.error("[deleteTeamMember]", err);
  }
  redirect(deleted ? "/admin/team?toast=success" : "/admin/team?toast=error");
}

export async function togglePublishTeamMember(id: number, publish: boolean): Promise<void> {
  try {
    await db.update(teamMembers).set({ published: publish ? 1 : 0 }).where(eq(teamMembers.id, id));
    revalidatePath("/admin/team");
    revalidatePath("/team", "layout");
    revalidatePath("/");
  } catch (err) {
    console.error("[togglePublishTeamMember]", err);
  }
}

export async function reorderTeamMembers(orderedIds: number[]): Promise<void> {
  try {
    await Promise.all(
      orderedIds.map((id, index) =>
        db.update(teamMembers).set({ sortOrder: index }).where(eq(teamMembers.id, id))
      )
    );
    revalidatePath("/admin/team");
    revalidatePath("/");
    revalidatePath("/team", "layout");
  } catch (err) {
    console.error("[reorderTeamMembers]", err);
  }
}
