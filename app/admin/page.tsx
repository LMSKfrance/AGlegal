import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import { getSaveHistory } from "@/lib/actions/history";
import styles from "./admin.module.css";
import { DashboardRecentSaves } from "./DashboardRecentSaves";

const icons = {
  news: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  ),
  team: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
      <path d="M16 3.13a4 4 0 010 7.75" />
      <path d="M21 21v-2a4 4 0 00-3-3.87" />
    </svg>
  ),
  services: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  pages: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h5" />
    </svg>
  ),
};


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
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statCardIcon} ${styles.statCardIconBlue}`}>
            {icons.news}
          </div>
          <p className={styles.statLabel}>News articles</p>
          <p className={styles.statValue}>{stats.articles}</p>
          <Link href="/admin/news">Manage news</Link>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statCardIcon} ${styles.statCardIconGreen}`}>
            {icons.team}
          </div>
          <p className={styles.statLabel}>Team members</p>
          <p className={styles.statValue}>{stats.teamMembers}</p>
          <Link href="/admin/team">Manage team</Link>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statCardIcon} ${styles.statCardIconPurple}`}>
            {icons.services}
          </div>
          <p className={styles.statLabel}>Services</p>
          <p className={styles.statValue}>{stats.services}</p>
          <Link href="/admin/services">Manage services</Link>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statCardIcon} ${styles.statCardIconOrange}`}>
            {icons.pages}
          </div>
          <p className={styles.statLabel}>Pages</p>
          <p className={styles.statValue}>{stats.pages}</p>
          <Link href="/admin/pages">Manage pages</Link>
        </div>
      </div>

      <DashboardRecentSaves entries={recentHistory} />
    </>
  );
}
