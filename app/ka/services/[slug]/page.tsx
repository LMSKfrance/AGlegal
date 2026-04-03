import { getServiceBySlug } from "@/lib/services";
import ServicePage from "@/screens/Service";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

const ServiceDetailKa = async ({ params }: Props) => {
  const { slug } = await params;
  const service = await getServiceBySlug(slug, "ka");

  if (!service) {
    notFound();
  }

  return <ServicePage service={service} />;
};

export default ServiceDetailKa;
