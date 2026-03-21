import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">About Firm Settings</h1>
          <p className="text-brand-500 mt-2">Manage content for the About Us page sections.</p>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="page-content space-y-6 pb-40 max-w-4xl mx-auto ml-0 pt-6">
        {/* Hero content note */}
        <div className="card p-6 flex justify-between items-center bg-brand-50 border border-brand-200">
          <div>
            <div className="font-semibold text-[14px] text-brand-900">Hero Content is managed in Pages</div>
            <div className="text-[13px] text-brand-500 mt-1">Edit the main intro text via Pages &gt; About Us.</div>
          </div>
          <div className="flex items-center gap-4">
            <label className="toggle-switch scale-75">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
            <Link href="/admin/pages" className="btn btn-secondary h-9 px-4 text-[13px]">Go to Pages</Link>
          </div>
        </div>

        {/* Key Numbers */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 text-[15px]">Key Numbers Section</h2>
            <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
          </div>
          <div className="card-body space-y-5">
            <div><label className="label-base">Section Title</label><input type="text" className="input-base" placeholder="Our Impact in Numbers" /></div>
            <div><label className="label-base">Section Description</label><textarea className="input-base" rows={2} /></div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 text-[15px]">Our Mission Section</h2>
            <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
          </div>
          <div className="card-body space-y-5">
            <div><label className="label-base">Title</label><input type="text" className="input-base" placeholder="Driven by Excellence" /></div>
            <div><label className="label-base">Description</label><textarea className="input-base" rows={2} /></div>
          </div>
        </div>

        {/* Core Features */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 text-[15px]">Core Features Section</h2>
            <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
          </div>
          <div className="card-body">
            <div><label className="label-base">Title</label><input type="text" className="input-base" placeholder="What Sets Us Apart" /></div>
          </div>
        </div>

        {/* Our Philosophy */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 text-[15px]">Our Philosophy Section</h2>
            <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
          </div>
          <div className="card-body space-y-5">
            <div><label className="label-base">Title</label><input type="text" className="input-base" placeholder="A Client-First Approach" /></div>
            <div><label className="label-base">Description</label><textarea className="input-base" rows={2} /></div>
          </div>
        </div>

        {/* FAQ Visibility */}
        <div className="card p-6 flex justify-between items-center">
          <div className="font-semibold text-[15px] text-brand-900">FAQ Section Visibility</div>
          <label className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></label>
        </div>
      </div>

      <div className="action-bar">
        <div className="text-[12px] text-brand-500 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="bg-brand-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-brand-700">⌘S</kbd> Save
          </span>
        </div>
        <div className="flex gap-3">
          <button className="btn btn-secondary">Discard Changes</button>
          <button className="btn btn-primary"><i className="ph ph-floppy-disk" /> Save About Settings</button>
        </div>
      </div>
    </>
  );
}
