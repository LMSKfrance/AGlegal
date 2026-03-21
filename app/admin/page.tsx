import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import { getSaveHistory } from "@/lib/actions/history";
import styles from "./admin.module.css";
import { DashboardRecentSaves } from "./DashboardRecentSaves";

function IconNews() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 4H5C3.895 4 3 4.895 3 6v12c0 1.105.895 2 2 2h14c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zm-1 2v2H6V6h12zm-6 10H6v-1h6v1zm2-3H6v-1h8v1zm2-3H6V9h10v1z" />
    </svg>
  );
}

function IconTeam() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 2a2 2 0 00-2 2v1H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3V4a2 2 0 00-2-2h-4zm0 2h4v1h-4V4zM5 7h14v3H5V7zm0 5h14v7H5v-7z" />
    </svg>
  );
}

function IconPages() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

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

        {/* 2-column grid: Quick Actions + Recent Activity */}
        <div className={styles.dashGrid2}>
          {/* Quick Actions */}
          <div className={styles.dsCard} style={{ marginBottom: 0 }}>
            <div className={styles.dsCardHeader}>
              <h2 className={styles.dsCardHeaderTitle}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
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
                  <div className={`${styles.quickActionIcon}`} style={{ background: "#f3f4f6", color: "#374151" }}>
                    <IconTeam />
                  </div>
                  <span className={styles.quickActionLabel}>Add Member</span>
                </Link>
                <Link href="/admin/services/new" className={styles.quickActionBtn}>
                  <div className={`${styles.quickActionIcon}`} style={{ background: "#f3f4f6", color: "#374151" }}>
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12 7 12 12 15 15" />
                </svg>
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
