import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { siteSettings, teamMembers } from "@/lib/db/schema";
import { eq, asc, inArray } from "drizzle-orm";
import { logSave } from "@/lib/actions/history";

async function upsertSetting(key: string, valueEn: string | null, valueKa: string | null) {
  const existing = await db.select({ id: siteSettings.id }).from(siteSettings).where(eq(siteSettings.key, key));
  const payload = { key, valueEn, valueKa, group: "about", updatedAt: new Date().toISOString() };
  if (!existing.length) await db.insert(siteSettings).values(payload);
  else await db.update(siteSettings).set(payload).where(eq(siteSettings.id, existing[0].id));
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const settingKeys = [
      "about.numbers.title", "about.numbers.description",
      "about.mission.title", "about.mission.description",
      "about.features.title",
      "about.philosophy.title", "about.philosophy.description",
    ];
    const rows = await db.select().from(siteSettings).where(inArray(siteSettings.key, settingKeys));
    const settings: Record<string, { valueEn: string | null; valueKa: string | null }> = {};
    for (const r of rows) settings[r.key] = { valueEn: r.valueEn, valueKa: r.valueKa };

    // Visibility
    const visKeys = [
      "about.section.hero.visible", "about.section.numbers.visible",
      "about.section.mission.visible", "about.section.features.visible",
      "about.section.philosophy.visible", "about.section.team.visible",
      "about.section.faq.visible",
    ];
    const visRows = await db.select({ key: siteSettings.key, valueEn: siteSettings.valueEn }).from(siteSettings).where(inArray(siteSettings.key, visKeys));
    const visibility: Record<string, boolean> = {};
    for (const r of visRows) {
      const section = r.key.replace("about.section.", "").replace(".visible", "");
      visibility[section] = r.valueEn !== "0";
    }

    // Team members for about page selection
    const team = await db.select({
      id: teamMembers.id,
      titleEn: teamMembers.titleEn,
      image: teamMembers.image,
      showOnAbout: teamMembers.showOnAbout,
      aboutOrder: teamMembers.aboutOrder,
    }).from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));

    return NextResponse.json({ settings, visibility, team });
  } catch (err) {
    console.error("[API about GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const section = body._section ?? "settings";
    const trim = (v: string | undefined | null) => v?.trim() || null;

    if (section === "settings") {
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
        await upsertSetting(key, trim(body[en]), trim(body[ka]));
      }
      await logSave("About", "About settings", "updated");

    } else if (section === "visibility") {
      const sectionId = body.sectionId;
      const visible = body.visible;
      const key = `about.section.${sectionId}.visible`;
      await upsertSetting(key, visible ? "1" : "0", visible ? "1" : "0");

    } else if (section === "team") {
      const entries = body.entries;
      if (Array.isArray(entries)) {
        for (const { id, showOnAbout, aboutOrder } of entries) {
          await db.update(teamMembers).set({
            showOnAbout: showOnAbout ? 1 : 0,
            aboutOrder: aboutOrder ?? 0,
            updatedAt: new Date().toISOString(),
          }).where(eq(teamMembers.id, id));
        }
        await logSave("About", "Team selection", "updated");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API about PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
