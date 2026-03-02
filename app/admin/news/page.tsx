import styles from "../admin.module.css";

export default function AdminNewsPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>News</h1>
      <p style={{ color: "var(--gray-600)", margin: 0 }}>
        News CRUD (list + add/edit form) will be implemented in Phase 5a.
      </p>
    </>
  );
}
