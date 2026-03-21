import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { db } from "@/lib/db";
import { adminProfile } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function ensureTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS admin_profile (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      email TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT ''
    )
  `);
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    await ensureTable();
    const [profile] = await db.select({
      id: adminProfile.id,
      name: adminProfile.name,
      email: adminProfile.email,
      updatedAt: adminProfile.updatedAt,
    }).from(adminProfile).limit(1);
    return NextResponse.json(profile ?? null);
  } catch (err) {
    console.error("[API profile GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const name = body.name?.trim();
    const email = body.email?.trim();
    const currentPassword = body.currentPassword ?? "";
    const newPassword = body.newPassword?.trim();
    const confirmPassword = body.confirmPassword?.trim();

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await ensureTable();
    const [profile] = await db.select().from(adminProfile).limit(1);

    if (!profile) {
      if (!currentPassword) return NextResponse.json({ error: "Password is required for initial setup" }, { status: 400 });
      if (newPassword && newPassword !== confirmPassword) return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
      if (newPassword && newPassword.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      const passwordHash = await bcrypt.hash(newPassword || currentPassword, 12);
      await db.insert(adminProfile).values({ id: 1, name, email, passwordHash, updatedAt: new Date().toISOString() });
      return NextResponse.json({ success: true });
    }

    const validCurrent = await bcrypt.compare(currentPassword, profile.passwordHash);
    if (!validCurrent) return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 });

    let passwordHash = profile.passwordHash;
    if (newPassword) {
      if (newPassword !== confirmPassword) return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
      if (newPassword.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await db.update(adminProfile).set({ name, email, passwordHash, updatedAt: new Date().toISOString() }).where(eq(adminProfile.id, profile.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API profile PUT]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
