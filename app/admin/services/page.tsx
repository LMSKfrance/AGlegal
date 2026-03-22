import Link from "next/link";
import { getServicesList } from "@/lib/actions/services";
import { ServicesListTable } from "./ServicesListTable";

export const dynamic = "force-dynamic";

export default async function ServicesListPage() {
  const servicesList = await getServicesList();

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Practice Areas</h1>
          <p className="text-brand-500 mt-2">Drag <i className="ph ph-dots-six-vertical" /> to reorder. Click a title to edit.</p>
        </div>
        <Link href="/admin/services/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Add Service
        </Link>
      </div>

      <div className="page-content">
        <div className="card overflow-hidden">
          {servicesList.length === 0 ? (
            <div className="text-center text-brand-400 py-12">
              No services yet.{" "}
              <Link href="/admin/services/new" className="text-primary-600 font-medium hover:underline">
                Add the first one →
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <ServicesListTable initialServices={servicesList} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
