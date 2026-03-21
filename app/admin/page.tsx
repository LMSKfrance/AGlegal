import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import { getSaveHistory } from "@/lib/actions/history";
import styles from "./admin.module.css";
import { DashboardRecentSaves } from "./DashboardRecentSaves";

// ─── Stat card icons ──────────────────────────────────────────────────────────

function IconNews() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /><path d="M8 9h8M8 13h5" />
    </svg>
  );
}
function IconTeam() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="3" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75" /><path d="M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  );
}
function IconPages() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" /><path d="M8 13h8M8 17h5" />
    </svg>
  );
}

// ─── Inline section icons ─────────────────────────────────────────────────────

function IconWarning({ color = "#f59e0b" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" />
    </svg>
  );
}
function IconLightning() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

// ─── Status card icons ────────────────────────────────────────────────────────

function IconTranslate() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8l6 6" /><path d="M4 6h7M2 4h9M7 4v2" />
      <path d="M22 20l-5-10-5 10M14 17h6" />
    </svg>
  );
}
function IconImageBroken() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function IconUserMinus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" /><line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminPage() {
  let stats = { articles: 0, teamMembers: 0, services: 0, pages: 0 };
  let recentHistory: Awaited<ReturnType<typeof getSaveHistory>> = [];

  try {
    [stats, recentHistory] = await Promise.all([
      getAdminStats(),
      getSaveHistory(5),
    ]);
  } catch (err) {
    console.error("[AdminPage]", err);
  }

  return (
    <>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Overview of your CMS content and recent activity.</p>
        </div>
      </div>

      <div className={styles.pageBody}>
        {/* Stats grid */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.statCardIconBlue}`}>
              <IconNews />
            </div>
            <div>
              <p className={styles.statCardNum}>{stats.articles}</p>
              <p className={styles.statLabel}>News Articles</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.statCardIconIndigo}`}>
              <IconTeam />
            </div>
            <div>
              <p className={styles.statCardNum}>{stats.teamMembers}</p>
              <p className={styles.statLabel}>Team Members</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.statCardIconGreen}`}>
              <IconBriefcase />
            </div>
            <div>
              <p className={styles.statCardNum}>{stats.services}</p>
              <p className={styles.statLabel}>Services</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statCardIcon} ${styles.statCardIconAmber}`}>
              <IconPages />
            </div>
            <div>
              <p className={styles.statCardNum}>{stats.pages}</p>
              <p className={styles.statLabel}>Static Pages</p>
            </div>
          </div>
        </div>

        {/* Content Status */}
        <div className={styles.dsCard}>
          <div className={styles.dsCardHeader}>
            <h2 className={styles.dsCardHeaderTitle}>
              <IconWarning />
              Content Status
            </h2>
            <Link href="/admin/notifications" className={styles.dsCardHeaderLink}>View all tasks</Link>
          </div>
          <div className={styles.dsCardBody}>
            <div className={styles.statusGrid}>
              <div className={`${styles.statusItem} ${styles.statusItemAmber}`}>
                <div className={styles.statusItemIcon} style={{ background: "rgba(245,158,11,0.1)", color: "#f59e0b" }}>
                  <IconTranslate />
                </div>
                <div>
                  <p className={styles.statusItemTitle}>3 Missing Translations</p>
                  <p className={styles.statusItemDesc}>News articles</p>
                </div>
              </div>
              <div className={`${styles.statusItem} ${styles.statusItemRed}`}>
                <div className={styles.statusItemIcon} style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}>
                  <IconImageBroken />
                </div>
                <div>
                  <p className={styles.statusItemTitle}>1 Missing Photo</p>
                  <p className={styles.statusItemDesc}>Team member</p>
                </div>
              </div>
              <div className={`${styles.statusItem} ${styles.statusItemBlue}`}>
                <div className={styles.statusItemIcon} style={{ background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
                  <IconUserMinus />
                </div>
                <div>
                  <p className={styles.statusItemTitle}>Incomplete Profile</p>
                  <p className={styles.statusItemDesc}>1 Service page</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-column grid: Quick Actions + Recent Activity */}
        <div className={styles.dashGrid2}>
          {/* Quick Actions */}
          <div className={styles.dsCard} style={{ marginBottom: 0 }}>
            <div className={styles.dsCardHeader}>
              <h2 className={styles.dsCardHeaderTitle}>
                <IconLightning />
                Quick Actions
              </h2>
            </div>
            <div className={styles.dsCardBody}>
              <div className={styles.quickActionsGrid}>
                <Link href="/admin/news/new" className={styles.quickActionBtn}>
                  <div className={styles.quickActionIcon}>
                    <IconNews />
                  </div>
                  <span className={styles.quickActionLabel}>New Article</span>
                </Link>
                <Link href="/admin/team/new" className={styles.quickActionBtn}>
                  <div className={styles.quickActionIconNeutral}>
                    <IconTeam />
                  </div>
                  <span className={styles.quickActionLabel}>Add Member</span>
                </Link>
                <Link href="/admin/services/new" className={styles.quickActionBtn}>
                  <div className={styles.quickActionIconNeutral}>
                    <IconBriefcase />
                  </div>
                  <span className={styles.quickActionLabel}>Add Service</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.dsCard} style={{ marginBottom: 0 }}>
            <div className={styles.dsCardHeader}>
              <h2 className={styles.dsCardHeaderTitle}>
                <IconClock />
                Recent Activity
              </h2>
              <Link href="/admin/history" className={styles.dsCardHeaderLink}>
                View full history
              </Link>
            </div>
            <DashboardRecentSaves entries={recentHistory} />
          </div>
        </div>
      </div>
    </>
  );
}
