import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .where(inArray(siteSettings.key, ["presentations.en", "presentations.ka"]));

    const result: Record<string, { filename: string; sizeLabel: string } | null> = {
      en: null,
      ka: null,
    };

    for (const row of rows) {
      const lang = row.key === "presentations.en" ? "en" : "ka";
      if (row.valueEn) {
        try {
          const meta = JSON.parse(row.valueEn);
          result[lang] = { filename: meta.filename, sizeLabel: meta.sizeLabel };
        } catch {}
      }
    }

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[presentation-meta GET]", err);
    return NextResponse.json({ en: null, ka: null });
  }
}
