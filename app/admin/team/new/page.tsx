import { Button } from "@/design-system";
import { TeamForm } from "../TeamForm";
import styles from "../../admin.module.css";

export default function AdminTeamNewPage() {
  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Add team member</h1>
        <Button href="/admin/team" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <TeamForm />
    </>
  );
}
