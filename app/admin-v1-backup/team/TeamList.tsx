import { Button } from "@/design-system";
import { getTeamList } from "@/lib/actions/team";
import { deleteTeamMember } from "@/lib/actions/team";
import { DeleteButton } from "../components/DeleteButton";
import styles from "../admin.module.css";

export async function TeamList() {
  const list = await getTeamList();

  return (
    <div className={styles.tableWrap}>
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ color: "var(--gray-500)" }}>
                No team members yet.
              </td>
            </tr>
          ) : (
            list.map((row) => (
              <tr key={row.id}>
                <td>{row.titleEn}</td>
                <td>{row.positionEn ?? "—"}</td>
                <td>
                  <div className={styles.tableActions}>
                    <Button href={`/admin/team/${row.id}/edit`} variant="outline" size="s">
                      Edit
                    </Button>
                    <form action={deleteTeamMember.bind(null, row.id)} style={{ display: "inline" }}>
                      <DeleteButton label="Delete" />
                    </form>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
