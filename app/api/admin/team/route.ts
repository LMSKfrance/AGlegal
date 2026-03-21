import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { teamMembers, teamMemberSocials } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";
import { uploadImage } from "@/lib/actions/upload";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const list = await db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id));
    return NextResponse.json(list);
  } catch (err) {
    console.error("[API team GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const titleEn = (formData.get("titleEn") as string)?.trim();
    if (!titleEn) return NextResponse.json({ error: "Name (EN) is required" }, { status: 400 });

    const slug = slugify(titleEn) || `member-${Date.now()}`;
    const existing = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.slug, slug));
    if (existing.length) return NextResponse.json({ error: "Slug conflict" }, { status: 409 });

    const imageFile = formData.get("image");
    let imagePath: string | null = null;
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      const fd = new FormData();
      fd.append("image", imageFile);
      const result = await uploadImage(fd);
      if (result.success) imagePath = result.path;
    }

    const showOnHome = formData.get("showOnHome") === "1" || formData.get("showOnHome") === "true" ? 1 : 0;
    const homeOrder = Number(formData.get("homeOrder")) || 0;

    await db.insert(teamMembers).values({
      slug,
      titleEn,
      titleKa: (formData.get("titleKa") as string)?.trim() || null,
      positionEn: (formData.get("positionEn") as string)?.trim() || null,
      positionKa: (formData.get("positionKa") as string)?.trim() || null,
      descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
      descriptionKa: (formData.get("descriptionKa") as string)?.trim() || null,
      quoteEn: (formData.get("quoteEn") as string)?.trim() || null,
      quoteKa: (formData.get("quoteKa") as string)?.trim() || null,
      text1En: (formData.get("text1En") as string)?.trim() || null,
      text1Ka: (formData.get("text1Ka") as string)?.trim() || null,
      text2En: (formData.get("text2En") as string)?.trim() || null,
      text2Ka: (formData.get("text2Ka") as string)?.trim() || null,
      image: imagePath,
      showOnHome,
      homeOrder,
      updatedAt: new Date().toISOString(),
    });

    const [inserted] = await db.select({ id: teamMembers.id }).from(teamMembers).where(eq(teamMembers.slug, slug));
    if (inserted) {
      const platforms = ((formData.get("socialPlatforms") as string) ?? "").split("\n").filter(Boolean);
      const links = ((formData.get("socialLinks") as string) ?? "").split("\n").filter(Boolean);
      for (let i = 0; i < Math.min(platforms.length, links.length); i++) {
        const platform = platforms[i].trim();
        const link = links[i].trim();
        if (platform && link) {
          await db.insert(teamMemberSocials).values({ teamMemberId: inserted.id, platform, link });
        }
      }
    }

    await logSave("Team", titleEn, "created");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API team POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
