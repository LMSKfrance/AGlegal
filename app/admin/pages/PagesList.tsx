import { Button } from "@/design-system";
import { getPagesList } from "@/lib/actions/pages";
import { deletePage } from "@/lib/actions/pages";
import { DeleteButton } from "../components/DeleteButton";
import styles from "../admin.module.css";

export async function PagesList() {
  const list = await getPagesList();

  return (
    <div className={styles.tableWrap}>
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Slug</th>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ color: "var(--gray-500)" }}>
                No pages yet.
              </td>
            </tr>
          ) : (
            list.map((row) => (
              <tr key={row.id}>
                <td><code>{row.slug}</code></td>
                <td>{row.titleEn}</td>
                <td>
                  <div className={styles.tableActions}>
                    <Button href={`/admin/pages/${row.id}/edit`} variant="outline" size="s">
                      Edit
                    </Button>
                    <form action={deletePage.bind(null, row.id)} style={{ display: "inline" }}>
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
