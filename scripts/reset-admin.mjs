/**
 * One-time admin credential reset script.
 * Run from project root:
 *   node scripts/reset-admin.mjs
 *
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local
 */

import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load .env.local manually ──────────────────────────────────────────────────
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  // .env.local not found — env vars must already be in the environment
}

const NEW_EMAIL    = "Admin";
const NEW_PASSWORD = "123456";
const NEW_NAME     = "Admin";

const url       = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || url.includes("not-configured")) {
  console.error("❌  TURSO_DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function run() {
  console.log("🔑  Resetting admin credentials…");

  // Ensure table exists
  await client.execute(`
    CREATE TABLE IF NOT EXISTS admin_profile (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL DEFAULT 'Admin',
      email TEXT NOT NULL DEFAULT '',
      password_hash TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT ''
    )
  `);

  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 12);
  const now = new Date().toISOString();

  // Upsert: update row id=1 if it exists, otherwise insert it
  const existing = await client.execute("SELECT id FROM admin_profile WHERE id = 1 LIMIT 1");

  if (existing.rows.length > 0) {
    await client.execute({
      sql: "UPDATE admin_profile SET name = ?, email = ?, password_hash = ?, updated_at = ? WHERE id = 1",
      args: [NEW_NAME, NEW_EMAIL, passwordHash, now],
    });
    console.log("✅  Admin profile updated.");
  } else {
    await client.execute({
      sql: "INSERT INTO admin_profile (id, name, email, password_hash, updated_at) VALUES (1, ?, ?, ?, ?)",
      args: [NEW_NAME, NEW_EMAIL, passwordHash, now],
    });
    console.log("✅  Admin profile created.");
  }

  console.log(`\n   Username : ${NEW_EMAIL}`);
  console.log(`   Password : ${NEW_PASSWORD}\n`);
}

run().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
