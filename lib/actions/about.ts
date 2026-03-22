"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteSettings, teamMembers, pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

import { getTeamList } from "@/lib/actions/team";
import { ABOUT_SECTION_IDS, type AboutSectionId, type AboutTeamMemberEntry } from "@/lib/about";
import { logSave } from "./history";

async function upsertSetting(
  key: string,
  valueEn: string | null,
  valueKa: string | null
) {
  const existing = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.key, key));
  const payload = {
    key,
    valueEn,
    valueKa,
    group: "about",
    updatedAt: new Date().toISOString(),
  };
  if (!existing.length) await db.insert(siteSettings).values(payload);
  else await db.update(siteSettings).set(payload).where(eq(siteSettings.id, existing[0].id));
}

export async function setAboutSectionVisible(
  sectionId: AboutSectionId,
  visible: boolean
): Promise<void> {
  try {
    const key = `about.section.${sectionId}.visible`;
    await upsertSetting(key, visible ? "1" : "0", visible ? "1" : "0");
    revalidatePath("/about");
    revalidatePath("/admin/about");
  } catch (err) {
    console.error("[setAboutSectionVisible]", err);
  }
}

export async function setAboutSectionVisibilityFromForm(formData: FormData): Promise<void> {
  const sectionId = formData.get("sectionId") as string | null;
  const visible = formData.get("visible") === "1";
  if (sectionId && ABOUT_SECTION_IDS.includes(sectionId as AboutSectionId)) {
    await setAboutSectionVisible(sectionId as AboutSectionId, visible);
  }
}

export async function upsertAboutSectionSettings(
  _prev: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const pairs: [string, string, string][] = [
      ["about.numbers.title", "numbersTitleEn", "numbersTitleKa"],
      ["about.numbers.description", "numbersDescriptionEn", "numbersDescriptionKa"],
      ["about.mission.title", "missionTitleEn", "missionTitleKa"],
      ["about.mission.description", "missionDescriptionEn", "missionDescriptionKa"],
      ["about.features.title", "featuresTitleEn", "featuresTitleKa"],
      ["about.philosophy.title", "philosophyTitleEn", "philosophyTitleKa"],
      ["about.philosophy.description", "philosophyDescriptionEn", "philosophyDescriptionKa"],
    ];
    for (const [key, en, ka] of pairs) {
      await upsertSetting(
        key,
        (formData.get(en) as string)?.trim() || null,
        (formData.get(ka) as string)?.trim() || null
      );
    }
    revalidatePath("/about");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutSectionSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function upsertAboutNumbersSettings(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    await upsertSetting(
      "about.numbers.title",
      (formData.get("numbersTitleEn") as string)?.trim() || null,
      (formData.get("numbersTitleKa") as string)?.trim() || null
    );
    await upsertSetting(
      "about.numbers.description",
      (formData.get("numbersDescriptionEn") as string)?.trim() || null,
      (formData.get("numbersDescriptionKa") as string)?.trim() || null
    );
    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", "Numbers section", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutNumbersSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function upsertAboutMissionImages(
  _prev: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { uploadImage } = await import("@/lib/actions/upload");
    const tabs = [
      { formKey: "tab1Image", settingKey: "about.mission.tab1.image" },
      { formKey: "tab2Image", settingKey: "about.mission.tab2.image" },
      { formKey: "tab3Image", settingKey: "about.mission.tab3.image" },
    ];
    for (const { formKey, settingKey } of tabs) {
      const file = formData.get(formKey);
      const remove = formData.get(`remove_${formKey}`) === "1";
      if (remove) {
        await upsertSetting(settingKey, null, null);
      } else if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) await upsertSetting(settingKey, result.path, null);
      }
    }
    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", "Mission tab images", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutMissionImages]", err);
    return { error: "Failed to save images. Please try again." };
  }
}

