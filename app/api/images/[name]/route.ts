import { getStore } from "@netlify/blobs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  if (!name) return new NextResponse("Not found", { status: 404 });

  const store = getStore("images");
  const result = await store.getWithMetadata(name, { type: "arrayBuffer" });
  if (!result?.data) return new NextResponse("Not found", { status: 404 });

  const contentType = (result.metadata?.contentType as string) || "image/jpeg";
  return new NextResponse(result.data as ArrayBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
