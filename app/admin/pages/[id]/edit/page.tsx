import { notFound } from "next/navigation";
import { Button } from "@/design-system";
import { getPageById } from "@/lib/actions/pages";
import { PagesForm } from "../../PagesForm";
import styles from "../../../admin.module.css";

export default async function AdminPagesEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPageById(Number(id));
  if (!item) notFound();

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Edit page</h1>
        <Button href="/admin/pages" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <PagesForm item={item} />
    </>
  );
}
