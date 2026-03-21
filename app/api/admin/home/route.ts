import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import {
  getHomeHeroSettings,
  getHomeAboutSettings,
  getHomeSectionHeadingsSettings,
  getHomeBenefitsList,
  getHomeProcessStepsList,
} from "@/lib/actions/home";
import { db } from "@/lib/db";
import { siteSettings, homeBenefits, homeProcessSteps } from "@/lib/db/schema";
import { eq, asc, inArray } from "drizzle-orm";
import { logSave } from "@/lib/actions/history";
import { uploadImage } from "@/lib/actions/upload";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const [hero, about, headings, benefits, processSteps] = await Promise.all([
      getHomeHeroSettings(),
      getHomeAboutSettings(),
      getHomeSectionHeadingsSettings(),
      getHomeBenefitsList(),
      getHomeProcessStepsList(),
    ]);

    // Get visibility settings
    const visKeys = [
      "home.section.hero.visible",
      "home.section.about.visible",
      "home.section.services.visible",
      "home.section.benefits.visible",
      "home.section.process.visible",
      "home.section.news.visible",
      "home.section.cta.visible",
    ];
    const visRows = await db
      .select({ key: siteSettings.key, valueEn: siteSettings.valueEn })
      .from(siteSettings)
      .where(inArray(siteSettings.key, visKeys));
    const visibility: Record<string, boolean> = {};
    for (const r of visRows) {
      const section = r.key.replace("home.section.", "").replace(".visible", "");
      visibility[section] = r.valueEn !== "0";
    }

    return NextResponse.json({ hero, about, headings, benefits, processSteps, visibility });
  } catch (err) {
    console.error("[API home GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

async function upsertSetting(key: string, group: string, valueEn: string | null, valueKa: string | null) {
  const existing = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.key, key));
  const payload = { key, valueEn, valueKa, group, updatedAt: new Date().toISOString() };
  if (!existing.length) {
    await db.insert(siteSettings).values(payload);
  } else {
    await db.update(siteSettings).set(payload).where(eq(siteSettings.id, existing[0].id));
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const section = (formData.get("_section") as string) ?? "hero";

    if (section === "hero") {
      const brandEn = (formData.get("brandEn") as string) ?? "";
      const brandKa = (formData.get("brandKa") as string) ?? "";
      const titleEn = (formData.get("titleEn") as string) ?? "";
      const titleKa = (formData.get("titleKa") as string) ?? "";
      const ctaEn = (formData.get("ctaEn") as string) ?? "";
      const ctaKa = (formData.get("ctaKa") as string) ?? "";
      const descEn = (formData.get("descriptionEn") as string) ?? "";
      const descKa = (formData.get("descriptionKa") as string) ?? "";

      await upsertSetting("home_hero_brand", "home_hero", brandEn, brandKa);
      await upsertSetting("home_hero_title", "home_hero", titleEn, titleKa);
      await upsertSetting("home_hero_cta", "home_hero", ctaEn, ctaKa);
      await upsertSetting("home_hero_description", "home_hero", descEn, descKa);

      const file = formData.get("heroImage");
      if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) {
          await upsertSetting("home_hero_image", "home_hero", result.path, result.path);
        }
      }

      await logSave("Home", "Hero section", "updated");

    } else if (section === "about") {
      const titleEn = (formData.get("titleEn") as string) ?? "";
      const titleKa = (formData.get("titleKa") as string) ?? "";
      const descEn = (formData.get("descriptionEn") as string) ?? "";
      const descKa = (formData.get("descriptionKa") as string) ?? "";

      await upsertSetting("home_about_title", "home_about", titleEn, titleKa);
      await upsertSetting("home_about_description", "home_about", descEn, descKa);

      const file = formData.get("aboutImage");
      if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) {
          await upsertSetting("home_about_image", "home_about", result.path, result.path);
        }
      }

      await logSave("Home", "Who we are section", "updated");

    } else if (section === "headings") {
      const getStr = (name: string) => (formData.get(name) as string) ?? "";
      await upsertSetting("services.title", "services", getStr("servicesTitleEn"), getStr("servicesTitleKa"));
      await upsertSetting("services.description", "services", getStr("servicesDescriptionEn"), getStr("servicesDescriptionKa"));
      await upsertSetting("benefits.title", "benefits", getStr("benefitsTitleEn"), getStr("benefitsTitleKa"));
      await upsertSetting("process.title", "process", getStr("processTitleEn"), getStr("processTitleKa"));
      await upsertSetting("process.description", "process", getStr("processDescriptionEn"), getStr("processDescriptionKa"));
      await logSave("Home", "Section headings", "updated");

    } else if (section === "visibility") {
      const sectionId = (formData.get("sectionId") as string) ?? "";
      const visible = formData.get("visible") === "1";
      const key = `home.section.${sectionId}.visible`;
      const val = visible ? "1" : "0";
      await upsertSetting(key, "home_sections", val, val);

    } else if (section === "benefit") {
      const benefitId = formData.get("benefitId") as string | null;
      const id = benefitId ? Number(benefitId) : null;
      const titleEn = (formData.get("titleEn") as string)?.trim() ?? "";
      const titleKa = (formData.get("titleKa") as string)?.trim() ?? "";
      const descEn = (formData.get("descriptionEn") as string)?.trim() ?? "";
      const descKa = (formData.get("descriptionKa") as string)?.trim() ?? "";

      if (!titleEn) return NextResponse.json({ error: "Benefit title (EN) is required" }, { status: 400 });

      let iconPath: string | null = null;
      const file = formData.get("icon");
      if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) iconPath = result.path;
      }

      const now = new Date().toISOString();
      if (id) {
        const [existing] = await db.select().from(homeBenefits).where(eq(homeBenefits.id, id));
        if (!existing) return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
        await db.update(homeBenefits).set({
          titleEn, titleKa: titleKa || null, descriptionEn: descEn || null, descriptionKa: descKa || null,
          iconPath: iconPath ?? existing.iconPath, updatedAt: now,
        }).where(eq(homeBenefits.id, id));
      } else {
        const countRows = await db.select({ id: homeBenefits.id }).from(homeBenefits);
        if (countRows.length >= 4) return NextResponse.json({ error: "Max 4 benefits" }, { status: 400 });
        await db.insert(homeBenefits).values({
          titleEn, titleKa: titleKa || null, descriptionEn: descEn || null, descriptionKa: descKa || null,
          iconPath, sortOrder: countRows.length, createdAt: now, updatedAt: now,
        });
      }
      await logSave("Home", "Benefit card", id ? "updated" : "created");

    } else if (section === "deleteBenefit") {
      const benefitId = Number(formData.get("benefitId"));
      if (benefitId) await db.delete(homeBenefits).where(eq(homeBenefits.id, benefitId));

    } else if (section === "processStep") {
      const stepId = formData.get("stepId") as string | null;
      const id = stepId ? Number(stepId) : null;
      const tabTitleEn = (formData.get("tabTitleEn") as string)?.trim() ?? "";
      const tabTitleKa = (formData.get("tabTitleKa") as string)?.trim() ?? "";
      const titleEn = (formData.get("titleEn") as string)?.trim() ?? "";
      const titleKa = (formData.get("titleKa") as string)?.trim() ?? "";
      const descEn = (formData.get("descriptionEn") as string)?.trim() ?? "";
      const descKa = (formData.get("descriptionKa") as string)?.trim() ?? "";

      if (!tabTitleEn || !titleEn) return NextResponse.json({ error: "Tab title and step title (EN) are required" }, { status: 400 });

      let imagePath: string | null = null;
      const file = formData.get("image");
      if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) imagePath = result.path;
      }

      const now = new Date().toISOString();
      if (id) {
        const [existing] = await db.select().from(homeProcessSteps).where(eq(homeProcessSteps.id, id));
        if (!existing) return NextResponse.json({ error: "Process step not found" }, { status: 404 });
        await db.update(homeProcessSteps).set({
          tabTitleEn, tabTitleKa: tabTitleKa || null, titleEn, titleKa: titleKa || null,
          descriptionEn: descEn || null, descriptionKa: descKa || null,
          image: imagePath ?? existing.image, stepNumber: existing.stepNumber, updatedAt: now,
        }).where(eq(homeProcessSteps.id, id));
      } else {
        const rows = await db.select().from(homeProcessSteps).orderBy(asc(homeProcessSteps.sortOrder));
        if (rows.length >= 4) return NextResponse.json({ error: "Max 4 process steps" }, { status: 400 });
        const stepNumber = String(rows.length + 1).padStart(2, "0");
        await db.insert(homeProcessSteps).values({
          tabTitleEn, tabTitleKa: tabTitleKa || null, titleEn, titleKa: titleKa || null,
          descriptionEn: descEn || null, descriptionKa: descKa || null,
          image: imagePath, stepNumber, sortOrder: rows.length, createdAt: now, updatedAt: now,
        });
      }
      await logSave("Home", "Process step", id ? "updated" : "created");

    } else if (section === "deleteProcessStep") {
      const stepId = Number(formData.get("stepId"));
      if (stepId) await db.delete(homeProcessSteps).where(eq(homeProcessSteps.id, stepId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API home PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
