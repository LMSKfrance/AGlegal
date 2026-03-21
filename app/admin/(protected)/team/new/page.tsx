import Link from "next/link";

export default function NewTeamMemberPage() {
  return (
    <div className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-8 py-5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/team" className="btn-icon bg-white border border-brand-200 shadow-sm">
            <i className="ph ph-arrow-left" />
          </Link>
          <h1 className="text-xl font-bold text-brand-900">Add Team Member</h1>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        <div className="flex gap-8 items-start">
          <div className="w-48 shrink-0">
            <label className="label-base">Profile Photo</label>
            <div className="file-upload-zone w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-3">
              <i className="ph ph-camera text-3xl text-brand-400" />
              <span className="text-[12px] font-medium text-brand-600">Upload Photo</span>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label-base required">Name</label>
                <input type="text" className="input-base" placeholder="Full name" />
              </div>
              <div>
                <label className="label-base">Position</label>
                <input type="text" className="input-base" placeholder="e.g. Managing Partner" />
              </div>
            </div>
            <div className="flex items-center gap-6 p-5 bg-brand-50 rounded-xl border border-brand-200">
              <div className="flex items-center justify-between w-56">
                <span className="text-[14px] font-semibold text-brand-900">Show on Homepage</span>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="flex-1 border-l border-brand-200 pl-6 flex items-center gap-4">
                <label className="label-base !mb-0">Display Order</label>
                <input type="number" className="input-base w-24" defaultValue={1} min={0} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-brand-200 pt-8">
          <div>
            <label className="label-base">Description (Short bio)</label>
            <textarea className="input-base" rows={3} placeholder="Brief professional summary..." />
          </div>
          <div>
            <label className="label-base">Personal Quote</label>
            <textarea className="input-base italic" rows={2} placeholder='"Quote..."' />
          </div>
          <div>
            <label className="label-base">Detailed Bio (Text 1)</label>
            <textarea className="input-base min-h-[150px]" placeholder="Extended biography..." />
          </div>
          <div>
            <label className="label-base">Additional Info (Text 2)</label>
            <textarea className="input-base min-h-[100px]" placeholder="Education, admissions..." />
          </div>
        </div>

        <div className="space-y-5 border-t border-brand-200 pt-8 bg-brand-50 -mx-8 px-8 py-8 rounded-b-xl">
          <h3 className="font-semibold text-brand-900 text-[15px]">Social Profiles</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="label-base">Social Platforms</label>
              <textarea className="input-base font-mono text-xs leading-relaxed bg-white" rows={4} placeholder={"LinkedIn\nTwitter\nEmail"} />
            </div>
            <div>
              <label className="label-base">Social URLs</label>
              <textarea className="input-base font-mono text-xs leading-relaxed bg-white" rows={4} placeholder={"https://...\nhttps://...\nmailto:..."} />
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div />
        <div className="flex gap-3">
          <Link href="/admin/team" className="btn btn-secondary">Cancel</Link>
          <button className="btn btn-primary">
            <i className="ph ph-floppy-disk" /> Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
