import styles from "../admin.module.css";

export default function AdminServicesPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Services</h1>
      <p style={{ color: "var(--gray-600)", margin: 0 }}>
        Services CRUD (list + add/edit form) will be implemented in Phase 5c.
      </p>
    </>
  );
}
