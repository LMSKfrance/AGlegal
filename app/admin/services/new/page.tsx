import { createService } from "@/lib/actions/services";
import ServiceForm from "../ServiceForm";

export default function NewServicePage() {
  return <ServiceForm action={createService} />;
}
