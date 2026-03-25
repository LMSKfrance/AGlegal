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
    <div className="page-content space-y-6 pb-8 pt-6">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="pb-6 pt-8 border-b border-brand-200">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Services</h1>
        <p className="text-brand-500 mt-2">Manage the services landing page content and individual practice areas.</p>
      </div>

      {/* ── Landing Page Content card ─────────────────────────────── */}
      <ServicesLandingForm page={landingPage} saveAction={upsertServicesPageContent} section="content" />

      {/* ── Practice Areas ───────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="card-header">
          <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
            <i className="ph ph-briefcase text-primary-600" /> Practice Areas
          </h2>
          <Link href="/admin/services/new" className="btn btn-primary">
            <i className="ph ph-plus" /> Add Service
          </Link>
        </div>
        <div className="card-body p-0">
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

      {/* ── SEO & Open Graph card (last) ─────────────────────────── */}
      <ServicesLandingForm page={landingPage} saveAction={upsertServicesPageContent} section="seo" />

    </div>
  );
}
