"use client";

import { useState } from "react";
import { rollbackSave } from "@/lib/actions/history";
import { useRouter } from "next/navigation";
import styles from "./history.module.css";

export function RestoreButton({ historyId, label }: { historyId: number; label: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  async function handleRestore() {
    if (!confirm(`Restore "${label}" to this version? This will overwrite the current content.`)) return;
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
    return <span className={styles.restoreDone}>✓ Restored</span>;
  }

  return (
    <button
      type="button"
      className={`${styles.restoreBtn} ${loading ? styles.restoreBtnLoading : ""}`}
      onClick={handleRestore}
      disabled={loading}
      title="Restore this version"
    >
      <svg
        className={styles.restoreArrow}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2.5 4.5A5.5 5.5 0 1 1 2.5 11.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M2.5 1.5V4.5H5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

