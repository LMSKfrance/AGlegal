import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";
import { uploadImage } from "@/lib/actions/upload";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const list = await db.select().from(articles).orderBy(desc(articles.date), desc(articles.id));
    return NextResponse.json(list);
  } catch (err) {
    console.error("[API news GET]", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return NextResponse.json({ error: "Title (EN) is required" }, { status: 400 });

    const date = (formData.get("date") as string)?.trim();
    if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

    const slug = slugify(titleEn) || `news-${Date.now()}`;
    const existing = await db.select({ id: articles.id }).from(articles).where(eq(articles.slug, slug));
    if (existing.length) return NextResponse.json({ error: "An article with this title already exists (slug conflict)." }, { status: 409 });

    const imageFile = formData.get("image");
    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const tagsRaw = formData.get("tags") as string | null;
    const tags: string[] = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

    await db.insert(articles).values({
      slug,
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
    });

    await logSave("News", titleEn, "created");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API news POST]", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
