import { Button } from "@/design-system";
import { NewsForm } from "../NewsForm";
import styles from "../../admin.module.css";

export default function AdminNewsNewPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Add news</h1>
        <Button href="/admin/news" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <NewsForm />
    </>
  );
}
