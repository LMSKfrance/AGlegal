import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import styles from "./admin.module.css";

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <>
      <h1 className={styles.pageTitle}>Dashboard</h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>News</p>
          <p className={styles.statValue}>{stats.articles}</p>
          <Link href="/admin/news">Manage news</Link>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Team members</p>
          <p className={styles.statValue}>{stats.teamMembers}</p>
          <Link href="/admin/team">Manage team</Link>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Services</p>
          <p className={styles.statValue}>{stats.services}</p>
          <Link href="/admin/services">Manage services</Link>
        </div>
      </div>
    </>
  );
}
