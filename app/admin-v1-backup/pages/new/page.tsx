import { Button } from "@/design-system";
import { PagesForm } from "../PagesForm";
import styles from "../../admin.module.css";

export default function AdminPagesNewPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Add page</h1>
        <Button href="/admin/pages" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <PagesForm />
    </>
  );
}
