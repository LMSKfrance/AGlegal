import { Button } from "@/design-system";
import { getServicesList } from "@/lib/actions/services";
import { deleteService } from "@/lib/actions/services";
import { DeleteButton } from "../components/DeleteButton";
import styles from "../admin.module.css";

export async function ServicesList() {
  const list = await getServicesList();

  return (
    <div className={styles.tableWrap}>
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ color: "var(--gray-500)" }}>
                No services yet.
              </td>
            </tr>
          ) : (
            list.map((row) => (
              <tr key={row.id}>
                <td>{row.titleEn}</td>
                <td>
                  <div className={styles.tableActions}>
                    <Button href={`/admin/services/${row.id}/edit`} variant="outline" size="s">
                      Edit
                    </Button>
                    <form action={deleteService.bind(null, row.id)} style={{ display: "inline" }}>
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
