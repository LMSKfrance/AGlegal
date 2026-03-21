import { notFound } from "next/navigation";
import { getServiceById, updateService } from "@/lib/actions/services";
import ServiceForm from "../../ServiceForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(Number(id));
  if (!service) notFound();

  const action = updateService.bind(null, service.id);
  return <ServiceForm action={action} service={service} />;
}
