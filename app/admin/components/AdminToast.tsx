"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../admin.module.css";

type ToastType = "success" | "error" | null;

export function AdminToast() {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<ToastType>(null);

  useEffect(() => {
    const t = searchParams.get("toast");
    if (t === "success" || t === "error") {
      setToast(t);
      const id = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(id);
    }
  }, [searchParams]);

  if (!toast) return null;

  return (
    <div className={styles.toastWrap} role="status" aria-live="polite">
      <div className={`${styles.toast} ${toast === "success" ? styles.success : styles.error}`}>
        <span className={`${styles.statusBarIcon} ${toast === "error" ? styles.statusBarIconError : ""}`}>
          {toast === "success" ? "✓" : "✕"}
        </span>
        {toast === "success" ? "Saved successfully." : "Something went wrong."}
      </div>
    </div>
  );
}
