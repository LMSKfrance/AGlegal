"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  siteSettings,
  homeBenefits,
  homeProcessSteps,
  type HomeBenefit,
  type HomeProcessStep,
} from "@/lib/db/schema";
import { eq, inArray, asc } from "drizzle-orm";
import { truncateChars, oneWord } from "@/lib/utils/text";

export type HomeFormState = {
  success?: boolean;
  error?: string;
};

type SiteSettingRecord = {
  key: string;
  valueEn: string | null;
  valueKa: string | null;
};

async function getSettings(keys: string[]): Promise<Record<string, SiteSettingRecord>> {
  if (!keys.length) return {};
  const rows = await db
    .select({
      key: siteSettings.key,
      valueEn: siteSettings.valueEn,
      valueKa: siteSettings.valueKa,
    })
    .from(siteSettings)
    .where(inArray(siteSettings.key, keys));

  const map: Record<string, SiteSettingRecord> = {};
  for (const row of rows) {
    map[row.key] = row;
  }
  return map;
}

async function upsertSetting(key: string, group: string, valueEn: string | null, valueKa: string | null) {
  const existing = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.key, key));

  const payload = {
    key,
    valueEn,
    valueKa,
    group,
    updatedAt: new Date().toISOString(),
  };

  if (!existing.length) {
    await db.insert(siteSettings).values(payload);
  } else {
    await db.update(siteSettings).set(payload).where(eq(siteSettings.id, existing[0].id));
  }
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

const HERO_KEYS = [
  "home_hero_brand",
  "home_hero_title",
  "home_hero_cta",
  "home_hero_description",
  "home_hero_image",
] as const;

export type HomeHeroSettings = {
  brandEn: string;
  brandKa: string;
  titleEn: string;
  titleKa: string;
  ctaEn: string;
  ctaKa: string;
  descriptionEn: string;
  descriptionKa: string;
  image: string;
};

export async function getHomeHeroSettings(): Promise<HomeHeroSettings> {
  const rows = await getSettings(HERO_KEYS as unknown as string[]);

  const get = (key: (typeof HERO_KEYS)[number], which: "valueEn" | "valueKa") =>
    rows[key]?.[which] ?? "";

  return {
    brandEn: get("home_hero_brand", "valueEn"),
    brandKa: get("home_hero_brand", "valueKa"),
    titleEn: get("home_hero_title", "valueEn"),
    titleKa: get("home_hero_title", "valueKa"),
    ctaEn: get("home_hero_cta", "valueEn"),
    ctaKa: get("home_hero_cta", "valueKa"),
    descriptionEn: get("home_hero_description", "valueEn"),
    descriptionKa: get("home_hero_description", "valueKa"),
    image: get("home_hero_image", "valueEn"),
  };
}

