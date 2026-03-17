import { getSaveHistory } from "@/lib/actions/history";
import styles from "../admin.module.css";
import histStyles from "./history.module.css";
import { RestoreButton } from "./RestoreButton";

const ACTION_LABELS: Record<string, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
};

const ACTION_COLORS: Record<string, string> = {
  created: "#059669",
  updated: "#2563eb",
  deleted: "#dc2626",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function groupByDate(entries: { id: number; section: string; label: string; action: string; savedAt: string; snapshotType: string | null; snapshotId: number | null; snapshot: string | null }[]) {
  const groups: Record<string, typeof entries> = {};
  for (const entry of entries) {
    const date = formatDate(entry.savedAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
  }
  return groups;
}

export default async function AdminHistoryPage() {
  const history = await getSaveHistory(200);
  const groups = groupByDate(history);
  const dates = Object.keys(groups);

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Save History</h1>
      </div>

      {dates.length === 0 ? (
        <div className={histStyles.empty}>
          No saves recorded yet. History appears here after you save content.
        </div>
      ) : (
        <div className={histStyles.groups}>
          {dates.map((date) => (
            <div key={date} className={histStyles.group}>
              <div className={histStyles.dateHeader}>{date}</div>
              <div className={styles.tableWrap}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Section</th>
                      <th>Item</th>
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups[date].map((entry) => {
                      const canRestore = !!entry.snapshotType && !!entry.snapshot &&
                        (entry.action === "updated" || entry.action === "deleted");
                      return (
                        <tr key={entry.id}>
                          <td style={{ color: "var(--gray-400)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                            {formatTime(entry.savedAt)}
                          </td>
                          <td>
                            <span className={histStyles.sectionChip}>{entry.section}</span>
                          </td>
                          <td style={{ fontWeight: 500 }}>{entry.label}</td>
                          <td>
                            <span
                              className={histStyles.actionBadge}
                              style={{ "--badge-color": ACTION_COLORS[entry.action] ?? "#6b7280" } as React.CSSProperties}
                            >
                              {ACTION_LABELS[entry.action] ?? entry.action}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {canRestore && <RestoreButton historyId={entry.id} />}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
