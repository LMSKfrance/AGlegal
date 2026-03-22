"use client";

import { useState } from "react";
import { rollbackSave } from "@/lib/actions/history";

export function RestoreButton({ historyId }: { historyId: number }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleRestore() {
    if (!confirm("Restore this snapshot? Current data will be overwritten.")) return;
    setStatus("loading");
    setError(null);
    const result = await rollbackSave(historyId);
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setError(result.error ?? "Restore failed");
    }
  }

  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-green-200 text-[12px] font-semibold text-green-600">
        <i className="ph ph-check-circle text-[14px]" /> Restored
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleRestore}
        disabled={status === "loading"}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-[12px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
      >
        <i className="ph ph-clock-counter-clockwise text-[14px]" />
        {status === "loading" ? "Restoring…" : "Restore"}
      </button>
      {error && (
        <span className="text-[10px] text-red-500 max-w-[180px] text-right leading-tight">{error}</span>
      )}
    </div>
  );
}
