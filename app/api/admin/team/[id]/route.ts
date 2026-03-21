import { NextResponse } from "next/server";
import { requireAdmin } from "../../_check";
import { db } from "@/lib/db";
import { teamMembers, teamMemberSocials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils/slug";
import { logSave } from "@/lib/actions/history";
import { uploadImage } from "@/lib/actions/upload";

async function getMemberWithSocials(id: number) {
  const member = await db.select().from(teamMembers).where(eq(teamMembers.id, id)).then((r) => r[0] ?? null);
  if (!member) return null;
  const socials = await db.select().from(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, id));
  return { ...member, socials };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const numId = Number(id);
  if (!numId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  try {
    const member = await getMemberWithSocials(numId);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(member);
  } catch (err) {
    console.error("[API team GET id]", err);
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
    if (!titleEn) return NextResponse.json({ error: "Name (EN) is required" }, { status: 400 });

    const existing = await getMemberWithSocials(numId);
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newSlug = slugify(titleEn) || existing.slug;
    if (newSlug !== existing.slug) {
      const conflict = await db.select().from(teamMembers).where(eq(teamMembers.slug, newSlug));
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

    const showOnHome = formData.get("showOnHome") === "1" || formData.get("showOnHome") === "true" ? 1 : 0;
    const homeOrder = Number(formData.get("homeOrder")) || 0;

    await db.update(teamMembers).set({
      slug: newSlug,
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
    }).where(eq(teamMembers.id, numId));

    // Replace socials
    await db.delete(teamMemberSocials).where(eq(teamMemberSocials.teamMemberId, numId));
    const platforms = ((formData.get("socialPlatforms") as string) ?? "").split("\n").filter(Boolean);
    const links = ((formData.get("socialLinks") as string) ?? "").split("\n").filter(Boolean);
    for (let i = 0; i < Math.min(platforms.length, links.length); i++) {
      const platform = platforms[i].trim();
      const link = links[i].trim();
      if (platform && link) {
        await db.insert(teamMemberSocials).values({ teamMemberId: numId, platform, link });
      }
    }

    await logSave("Team", titleEn, "updated", { type: "team", id: existing.id, data: existing });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API team PUT]", err);
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
    const member = await getMemberWithSocials(numId);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.delete(teamMembers).where(eq(teamMembers.id, numId));
    await logSave("Team", member.titleEn, "deleted", { type: "team", id: member.id, data: member });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API team DELETE]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
