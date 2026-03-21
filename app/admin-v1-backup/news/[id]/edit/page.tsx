import { notFound } from "next/navigation";
import { Button } from "@/design-system";
import { getNewsById } from "@/lib/actions/news";
import { NewsForm } from "../../NewsForm";
import styles from "../../../admin.module.css";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getNewsById(Number(id));
  if (!item) notFound();

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Edit news</h1>
        <Button href="/admin/news" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <NewsForm item={item} />
    </>
  );
}
