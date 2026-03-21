import { Button } from "@/design-system";
import { ServicesForm } from "../ServicesForm";
import styles from "../../admin.module.css";

export default function AdminServicesNewPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Add service</h1>
        <Button href="/admin/services" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <ServicesForm />
    </>
  );
}
