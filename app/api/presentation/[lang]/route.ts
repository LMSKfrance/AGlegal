import { getStore } from "@netlify/blobs";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;

  if (lang !== "en" && lang !== "ka") {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    // Read metadata from settings
    const key = `presentations.${lang}`;
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
    if (!row?.valueEn) {
      return new NextResponse("No presentation uploaded yet.", { status: 404 });
    }

    const meta = JSON.parse(row.valueEn) as {
      blobKey: string;
      filename: string;
      contentType: string;
    };

    const store = getStore("presentations");
    const result = await store.getWithMetadata(meta.blobKey, { type: "arrayBuffer" });
    if (!result?.data) {
      return new NextResponse("File not found.", { status: 404 });
    }

    // Sanitise filename for Content-Disposition header
    const safeFilename = meta.filename.replace(/[^\w.\-]/g, "_");

    return new NextResponse(result.data as ArrayBuffer, {
      headers: {
        "Content-Type": meta.contentType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (err) {
    console.error("[presentation GET]", err);
    return new NextResponse("Server error.", { status: 500 });
  }
}
