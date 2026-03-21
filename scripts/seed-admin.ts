/**
 * Seeds the admin_profile table with initial credentials.
 * Run once: npx tsx scripts/seed-admin.ts
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import * as schema from "../lib/db/schema";
import { eq } from "drizzle-orm";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const db = drizzle(client, { schema });

const NAME = "Admin";
const EMAIL = process.env.ADMIN_EMAIL ?? "admin@aglegal.ge";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "123456";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  const [existing] = await db.select().from(schema.adminProfile).limit(1);
  if (existing) {
    await db
      .update(schema.adminProfile)
      .set({ name: NAME, email: EMAIL, passwordHash, updatedAt: new Date().toISOString() })
      .where(eq(schema.adminProfile.id, existing.id));
    console.log("Admin profile updated.");
  } else {
    await db.insert(schema.adminProfile).values({ id: 1, name: NAME, email: EMAIL, passwordHash });
    console.log("Admin profile created.");
  }
  console.log(`Login: ${EMAIL} / ${PASSWORD}`);
}

main().catch(console.error).finally(() => client.close());
