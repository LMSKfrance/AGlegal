import { NextResponse } from "next/server";
import { requireAdmin } from "../../_check";
import { db } from "@/lib/db";
import { pages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const rows = await db.select().from(pages).where(eq(pages.id, numId));
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("[API pages GET id]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const body = await request.json();
    const titleEn = body.titleEn?.trim();
    if (!titleEn) return NextResponse.json({ error: "Title (EN) is required" }, { status: 400 });

    const [existing] = await db.select().from(pages).where(eq(pages.id, numId));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const slugInput = body.slug?.trim();
    const newSlug = slugInput ? slugify(slugInput) : existing.slug;
    if (!newSlug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    if (newSlug !== existing.slug) {
      const conflict = await db.select().from(pages).where(eq(pages.slug, newSlug));
      if (conflict.length) return NextResponse.json({ error: "Slug conflict" }, { status: 409 });
    }

    const trim = (v: string | undefined | null) => v?.trim() || null;

    await db.update(pages).set({
      slug: newSlug,
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
    }).where(eq(pages.id, numId));

    await logSave("Pages", titleEn, "updated", { type: "page", id: existing.id, data: existing });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API pages PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const [row] = await db.select().from(pages).where(eq(pages.id, numId));
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(pages).where(eq(pages.id, numId));
    await logSave("Pages", row.titleEn, "deleted", { type: "page", id: row.id, data: row });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API pages DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
