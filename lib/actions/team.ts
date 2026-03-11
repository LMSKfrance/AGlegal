"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { teamMembers, teamMemberSocials } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slug";

export type TeamFormState = { success?: boolean; error?: string; fieldErrors?: Record<string, string> };

export async function getTeamList() {
  return db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));
}

export async function getTeamMemberById(id: number) {
  const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).then((r) => r[0] ?? null);
  if (!member) return null;
  const socials = await db.select().from(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, id));
  return { ...member, socials };
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

    const showOnHome = formData.get("showOnHome") ? 1 : 0;
    const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? "0";
    const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;

    const now = new Date().toISOString();
    await db.insert(teamMembers).values({
      slug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      positionEn: (formData.get("positionEn") as string)?.trim() || null,
      positionKa: (formData.get("positionKa") as string)?.trim() || null,
      descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
      descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
      quoteEn: (formData.get("quoteEn") as string)?.trim() || null,
      quoteKa: (formData.get("quoteKa") as string)?.trim() || null,
      text1En: (formData.get("text1En") as string)?.trim() || null,
      text1Ka: (formData.get("text1Ka") as string)?.trim() || null,
      text2En: (formData.get("text2En") as string)?.trim() || null,
      text2Ka: (formData.get("text2Ka") as string)?.trim() || null,
      image: imagePath,
      showOnHome,
      homeOrder,
      updatedAt: now,
    });

    const [inserted] = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.slug, slug));
    const memberId = inserted?.id;
    if (memberId) {
      const platforms = (formData.get("socialPlatforms") as string)?.split("\n").filter(Boolean) ?? [];
      const links = (formData.get("socialLinks") as string)?.split("\n").filter(Boolean) ?? [];
      for (let i = 0; i < Math.min(platforms.length, links.length); i++) {
        const platform = platforms[i].trim();
        const link = links[i].trim();
        if (platform && link) {
          await db.insert(teamMemberSocials).values({ teamMemberId: memberId, platform, link });
        }
      }
    }

    revalidatePath("/admin/team");
    revalidatePath("/admin");
    revalidatePath("/team", "layout");
    revalidatePath("/");
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

    const showOnHome = formData.get("showOnHome") ? 1 : 0;
    const homeOrderRaw = (formData.get("homeOrder") as string | null) ?? `${existing.homeOrder ?? 0}`;
    const homeOrder = Number.parseInt(homeOrderRaw, 10) || 0;

    await db
      .update(teamMembers)
      .set({
        slug: newSlug,
        titleEn,
        titleKa: (formData.get("titleKa") as string)?.trim() || null,
        positionEn: (formData.get("positionEn") as string)?.trim() || null,
        positionKa: (formData.get("positionKa") as string)?.trim() || null,
        descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
        descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
        quoteEn: (formData.get("quoteEn") as string)?.trim() || null,
        quoteKa: (formData.get("quoteKa") as string)?.trim() || null,
        text1En: (formData.get("text1En") as string)?.trim() || null,
        text1Ka: (formData.get("text1Ka") as string)?.trim() || null,
        text2En: (formData.get("text2En") as string)?.trim() || null,
        text2Ka: (formData.get("text2Ka") as string)?.trim() || null,
        image: imagePath,
        showOnHome,
        homeOrder,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(teamMembers.id, id));

    await db.delete(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, id));
    const platforms = (formData.get("socialPlatforms") as string)?.split("\n").filter(Boolean) ?? [];
    const links = (formData.get("socialLinks") as string)?.split("\n").filter(Boolean) ?? [];
    for (let i = 0; i < Math.min(platforms.length, links.length); i++) {
      const platform = platforms[i].trim();
      const link = links[i].trim();
      if (platform && link) {
        await db.insert(teamMemberSocials).values({ teamMemberId: id, platform, link });
      }
    }

    revalidatePath("/admin/team");
    revalidatePath("/admin");
    revalidatePath("/team", "layout");
    revalidatePath("/");
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
      deleted = true;
    }
  } catch (err) {
    console.error("[deleteTeamMember]", err);
  }
  redirect(deleted ? "/admin/team?toast=success" : "/admin/team?toast=error");
}
