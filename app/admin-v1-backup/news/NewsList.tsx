import { Button } from "@/design-system";
import { getNewsList } from "@/lib/actions/news";
import { deleteNews } from "@/lib/actions/news";
import styles from "../admin.module.css";
import { DeleteButton } from "../components/DeleteButton";

export async function NewsList() {
  const list = await getNewsList();

  return (
    <div className={styles.tableWrap}>
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ color: "var(--gray-500)" }}>
                No news yet. Add one to get started.
              </td>
            </tr>
          ) : (
            list.map((row) => (
              <tr key={row.id}>
                <td>{row.titleEn}</td>
                <td>{row.date}</td>
                <td>{row.type ?? "—"}</td>
                <td>
                  <div className={styles.tableActions}>
                    <Button href={`/admin/news/${row.id}/edit`} variant="outline" size="s">
                      Edit
                    </Button>
                    <form action={deleteNews.bind(null, row.id)} style={{ display: "inline" }}>
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
