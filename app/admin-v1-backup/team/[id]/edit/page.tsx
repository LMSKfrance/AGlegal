import { notFound } from "next/navigation";
import { Button } from "@/design-system";
import { getTeamMemberById } from "@/lib/actions/team";
import { TeamForm } from "../../TeamForm";
import styles from "../../../admin.module.css";

export default async function AdminTeamEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getTeamMemberById(Number(id));
  if (!item) notFound();

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Edit team member</h1>
        <Button href="/admin/team" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <TeamForm item={item} />
    </>
  );
}
