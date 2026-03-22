import { getStore } from "@netlify/blobs";
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
};

const ALLOWED_EXT = [".pdf", ".ppt", ".pptx"];

function settingKey(lang: "en" | "ka") {
  return `presentations.${lang}`;
}

async function upsertMeta(lang: "en" | "ka", meta: object) {
  const key = settingKey(lang);
  const value = JSON.stringify(meta);
  const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  if (existing) {
    await db.update(siteSettings).set({ valueEn: value, updatedAt: new Date().toISOString() }).where(eq(siteSettings.key, key));
  } else {
    await db.insert(siteSettings).values({ key, valueEn: value, group: "presentations" });
  }
}

async function deleteMeta(lang: "en" | "ka") {
  const key = settingKey(lang);
  await db.delete(siteSettings).where(eq(siteSettings.key, key));
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const lang = formData.get("lang") as string;
    const file = formData.get("file") as File | null;

    if (lang !== "en" && lang !== "ka") {
      return NextResponse.json({ error: "Invalid lang parameter." }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Size check
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File exceeds the 25 MB limit." }, { status: 400 });
    }

    // MIME type check
    const allowedExt = ALLOWED_MIME[file.type];
    if (!allowedExt) {
      return NextResponse.json({ error: "Only PDF, PPT, and PPTX files are allowed." }, { status: 400 });
    }

    // Extension check (belt-and-suspenders)
    const nameLower = file.name.toLowerCase();
    const matchesExt = ALLOWED_EXT.some((ext) => nameLower.endsWith(ext));
    if (!matchesExt) {
      return NextResponse.json({ error: "File extension must be .pdf, .ppt, or .pptx." }, { status: 400 });
    }

    const blobKey = `presentation-${lang}`;
    const store = getStore("presentations");

    const buffer = await file.arrayBuffer();
    await store.set(blobKey, buffer, {
      metadata: { contentType: file.type, filename: file.name },
    });

    const sizeLabel = file.size >= 1_048_576
      ? `${(file.size / 1_048_576).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    await upsertMeta(lang, {
      blobKey,
      filename: file.name,
      size: file.size,
      sizeLabel,
      contentType: file.type,
    });

    return NextResponse.json({ success: true, filename: file.name, sizeLabel });
  } catch (err) {
    console.error("[upload-presentation POST]", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { lang } = await request.json();
    if (lang !== "en" && lang !== "ka") {
      return NextResponse.json({ error: "Invalid lang parameter." }, { status: 400 });
    }

    const store = getStore("presentations");
    await store.delete(`presentation-${lang}`);
    await deleteMeta(lang);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[upload-presentation DELETE]", err);
    return NextResponse.json({ error: "Delete failed. Please try again." }, { status: 500 });
  }
}
