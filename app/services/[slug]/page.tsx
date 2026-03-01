import mock from "@/constants/mock";
import ServicePage from "@/screens/Service";

const Service = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const service = mock.services.find((service) => service.slug === slug);

  console.log("Service:", service);

  if (!service) {
    return null;
  }

  return <ServicePage service={service} />;
};

export default Service;
