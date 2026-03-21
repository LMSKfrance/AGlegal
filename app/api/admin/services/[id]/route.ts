import { NextResponse } from "next/server";
import { requireAdmin } from "../../_check";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
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
    const rows = await db.select().from(services).where(eq(services.id, numId));
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("[API services GET id]", err);
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

    const [existing] = await db.select().from(services).where(eq(services.id, numId));
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newSlug = slugify(titleEn) || existing.slug;
    if (newSlug !== existing.slug) {
      const conflict = await db.select({ id: services.id }).from(services).where(eq(services.slug, newSlug));
      if (conflict.length) return NextResponse.json({ error: "Slug conflict" }, { status: 409 });
    }

    async function handleUpload(field: string, fallback: string | null): Promise<string | null> {
      const file = formData.get(field);
      if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) return result.path;
      }
      return fallback;
    }

    const imagePath = await handleUpload("image", existing.image);
    const thumbPath = await handleUpload("thumbnailImage", existing.thumbnailImage);
    const homeCardPath = await handleUpload("homeCardImage", existing.homeCardImage);

    const showOnHome = formData.get("showOnHome") === "1" || formData.get("showOnHome") === "true" ? 1 : 0;
    const homeOrder = Number(formData.get("homeOrder")) || 0;

    await db.update(services).set({
      slug: newSlug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
      descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
      text1En: (formData.get("text1En") as string)?.trim() || null,
      text1Ka: (formData.get("text1Ka") as string)?.trim() || null,
      text2En: (formData.get("text2En") as string)?.trim() || null,
      text2Ka: (formData.get("text2Ka") as string)?.trim() || null,
      quoteEn: (formData.get("quoteEn") as string)?.trim() || null,
      quoteKa: (formData.get("quoteKa") as string)?.trim() || null,
      image: imagePath,
      thumbnailImage: thumbPath,
      showOnHome,
      homeOrder,
      homeShortDescriptionEn: (formData.get("homeShortDescriptionEn") as string)?.trim() || null,
      homeShortDescriptionKa: (formData.get("homeShortDescriptionKa") as string)?.trim() || null,
      homeLearnMoreUrl: (formData.get("homeLearnMoreUrl") as string)?.trim() || null,
      homeCardImage: homeCardPath,
      updatedAt: new Date().toISOString(),
    }).where(eq(services.id, numId));

    await logSave("Services", titleEn, "updated", { type: "service", id: existing.id, data: existing });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API services PUT]", err);
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
    const [row] = await db.select().from(services).where(eq(services.id, numId));
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(services).where(eq(services.id, numId));
    await logSave("Services", row.titleEn, "deleted", { type: "service", id: row.id, data: row });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API services DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
