import Database from "better-sqlite3";
import path from "path";
import mock from "../constants/mock.js";
import * as schema from "../lib/db/schema";
import { drizzle } from "drizzle-orm/better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "ag-legal.db");
const sqlite = new Database(dbPath);
const db = drizzle(sqlite, { schema });

async function main() {
  const now = new Date().toISOString();

  const benefitsExisting = await db.select().from(schema.homeBenefits);
  if (benefitsExisting.length === 0) {
    mock.benefits.slice(0, 4).forEach((b: any, index: number) => {
      db.insert(schema.homeBenefits).values({
        titleEn: b.title,
        titleKa: null,
        descriptionEn: b.description,
        descriptionKa: null,
        iconPath: null,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      }).run();
    });
    console.log(`Seeded ${Math.min(4, mock.benefits.length)} home benefits`);
  }

  const stepsExisting = await db.select().from(schema.homeProcessSteps);
  if (stepsExisting.length === 0) {
    mock.tabs.slice(0, 4).forEach((t: any, index: number) => {
      db.insert(schema.homeProcessSteps).values({
        tabTitleEn: t.title,
        tabTitleKa: null,
        titleEn: t.content.title,
        titleKa: null,
        descriptionEn: t.content.description,
        descriptionKa: null,
        image: t.content.image,
        stepNumber: t.content.number,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      }).run();
    });
    console.log(`Seeded ${Math.min(4, mock.tabs.length)} home process steps`);
  }
}

main().catch((err) => {
  console.error("Seed home failed:", err);
  process.exit(1);
});

