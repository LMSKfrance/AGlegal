import { notFound } from "next/navigation";
import { getPageById, updatePage } from "@/lib/actions/pages";
import PageForm from "../../PageForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPagePage({ params }: Props) {
  const { id } = await params;
  const page = await getPageById(Number(id));
  if (!page) notFound();

  const action = updatePage.bind(null, page.id);
  return <PageForm action={action} page={page} />;
}
