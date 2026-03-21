import Link from "next/link";

export default function EditTeamMemberPage({ params }: { params: { id: string } }) {
  return (
    <div className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-8 py-5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/team" className="btn-icon bg-white border border-brand-200 shadow-sm">
            <i className="ph ph-arrow-left" />
          </Link>
          <h1 className="text-xl font-bold text-brand-900">Edit Team Member</h1>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>
      <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <div className="text-center text-brand-400 py-20">
          <i className="ph ph-link text-4xl mb-4 block" />
          <p className="text-[15px] font-medium text-brand-600">Team member editor — data wiring coming soon</p>
          <p className="text-[13px] mt-2">Member #{params.id}</p>
        </div>
      </div>
    </div>
  );
}
