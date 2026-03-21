import Link from "next/link";
import styles from "../admin.module.css";

const tasks = [
  {
    id: 1,
    title: "Missing Georgian Translation",
    badge: "Translation",
    badgeBg: "#fef3c7",
    badgeColor: "#92400e",
    description:
      'News article "New Corporate Tax Laws 2026: What You Need to Know" is missing Georgian (KA) translation.',
    actionLabel: "Translate Now",
    actionHref: "/admin/news",
    meta: "Published 2 days ago",
    iconBg: "#fef3c7",
    iconColor: "#d97706",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 5h18M3 10h18M7 15h10M9 20h6" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Missing Profile Photo",
    badge: "Photo Required",
    badgeBg: "#fef2f2",
    badgeColor: "#991b1b",
    description:
      'Team member "Nino Mgeladze" has no profile photo uploaded.',
    actionLabel: "Add Photo",
    actionHref: "/admin/team",
    meta: "Created yesterday",
    iconBg: "#fef2f2",
    iconColor: "#ef4444",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Incomplete Service Profile",
    badge: "Incomplete",
    badgeBg: "#eff6ff",
    badgeColor: "#1e40af",
    description:
      "1 service page is missing a cover image and description.",
    actionLabel: "Edit Service",
    actionHref: "/admin/services",
    meta: "Last updated 3 days ago",
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Homepage CTA Missing",
    badge: "Action Needed",
    badgeBg: "#f5f3ff",
    badgeColor: "#5b21b6",
    description:
      "The bottom CTA section on the homepage has no heading or button text set.",
    actionLabel: "Edit Homepage",
    actionHref: "/admin/home",
    meta: "Reported today",
    iconBg: "#f5f3ff",
    iconColor: "#8b5cf6",
    Icon: () => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" />
      </svg>
    ),
  },
];

export default function AdminNotificationsPage() {
  return (
    <>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Tasks &amp; Notifications</h1>
          <p className={styles.pageSubtitle}>Content requiring your attention and action.</p>
        </div>
      </div>

      <div className={styles.pageBody}>
        <div className={styles.dsCard}>
          <div className={styles.dsCardHeader}>
            <h2 className={styles.dsCardHeaderTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
              </svg>
              Pending Tasks
              <span style={{ marginLeft: 8, background: "#fef3c7", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 9999, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {tasks.length} items
              </span>
            </h2>
          </div>

          <div>
            {tasks.map(({ id, title, badge, badgeBg, badgeColor, description, actionLabel, actionHref, meta, iconBg, iconColor, Icon }) => (
              <div
                key={id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  padding: "20px",
                  borderBottom: "1px solid #f3f4f6",
                  transition: "background 0.12s",
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: iconBg,
                    color: iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon />
                </div>

                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{title}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 600, background: badgeBg, color: badgeColor }}>
                      {badge}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: "#4b5563", margin: "0 0 10px" }}>{description}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <Link
                      href={actionHref}
                      style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                      {actionLabel}
                    </Link>
                    <span style={{ fontSize: 12, color: "#9ca3af" }}>{meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
