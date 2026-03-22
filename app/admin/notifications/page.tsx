import Link from "next/link";

export default function NotificationsPage() {
  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Tasks &amp; Notifications</h1>
      </div>

      <div className="page-content pt-6">
        <div className="card mb-6">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-warning-circle text-[#B44F00]" /> Pending Tasks
              <span className="ml-2 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-[#FFF8D6] text-[#B44F00]">4 items</span>
            </h2>
          </div>
          <div className="divide-y divide-brand-100">

            {/* SAP Fiori Warning — Missing translation */}
            <div className="flex items-start gap-4 p-5 hover:bg-brand-50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#FFF8D6] text-[#B44F00] flex items-center justify-center shrink-0">
                <i className="ph ph-translate text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[14px] font-bold text-brand-900">Missing Georgian Translation</span>
                  <span className="badge badge-amber">Translation</span>
                </div>
                <p className="text-[13px] text-brand-600 mb-2.5">A news article is missing Georgian (KA) translation.</p>
                <Link href="/admin/news" className="text-[13px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1.5">
                  <i className="ph ph-arrow-right" /> Go to News
                </Link>
              </div>
              <button className="btn-icon opacity-0 group-hover:opacity-100 text-brand-400 hover:text-brand-600">
                <i className="ph ph-check-circle text-xl" />
              </button>
            </div>

            {/* SAP Fiori Critical — Missing photo */}
            <div className="flex items-start gap-4 p-5 hover:bg-brand-50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-[#FFEBEB] text-[#AB0000] flex items-center justify-center shrink-0">
                <i className="ph ph-image text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[14px] font-bold text-brand-900">Missing Profile Photo</span>
                  <span className="badge badge-red">Photo Required</span>
                </div>
                <p className="text-[13px] text-brand-600 mb-2.5">A team member has no profile photo uploaded.</p>
                <Link href="/admin/team" className="text-[13px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1.5">
                  <i className="ph ph-arrow-right" /> Go to Team
                </Link>
              </div>
              <button className="btn-icon opacity-0 group-hover:opacity-100 text-brand-400 hover:text-brand-600">
                <i className="ph ph-check-circle text-xl" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
