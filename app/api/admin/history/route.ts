import { NextResponse } from "next/server";
import { requireAdmin } from "../_check";
import { getSaveHistory, rollbackSave } from "@/lib/actions/history";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const list = await getSaveHistory(100);
    return NextResponse.json(list);
  } catch (err) {
    console.error("[API history GET]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();
    const historyId = Number(body.historyId);
    if (!historyId) return NextResponse.json({ error: "Invalid historyId" }, { status: 400 });

    const result = await rollbackSave(historyId);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API history POST]", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
