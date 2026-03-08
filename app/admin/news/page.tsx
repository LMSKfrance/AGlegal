import { Suspense } from "react";
import { Button } from "@/design-system";
import { NewsList } from "./NewsList";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";

export default function AdminNewsPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>News</h1>
        <Button href="/admin/news/new" variant="primary" colorStyle="dark" size="m">
          Add news
        </Button>
      </div>
      <NewsList />
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}
