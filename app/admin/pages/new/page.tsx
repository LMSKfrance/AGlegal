import { createPage } from "@/lib/actions/pages";
import PageForm from "../PageForm";

export default function NewPagePage() {
  return <PageForm action={createPage} />;
}
