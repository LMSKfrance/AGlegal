import { getServiceBySlug } from "@/lib/services";
import ServicePage from "@/screens/Service";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: `${service.title} | AG Legal`,
    description: service.description ?? service.text1?.slice(0, 160),
    openGraph: {
      title: `${service.title} | AG Legal`,
      description: service.description ?? service.text1?.slice(0, 160),
      images: (service.ogImage ?? service.image) ? [{ url: (service.ogImage ?? service.image)!, alt: service.title }] : [],
    },
  };
}

const ServiceDetailPage = async ({ params }: Props) => {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServicePage service={service} />;
};

export default ServiceDetailPage;