export async function upsertHomeHeroSettings(
  prev: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  try {
    const rawBrandEn = (formData.get("brandEn") as string | null) ?? "";
    const rawBrandKa = (formData.get("brandKa") as string | null) ?? "";
    const rawTitleEn = (formData.get("titleEn") as string | null) ?? "";
    const rawTitleKa = (formData.get("titleKa") as string | null) ?? "";
    const rawCtaEn = (formData.get("ctaEn") as string | null) ?? "";
    const rawCtaKa = (formData.get("ctaKa") as string | null) ?? "";
    const rawDescEn = (formData.get("descriptionEn") as string | null) ?? "";
    const rawDescKa = (formData.get("descriptionKa") as string | null) ?? "";

    if (!rawTitleEn.trim()) {
      return { error: "Hero title (EN) is required." };
    }

    const brandEn = truncateChars(rawBrandEn, 40);
    const brandKa = truncateChars(rawBrandKa, 40);
    const titleEn = truncateChars(rawTitleEn, 80);
    const titleKa = truncateChars(rawTitleKa, 80);
    const ctaEn = truncateChars(rawCtaEn, 24);
    const ctaKa = truncateChars(rawCtaKa, 24);
    const descriptionEn = truncateChars(rawDescEn, 180);
    const descriptionKa = truncateChars(rawDescKa, 180);

    let imagePath: string | null = null;
    const file = formData.get("heroImage");
    if (file && file instanceof File && file.size > 0) {
      const fd = new FormData();
      fd.append("image", file);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (!result.success) {
        return { error: result.error };
      }
      imagePath = result.path;
    }

    await upsertSetting("home_hero_brand", "home_hero", brandEn, brandKa);
    await upsertSetting("home_hero_title", "home_hero", titleEn, titleKa);
    await upsertSetting("home_hero_cta", "home_hero", ctaEn, ctaKa);
    await upsertSetting("home_hero_description", "home_hero", descriptionEn, descriptionKa);

    if (imagePath) {
      await upsertSetting("home_hero_image", "home_hero", imagePath, imagePath);
    }

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (err) {
    console.error("[upsertHomeHeroSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

// ─── Who We Are Section ───────────────────────────────────────────────────────

const ABOUT_KEYS = ["home_about_title", "home_about_description", "home_about_image"] as const;

export type HomeAboutSettings = {
  titleEn: string;
  titleKa: string;
  descriptionEn: string;
  descriptionKa: string;
  image: string;
};

export async function getHomeAboutSettings(): Promise<HomeAboutSettings> {
  const rows = await getSettings(ABOUT_KEYS as unknown as string[]);
  const get = (key: (typeof ABOUT_KEYS)[number], which: "valueEn" | "valueKa") =>
    rows[key]?.[which] ?? "";

  return {
    titleEn: get("home_about_title", "valueEn"),
    titleKa: get("home_about_title", "valueKa"),
    descriptionEn: get("home_about_description", "valueEn"),
    descriptionKa: get("home_about_description", "valueKa"),
    image: get("home_about_image", "valueEn"),
  };
}

export async function upsertHomeAboutSettings(
  prev: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  try {
    const rawTitleEn = (formData.get("titleEn") as string | null) ?? "";
    const rawTitleKa = (formData.get("titleKa") as string | null) ?? "";
    const rawDescEn = (formData.get("descriptionEn") as string | null) ?? "";
    const rawDescKa = (formData.get("descriptionKa") as string | null) ?? "";

    if (!rawTitleEn.trim()) {
      return { error: "About title (EN) is required." };
    }

    const titleEn = truncateChars(rawTitleEn, 60);
    const titleKa = truncateChars(rawTitleKa, 60);
    const descriptionEn = truncateChars(rawDescEn, 260);
    const descriptionKa = truncateChars(rawDescKa, 260);

    let imagePath: string | null = null;
    const file = formData.get("aboutImage");
    if (file && file instanceof File && file.size > 0) {
      const fd = new FormData();
      fd.append("image", file);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (!result.success) {
        return { error: result.error };
      }
      imagePath = result.path;
    }

    await upsertSetting("home_about_title", "home_about", titleEn, titleKa);
    await upsertSetting("home_about_description", "home_about", descriptionEn, descriptionKa);

    if (imagePath) {
      await upsertSetting("home_about_image", "home_about", imagePath, imagePath);
    }

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (err) {
    console.error("[upsertHomeAboutSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

// ─── Section Headings (Services, Benefits, Process) ─────────────────────────────

const SECTION_HEADING_KEYS = [
  "services.title",
  "services.description",
  "benefits.title",
  "process.title",
  "process.description",
] as const;

export type HomeSectionHeadingsSettings = {
  servicesTitleEn: string;
  servicesTitleKa: string;
  servicesDescriptionEn: string;
  servicesDescriptionKa: string;
  benefitsTitleEn: string;
  benefitsTitleKa: string;
  processTitleEn: string;
  processTitleKa: string;
  processDescriptionEn: string;
  processDescriptionKa: string;
};

export async function getHomeSectionHeadingsSettings(): Promise<HomeSectionHeadingsSettings> {
  const rows = await getSettings(SECTION_HEADING_KEYS as unknown as string[]);
  const get = (key: (typeof SECTION_HEADING_KEYS)[number], which: "valueEn" | "valueKa") =>
    rows[key]?.[which] ?? "";

  return {
    servicesTitleEn: get("services.title", "valueEn"),
    servicesTitleKa: get("services.title", "valueKa"),
    servicesDescriptionEn: get("services.description", "valueEn"),
    servicesDescriptionKa: get("services.description", "valueKa"),
    benefitsTitleEn: get("benefits.title", "valueEn"),
    benefitsTitleKa: get("benefits.title", "valueKa"),
    processTitleEn: get("process.title", "valueEn"),
    processTitleKa: get("process.title", "valueKa"),
    processDescriptionEn: get("process.description", "valueEn"),
    processDescriptionKa: get("process.description", "valueKa"),
  };
}

export async function upsertHomeSectionHeadingsSettings(
  prev: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  try {
    const getStr = (name: string) => (formData.get(name) as string | null) ?? "";

    await upsertSetting("services.title", "services", getStr("servicesTitleEn"), getStr("servicesTitleKa"));
    await upsertSetting(
      "services.description",
      "services",
      getStr("servicesDescriptionEn"),
      getStr("servicesDescriptionKa"),
    );
    await upsertSetting("benefits.title", "benefits", getStr("benefitsTitleEn"), getStr("benefitsTitleKa"));
    await upsertSetting("process.title", "process", getStr("processTitleEn"), getStr("processTitleKa"));
    await upsertSetting(
      "process.description",
      "process",
      getStr("processDescriptionEn"),
      getStr("processDescriptionKa"),
    );

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (err) {
    console.error("[upsertHomeSectionHeadingsSettings]", err);
    return { error: "Failed to save. Please try again." };
  }
}

// ─── Benefits Section (Why work with us) ──────────────────────────────────────

export async function getHomeBenefitsList(): Promise<HomeBenefit[]> {
  try {
    return await db.select().from(homeBenefits).orderBy(asc(homeBenefits.sortOrder), asc(homeBenefits.id));
  } catch (err) {
    console.error("[getHomeBenefitsList]", err);
    return [];
  }
}

export async function upsertHomeBenefit(
  id: number | null,
  prev: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  try {
    const rawTitleEn = (formData.get("titleEn") as string | null) ?? "";
    const rawTitleKa = (formData.get("titleKa") as string | null) ?? "";
    const rawDescEn = (formData.get("descriptionEn") as string | null) ?? "";
    const rawDescKa = (formData.get("descriptionKa") as string | null) ?? "";

    if (!rawTitleEn.trim()) {
      return { error: "Benefit title (EN) is required." };
    }

    const titleEn = truncateChars(rawTitleEn, 60);
    const titleKa = truncateChars(rawTitleKa, 60);
    const descriptionEn = truncateChars(rawDescEn, 220);
    const descriptionKa = truncateChars(rawDescKa, 220);

    let iconPath: string | null = null;
    const file = formData.get("icon");
    if (file && file instanceof File && file.size > 0) {
      const fd = new FormData();
      fd.append("image", file);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (!result.success) {
        return { error: result.error };
      }
      iconPath = result.path;
    }

    const now = new Date().toISOString();

    if (id) {
      const existing = await db
        .select()
        .from(homeBenefits)
        .where(eq(homeBenefits.id, id));
      if (!existing.length) return { error: "Benefit not found." };

      await db
        .update(homeBenefits)
        .set({
          titleEn,
          titleKa: titleKa || null,
          descriptionEn: descriptionEn || null,
          descriptionKa: descriptionKa || null,
          iconPath: iconPath ?? existing[0].iconPath,
          updatedAt: now,
        })
        .where(eq(homeBenefits.id, id));
    } else {
      const countRows = await db
        .select({ id: homeBenefits.id })
        .from(homeBenefits)
        .orderBy(asc(homeBenefits.sortOrder));
      if (countRows.length >= 4) {
        return { error: "You can only have up to 4 benefits on the homepage." };
      }

      await db.insert(homeBenefits).values({
        titleEn,
        titleKa: titleKa || null,
        descriptionEn: descriptionEn || null,
        descriptionKa: descriptionKa || null,
        iconPath: iconPath ?? null,
        sortOrder: countRows.length,
        createdAt: now,
        updatedAt: now,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (err) {
    console.error("[upsertHomeBenefit]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deleteHomeBenefit(id: number): Promise<void> {
  try {
    await db.delete(homeBenefits).where(eq(homeBenefits.id, id));
    revalidatePath("/");
    revalidatePath("/admin/home");
  } catch (err) {
    console.error("[deleteHomeBenefit]", err);
  }
}

// ─── Process Steps Section ────────────────────────────────────────────────────

export async function getHomeProcessStepsList(): Promise<HomeProcessStep[]> {
  try {
    return await db
      .select()
      .from(homeProcessSteps)
      .orderBy(asc(homeProcessSteps.sortOrder), asc(homeProcessSteps.id));
  } catch (err) {
    console.error("[getHomeProcessStepsList]", err);
    return [];
  }
}

export async function upsertHomeProcessStep(
  id: number | null,
  prev: HomeFormState,
  formData: FormData,
): Promise<HomeFormState> {
  try {
    const rawTabTitleEn = (formData.get("tabTitleEn") as string | null) ?? "";
    const rawTabTitleKa = (formData.get("tabTitleKa") as string | null) ?? "";
    const rawTitleEn = (formData.get("titleEn") as string | null) ?? "";
    const rawTitleKa = (formData.get("titleKa") as string | null) ?? "";
    const rawDescEn = (formData.get("descriptionEn") as string | null) ?? "";
    const rawDescKa = (formData.get("descriptionKa") as string | null) ?? "";

    if (!rawTabTitleEn.trim() || !rawTitleEn.trim()) {
      return { error: "Tab title (EN) and step title (EN) are required." };
    }

    const tabTitleEn = oneWord(truncateChars(rawTabTitleEn, 20));
    const tabTitleKa = oneWord(truncateChars(rawTabTitleKa, 20));
    const titleEn = truncateChars(rawTitleEn, 80);
    const titleKa = truncateChars(rawTitleKa, 80);
    const descriptionEn = truncateChars(rawDescEn, 260);
    const descriptionKa = truncateChars(rawDescKa, 260);

    let imagePath: string | null = null;
    const file = formData.get("image");
    if (file && file instanceof File && file.size > 0) {
      const fd = new FormData();
      fd.append("image", file);
      const { uploadImage } = await import("@/lib/actions/upload");
      const result = await uploadImage(fd);
      if (!result.success) {
        return { error: result.error };
      }
      imagePath = result.path;
    }

    const now = new Date().toISOString();

    if (id) {
      const existing = await db
        .select()
        .from(homeProcessSteps)
        .where(eq(homeProcessSteps.id, id));
      if (!existing.length) return { error: "Process step not found." };

      await db
        .update(homeProcessSteps)
        .set({
          tabTitleEn,
          tabTitleKa: tabTitleKa || null,
          titleEn,
          titleKa: titleKa || null,
          descriptionEn: descriptionEn || null,
          descriptionKa: descriptionKa || null,
          image: imagePath ?? existing[0].image,
          stepNumber: existing[0].stepNumber,
          updatedAt: now,
        })
        .where(eq(homeProcessSteps.id, id));
    } else {
      const rows = await db
        .select()
        .from(homeProcessSteps)
        .orderBy(asc(homeProcessSteps.sortOrder), asc(homeProcessSteps.id));
      if (rows.length >= 4) {
        return { error: "You can only have up to 4 process steps on the homepage." };
      }

      const stepNumber = String(rows.length + 1).padStart(2, "0");

      await db.insert(homeProcessSteps).values({
        tabTitleEn,
        tabTitleKa: tabTitleKa || null,
        titleEn,
        titleKa: titleKa || null,
        descriptionEn: descriptionEn || null,
        descriptionKa: descriptionKa || null,
        image: imagePath ?? null,
        stepNumber,
        sortOrder: rows.length,
        createdAt: now,
        updatedAt: now,
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (err) {
    console.error("[upsertHomeProcessStep]", err);
    return { error: "Failed to save. Please try again." };
  }
}

export async function deleteHomeProcessStep(id: number): Promise<void> {
  try {
    await db.delete(homeProcessSteps).where(eq(homeProcessSteps.id, id));
    revalidatePath("/");
    revalidatePath("/admin/home");
  } catch (err) {
    console.error("[deleteHomeProcessStep]", err);
  }
}

// ─── Home section visibility (show/hide sections on homepage) ─────────────────

import type { HomeSectionId } from "@/lib/home";

async function upsertVisibilitySetting(sectionId: HomeSectionId, visible: boolean) {
  const key = `home.section.${sectionId}.visible`;
  const val = visible ? "1" : "0";
  await upsertSetting(key, "home_sections", val, val);
}

export async function setHomeSectionVisible(
  sectionId: HomeSectionId,
  visible: boolean,
): Promise<void> {
  try {
    await upsertVisibilitySetting(sectionId, visible);
    revalidatePath("/");
    revalidatePath("/admin/home");
  } catch (err) {
    console.error("[setHomeSectionVisible]", err);
  }
}

