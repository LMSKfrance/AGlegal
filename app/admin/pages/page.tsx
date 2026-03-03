import { Suspense } from "react";
import { Button } from "@/design-system";
import { PagesList } from "./PagesList";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";

export default function AdminPagesPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Pages</h1>
        <Button href="/admin/pages/new" variant="primary" colorStyle="dark" size="m">
          Add page
        </Button>
      </div>
      <PagesList />
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}
