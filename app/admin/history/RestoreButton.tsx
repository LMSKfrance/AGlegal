"use client";

import { useState } from "react";
import { rollbackSave } from "@/lib/actions/history";
import { useRouter } from "next/navigation";
import styles from "./history.module.css";

export function RestoreButton({ historyId }: { historyId: number }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleRestore() {
    if (!confirm("Restore this version? This will overwrite the current content.")) return;
    setLoading(true);
    const result = await rollbackSave(historyId);
    setLoading(false);
    if (result.error) {
      alert(result.error);
    } else {
      setDone(true);
      router.refresh();
    }
  }

  if (done) {
    return <span className={styles.restoreDone}>Restored</span>;
  }

  return (
    <button
      type="button"
      className={styles.restoreBtn}
      onClick={handleRestore}
      disabled={loading}
    >
      {loading ? "Restoring…" : "Restore"}
    </button>
  );
}
