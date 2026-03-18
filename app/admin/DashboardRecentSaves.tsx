"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./admin.module.css";
import dashStyles from "./dashboard.module.css";

type Entry = {
  id: number;
  label: string;
  section: string;
  action: string;
  savedAt: string;
};

const ACTION_DOT: Record<string, string> = {
  created: "#059669",
  updated: "#2563eb",
  deleted: "#dc2626",
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const STORAGE_KEY = "admin_dismissed_history";

export function DashboardRecentSaves({ entries }: { entries: Entry[] }) {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setDismissed(new Set(JSON.parse(stored) as number[]));
    } catch {}
  }, []);

  function dismiss(id: number) {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  const visible = entries.filter((e) => !dismissed.has(e.id));

  return (
    <>
      <div className={dashStyles.recentHeader}>
        <h2 className={dashStyles.recentTitle}>Recent saves</h2>
        <Link href="/admin/history" className={dashStyles.viewAll}>
          View all →
        </Link>
      </div>
      <div className={styles.tableWrap}>
        {visible.length === 0 ? (
          <div className={dashStyles.empty}>No recent saves.</div>
        ) : (
          <table className={styles.adminTable}>
            <tbody>
              {visible.map((entry) => (
                <tr key={entry.id} className={dashStyles.saveRow}>
                  <td style={{ width: 10, paddingRight: 0 }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: ACTION_DOT[entry.action] ?? "#6b7280",
                        flexShrink: 0,
                      }}
                    />
                  </td>
                  <td style={{ fontWeight: 500, color: "var(--gray-800)" }}>{entry.label}</td>
                  <td style={{ color: "var(--gray-400)", fontSize: 13 }}>{entry.section}</td>
                  <td style={{ color: "var(--gray-400)", fontSize: 13, textAlign: "right", whiteSpace: "nowrap" }}>
                    {formatRelative(entry.savedAt)}
                  </td>
                  <td style={{ width: 28, paddingLeft: 4 }}>
                    <button
                      type="button"
                      className={dashStyles.dismissBtn}
                      onClick={() => dismiss(entry.id)}
                      title="Hide from dashboard"
                      aria-label="Dismiss"
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
