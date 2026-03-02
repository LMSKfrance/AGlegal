import styles from "../admin.module.css";

export default function AdminTeamPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Team</h1>
      <p style={{ color: "var(--gray-600)", margin: 0 }}>
        Team CRUD (list + add/edit form) will be implemented in Phase 5b.
      </p>
    </>
  );
}
