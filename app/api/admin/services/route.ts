import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";
import { uploadImage } from "@/lib/actions/upload";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const list = await db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
    return NextResponse.json(list);
  } catch (err) {
    console.error("[API services GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return NextResponse.json({ error: "Title (EN) is required" }, { status: 400 });

    const slug = slugify(titleEn) || `service-${Date.now()}`;
    const existing = await db.select({ id: services.id }).from(services).where(eq(services.slug, slug));
    if (existing.length) return NextResponse.json({ error: "Slug conflict" }, { status: 409 });

    async function handleUpload(field: string): Promise<string | null> {
      const file = formData.get(field);
      if (file && file instanceof File && file.size > 0) {
        const fd = new FormData();
        fd.append("image", file);
        const result = await uploadImage(fd);
        if (result.success) return result.path;
      }
      return null;
    }

    const imagePath = await handleUpload("image");
    const thumbPath = await handleUpload("thumbnailImage");
    const homeCardPath = await handleUpload("homeCardImage");

    const showOnHome = formData.get("showOnHome") === "1" || formData.get("showOnHome") === "true" ? 1 : 0;
    const homeOrder = Number(formData.get("homeOrder")) || 0;

    await db.insert(services).values({
      slug,
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
    });

    await logSave("Services", titleEn, "created");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API services POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
