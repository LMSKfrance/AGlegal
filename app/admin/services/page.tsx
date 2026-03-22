import Link from "next/link";
import { getServicesList, deleteService } from "@/lib/actions/services";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";
import { Pagination } from "@/app/admin/_components/Pagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

export default async function ServicesListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const servicesList = await getServicesList();

  const currentPage = Math.max(1, parseInt(page ?? "1") || 1);
  const totalPages = Math.ceil(servicesList.length / PER_PAGE);
  const paged = servicesList.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Practice Areas</h1>
          <p className="text-brand-500 mt-2">Manage legal services and practice area descriptions.</p>
        </div>
        <Link href="/admin/services/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Add Service
        </Link>
      </div>
      <div className="page-content">
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="hidden sm:table-cell text-center w-24">Homepage</th>
                  <th className="hidden sm:table-cell text-center w-20">Order</th>
                  <th className="text-right w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {servicesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-brand-400 py-12">
                      No services yet. <Link href="/admin/services/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link>
                    </td>
                  </tr>
                ) : (
                  paged.map((service) => (
                    <tr key={service.id}>
                      <td>
                        <div className="font-medium text-brand-900">{service.titleEn}</div>
                        {service.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{service.titleKa}</div>}
                      </td>
                      <td className="hidden sm:table-cell text-center">
                        {service.showOnHome ? (
                          <span className="badge badge-green text-[11px]">Yes</span>
                        ) : (
                          <span className="text-brand-300 text-[12px]">No</span>
                        )}
                      </td>
                      <td className="hidden sm:table-cell text-center text-brand-500 text-[13px]">{service.homeOrder}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/services/${service.id}/edit`} className="btn-icon" title="Edit">
                            <i className="ph ph-pencil text-brand-500" />
                          </Link>
                          <DeleteButton action={deleteService.bind(null, service.id)} label={service.titleEn} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/services" />
        </div>
      </div>
    </>
  );
}
