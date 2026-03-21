import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { contactSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { logSave } from "@/lib/actions/history";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const rows = await db.select().from(contactSettings).limit(1);
    return NextResponse.json(rows[0] ?? null);
  } catch (err) {
    console.error("[API contact GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const trim = (v: string | undefined | null) => v?.trim() || null;

    const values = {
      titleEn: trim(body.titleEn),
      titleKa: trim(body.titleKa),
      subtitleEn: trim(body.subtitleEn),
      subtitleKa: trim(body.subtitleKa),
      addressEn: trim(body.addressEn),
      addressKa: trim(body.addressKa),
      email: trim(body.email),
      phone: trim(body.phone),
      secondaryPhone: trim(body.secondaryPhone),
      facebookUrl: trim(body.facebookUrl),
      instagramUrl: trim(body.instagramUrl),
      linkedinUrl: trim(body.linkedinUrl),
      xUrl: trim(body.xUrl),
      mapEmbedUrl: trim(body.mapEmbedUrl),
      updatedAt: new Date().toISOString(),
    };

    const [existing] = await db.select().from(contactSettings).limit(1);
    if (!existing) {
      await db.insert(contactSettings).values(values);
    } else {
      await db.update(contactSettings).set(values).where(eq(contactSettings.id, existing.id));
    }

    await logSave("Contact", "Contact settings", "updated");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API contact PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
