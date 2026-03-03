import { Suspense } from "react";
import { Button } from "@/design-system";
import { TeamList } from "./TeamList";
import { AdminToast } from "../components/AdminToast";
import styles from "../admin.module.css";

export default function AdminTeamPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Team</h1>
        <Button href="/admin/team/new" variant="primary" colorStyle="dark" size="m">
          Add member
        </Button>
      </div>
      <TeamList />
      <Suspense fallback={null}>
        <AdminToast />
      </Suspense>
    </>
  );
}
