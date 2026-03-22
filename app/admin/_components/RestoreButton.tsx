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
      <span className="text-[11px] text-green-600 font-semibold flex items-center gap-1">
        <i className="ph ph-check-circle" /> Restored
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleRestore}
        disabled={status === "loading"}
        className="text-[11px] font-semibold text-brand-400 hover:text-primary-600 flex items-center gap-1 transition-colors disabled:opacity-50"
      >
        <i className="ph ph-clock-counter-clockwise text-[13px]" />
        {status === "loading" ? "Restoring…" : "Restore"}
      </button>
      {error && (
        <span className="text-[10px] text-red-500 max-w-[180px] text-right leading-tight">{error}</span>
      )}
    </div>
  );
}