export async function upsertAboutMissionSettings(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    await upsertSetting(
      "about.mission.title",
      (formData.get("missionTitleEn") as string)?.trim() || null,
      (formData.get("missionTitleKa") as string)?.trim() || null
    );
    await upsertSetting(
      "about.mission.description",
      (formData.get("missionDescriptionEn") as string)?.trim() || null,
      (formData.get("missionDescriptionKa") as string)?.trim() || null
    );
    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", "Mission section", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutMissionSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function upsertAboutFeaturesSettings(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    await upsertSetting(
      "about.features.title",
      (formData.get("featuresTitleEn") as string)?.trim() || null,
      (formData.get("featuresTitleKa") as string)?.trim() || null
    );
    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", "Features section", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutFeaturesSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function upsertAboutPhilosophySettings(formData: FormData): Promise<{ success?: boolean; error?: string }> {
  try {
    await upsertSetting(
      "about.philosophy.title",
      (formData.get("philosophyTitleEn") as string)?.trim() || null,
      (formData.get("philosophyTitleKa") as string)?.trim() || null
    );
    await upsertSetting(
      "about.philosophy.description",
      (formData.get("philosophyDescriptionEn") as string)?.trim() || null,
      (formData.get("philosophyDescriptionKa") as string)?.trim() || null
    );
    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", "Philosophy section", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutPhilosophySettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function setTeamMemberAboutVisibility(
  teamMemberId: number,
  showOnAbout: boolean,
  aboutOrder: number
): Promise<void> {
  try {
    await db
      .update(teamMembers)
      .set({
        showOnAbout: showOnAbout ? 1 : 0,
        aboutOrder,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(teamMembers.id, teamMemberId));
    revalidatePath("/about");
  } catch (err) {
    console.error("[setTeamMemberAboutVisibility]", err);
  }
}

export async function setAboutTeamMembers(
  entries: AboutTeamMemberEntry[]
): Promise<void> {
  try {
    for (const { id, showOnAbout, aboutOrder } of entries) {
      await db
        .update(teamMembers)
        .set({
          showOnAbout: showOnAbout ? 1 : 0,
          aboutOrder,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(teamMembers.id, id));
    }
    revalidatePath("/about");
    revalidatePath("/admin/about");
  } catch (err) {
    console.error("[setAboutTeamMembers]", err);
  }
}

export async function upsertAboutHeroContent(
  _prev: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return { error: "Title (EN) is required." };

    const trim = (key: string) => (formData.get(key) as string)?.trim() || null;

    // Handle OG image upload
    const ogImageFile = formData.get("ogImage");
    const existing = await db.select().from(pages).where(eq(pages.slug, "about"));
    let ogImagePath: string | null = existing[0]?.ogImage ?? null;
    const removeOg = formData.get("removeOgImage") === "1";
    if (removeOg) {
      ogImagePath = null;
    } else if (ogImageFile && ogImageFile instanceof File && ogImageFile.size > 0) {
      const { uploadImage } = await import("@/lib/actions/upload");
      const fd = new FormData();
      fd.append("image", ogImageFile);
      const result = await uploadImage(fd);
      if (result.success) ogImagePath = result.path;
    }

    const payload = {
      slug: "about",
      titleEn,
      titleKa: trim("titleKa"),
      contentEn: trim("contentEn"),
      contentKa: trim("contentKa"),
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
    };

    if (existing.length) {
      await db.update(pages).set(payload).where(eq(pages.slug, "about"));
    } else {
      await db.insert(pages).values(payload);
    }

    revalidatePath("/about");
    revalidatePath("/admin/about");
    await logSave("About", "Hero & SEO content", "updated");
    return { success: true };
  } catch (err) {
    console.error("[upsertAboutHeroContent]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function updateAboutTeamMembersFromForm(formData: FormData): Promise<{ success: boolean }> {
  try {
    const list = await getTeamList();
    const showOnAboutIds = new Set((formData.getAll("showOnAbout") as string[]).map(Number));
    const entries: AboutTeamMemberEntry[] = list.map((member, index) => ({
      id: member.id,
      showOnAbout: showOnAboutIds.has(member.id),
      aboutOrder: Number(formData.get(`aboutOrder_${member.id}`)) || index,
    }));
    await setAboutTeamMembers(entries);
    return { success: true };
  } catch (err) {
    console.error("[updateAboutTeamMembersFromForm]", err);
    return { success: false };
  }
}
