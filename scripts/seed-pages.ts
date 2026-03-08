/**
 * Seed the three default pages (about, services, contact) and about section settings.
 * Idempotent: skips slugs/keys that already exist. Safe to run on an existing DB.
 * Run: npm run db:seed-pages
 */
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import fs from "fs";
import path from "path";
import * as schema from "../lib/db/schema";

const DB_PATH = path.join(process.cwd(), "data", "ag-legal.db");

if (!fs.existsSync(DB_PATH)) {
  console.error("Database not found at", DB_PATH);
  console.error("Run db:push first, or db:seed for a full seed.");
  process.exit(1);
}

const sqlite = new Database(DB_PATH);
sqlite.pragma("journal_mode = WAL");
const db = drizzle(sqlite, { schema });

const now = new Date().toISOString();
const defaultPages = [
  {
    slug: "about",
    titleEn: "Your Trusted Legal Advisors in Georgia.",
    contentEn:
      "AG Legal Consulting has provided expert legal services since 2007, advising businesses and individuals in civil and administrative law. We deliver strategic solutions for complex legal challenges.",
    sortOrder: 0,
  },
  {
    slug: "services",
    titleEn: "Our services.",
    contentEn:
      "Navigating the complexities of business law is crucial to the success and longevity of your company. Whether you're starting a new business or looking to expand or protect an established one, our experienced legal team is here to provide expert support.\n\nWe offer comprehensive services to businesses of all sizes, from startups to established enterprises, ensuring that every aspect of your business operations remains legally sound and compliant.",
    sortOrder: 1,
  },
  {
    slug: "contact",
    titleEn: "Get in Touch",
    contentEn:
      "We're here to provide the legal support you need. Reach out today to discuss your case or ask any questions.",
    sortOrder: 2,
  },
];

console.log("Seeding pages (about, services, contact)...\n");
for (const p of defaultPages) {
  const exists = sqlite.prepare("SELECT id FROM pages WHERE slug = ?").get(p.slug);
  if (!exists) {
    db.insert(schema.pages).values({
      slug: p.slug,
      titleEn: p.titleEn,
      titleKa: null,
      contentEn: p.contentEn,
      contentKa: null,
      metaDescriptionEn: null,
      metaDescriptionKa: null,
      sortOrder: p.sortOrder,
      createdAt: now,
      updatedAt: now,
    }).run();
    console.log("  + page:", p.slug);
  } else {
    console.log("  ~ page already exists:", p.slug);
  }
}
// --- About page section settings (site_settings) ---
const aboutSettings = [
  { key: "about.numbers.title", valueEn: "Our legacy in numbers.", valueKa: null, group: "about" },
  { key: "about.numbers.description", valueEn: "We're proud of the milestones we've achieved over the years, showcasing our commitment to excellence in every case we handle.", valueKa: null, group: "about" },
  { key: "about.mission.title", valueEn: "Our mission: Justice for all.", valueKa: null, group: "about" },
  { key: "about.mission.description", valueEn: "AG Legal Consulting - Your Trusted Legal Advisors in Georgia", valueKa: null, group: "about" },
  { key: "about.features.title", valueEn: "What set us apart.", valueKa: null, group: "about" },
  { key: "about.philosophy.title", valueEn: "A philosophy of integrity and dedication.", valueKa: null, group: "about" },
  { key: "about.philosophy.description", valueEn: "At the heart of our legal practice lies an unwavering commitment to justice, transparency, and exceptional client service.", valueKa: null, group: "about" },
];
for (const s of aboutSettings) {
  const exists = sqlite.prepare("SELECT id FROM site_settings WHERE key = ?").get(s.key);
  if (!exists) {
    db.insert(schema.siteSettings).values({
      key: s.key,
      valueEn: s.valueEn,
      valueKa: s.valueKa,
      group: s.group,
      updatedAt: now,
    }).run();
    console.log("  + setting:", s.key);
  }
}

sqlite.close();
console.log("\nDone. Visit /admin/pages and /admin/about to edit.");
