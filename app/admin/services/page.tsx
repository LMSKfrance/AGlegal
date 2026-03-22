import Link from "next/link";
import { getServicesList, upsertServicesPageContent } from "@/lib/actions/services";
import { getPageBySlug } from "@/lib/actions/pages";
import { ServicesListTable } from "./ServicesListTable";
import ServicesLandingForm from "./ServicesLandingForm";

export const dynamic = "force-dynamic";

export default async function ServicesListPage() {
  const [servicesList, landingPage] = await Promise.all([
    getServicesList(),
    getPageBySlug("services"),
  ]);

  return (
    <>
      {/* ─── Page Header ──────────────────────────────────────────── */}
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Services</h1>
        <p className="text-brand-500 mt-2">Manage the services landing page content and individual practice areas.</p>
      </div>

      {/* ─── Landing Page + SEO (client forms) ───────────────────── */}
      <ServicesLandingForm page={landingPage} saveAction={upsertServicesPageContent} />

      {/* ─── Practice Areas List ──────────────────────────────────── */}
      <div className="px-8 pt-7 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest">Practice Areas</h2>
          <Link href="/admin/services/new" className="btn btn-primary">
            <i className="ph ph-plus" /> Add Service
          </Link>
        </div>

        <div className="max-w-5xl ml-0">
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
      </div>
    </>
  );
}
