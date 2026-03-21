import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { uploadImage } from "@/lib/actions/upload";

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const formData = await request.formData();
    const result = await uploadImage(formData);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, path: result.path });
  } catch (err) {
    console.error("[API upload POST]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
