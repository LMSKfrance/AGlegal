import { NextResponse } from "next/server";
import { requireAdmin } from "../../_check";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";
import { uploadImage } from "@/lib/actions/upload";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const rows = await db.select().from(articles).where(eq(articles.id, numId));
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("[API news GET id]", err);
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
    const formData = await request.formData();
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return NextResponse.json({ error: "Title (EN) is required" }, { status: 400 });

    const date = (formData.get("date") as string)?.trim();
    if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

    const [existing] = await db.select().from(articles).where(eq(articles.id, numId));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newSlug = slugify(titleEn) || existing.slug;
    if (newSlug !== existing.slug) {
      const conflict = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, newSlug));
      if (conflict.length) return NextResponse.json({ error: "Slug conflict" }, { status: 409 });
    }

    const imageFile = formData.get("image");
    let imagePath: string | null = existing.image;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const tagsRaw = formData.get("tags") as string | null;
    const tags: string[] = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    await db.update(articles).set({
      slug: newSlug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
      descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
      contentEn: (formData.get("contentEn") as string)?.trim() || null,
      contentKa: (formData.get("contentKa") as string)?.trim() || null,
      image: imagePath,
      date,
      time: (formData.get("time") as string)?.trim() || null,
      tags: tags.length ? tags : null,
      type: (formData.get("type") as string)?.trim() || null,
      updatedAt: new Date().toISOString(),
    }).where(eq(articles.id, numId));

    await logSave("News", titleEn, "updated", { type: "news", id: existing.id, data: existing });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API news PUT]", err);
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
    const [row] = await db.select().from(articles).where(eq(articles.id, numId));
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(articles).where(eq(articles.id, numId));
    await logSave("News", row.titleEn, "deleted", { type: "news", id: row.id, data: row });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API news DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
