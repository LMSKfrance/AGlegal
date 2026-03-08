import { notFound } from "next/navigation";
import { Button } from "@/design-system";
import { getServiceById } from "@/lib/actions/services";
import { ServicesForm } from "../../ServicesForm";
import styles from "../../../admin.module.css";

export default async function AdminServicesEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getServiceById(Number(id));
  if (!item) notFound();

  return (
    <>
      <div className={styles.pageBar}>
        <h1 className={styles.pageTitle}>Edit service</h1>
        <Button href="/admin/services" variant="ghost" size="m">
          ← Back to list
        </Button>
      </div>
      <ServicesForm item={item} />
    </>
  );
}
