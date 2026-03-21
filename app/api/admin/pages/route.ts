import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const list = await db.select().from(pages).orderBy(asc(pages.sortOrder), asc(pages.id));
    return NextResponse.json(list);
  } catch (err) {
    console.error("[API pages GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const titleEn = body.titleEn?.trim();
    if (!titleEn) return NextResponse.json({ error: "Title (EN) is required" }, { status: 400 });

    const slugInput = body.slug?.trim();
    const slug = slugInput ? slugify(slugInput) : slugify(titleEn);
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    const existing = await db.select({ id: pages.id }).from(pages).where(eq(pages.slug, slug));
    if (existing.length) return NextResponse.json({ error: "A page with this slug already exists" }, { status: 409 });

    const trim = (v: string | undefined | null) => v?.trim() || null;

    await db.insert(pages).values({
      slug,
      titleEn,
      titleKa: trim(body.titleKa),
      contentEn: trim(body.contentEn),
      contentKa: trim(body.contentKa),
      metaDescriptionEn: trim(body.metaDescriptionEn),
      metaDescriptionKa: trim(body.metaDescriptionKa),
      seoTitleEn: trim(body.seoTitleEn),
      seoTitleKa: trim(body.seoTitleKa),
      ogTitleEn: trim(body.ogTitleEn),
      ogTitleKa: trim(body.ogTitleKa),
      ogDescriptionEn: trim(body.ogDescriptionEn),
      ogDescriptionKa: trim(body.ogDescriptionKa),
      ogImage: trim(body.ogImage),
      updatedAt: new Date().toISOString(),
    });

    await logSave("Pages", titleEn, "created");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API pages POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
