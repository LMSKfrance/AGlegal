"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

type Entry = {
  id: number;
  label: string;
  section: string;
  action: string;
  savedAt: string;
};

const ACTION_COLOR: Record<string, string> = {
  created: "#22c55e",
  updated: "#3b82f6",
  deleted: "#ef4444",
};

// Capitalise first letter of section name
function formatSection(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
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

  const visible = entries.filter((e) => !dismissed.has(e.id));

  if (visible.length === 0) {
    return (
      <div style={{ padding: "32px 20px", color: "#9ca3af", fontSize: 14, textAlign: "center" }}>
        No recent activity.
      </div>
    );
  }

  return (
    <>
      {visible.map((entry) => (
        <div key={entry.id} className={styles.activityItem}>
          <div className={styles.activityLeft}>
            <span
              className={styles.activityDot}
              style={{ background: ACTION_COLOR[entry.action] ?? "#9ca3af" }}
            />
            <div>
              <p className={styles.activityTitle}>{entry.label}</p>
              <p className={styles.activityMeta}>
                {formatSection(entry.section)} • {formatRelative(entry.savedAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
