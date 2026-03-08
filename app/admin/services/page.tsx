import { Suspense } from "react";
import { Button } from "@/design-system";
import { ServicesList } from "./ServicesList";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";

export default function AdminServicesPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Services</h1>
        <Button href="/admin/services/new" variant="primary" colorStyle="dark" size="m">
          Add service
        </Button>
      </div>
      <ServicesList />
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}
