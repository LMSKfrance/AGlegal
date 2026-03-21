import Link from "next/link";

export default function NewServicePage() {
  return (
    <div className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-8 py-5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="btn-icon bg-white border border-brand-200 shadow-sm">
            <i className="ph ph-arrow-left" />
          </Link>
          <h1 className="text-xl font-bold text-brand-900">New Service</h1>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        <div className="card p-6 bg-brand-50 border border-brand-200 flex flex-wrap items-center gap-8 rounded-xl">
          <div className="flex items-center justify-between w-56">
            <span className="text-[14px] font-semibold text-brand-900">Show on Homepage</span>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="w-px h-8 bg-brand-200" />
          <div className="flex items-center gap-4">
            <label className="label-base !mb-0">Homepage Order</label>
            <input type="number" className="input-base w-24 bg-white" defaultValue={1} />
          </div>
          <div className="w-px h-8 bg-brand-200" />
          <div className="flex items-center gap-4 flex-1">
            <label className="label-base !mb-0 whitespace-nowrap">Learn More URL</label>
            <input type="text" className="input-base bg-white" placeholder="/services/corporate" />
          </div>
        </div>

        <div>
          <label className="label-base required">Service Title</label>
          <input
            type="text"
            className="input-base !text-3xl !font-bold !h-14 !border-0 !border-b-2 !border-brand-200 !rounded-none focus:!border-primary-600 focus:!ring-0 !px-0 bg-transparent"
            placeholder="Service title..."
          />
        </div>

        <div className="grid grid-cols-3 gap-8">
          {["Main Cover Image", "Thumbnail Image", "Home Card Image"].map((label) => (
            <div key={label}>
              <label className="label-base">{label}</label>
              <div className="file-upload-zone p-4 flex flex-col items-center gap-2 h-32 justify-center">
                <i className="ph ph-upload-simple text-xl text-brand-500" />
                <span className="text-[11px] font-medium text-brand-600 text-center">Upload image</span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="label-base">Homepage Short Description</label>
          <textarea className="input-base" rows={2} placeholder="Brief summary for homepage card..." />
        </div>

        <div className="border-t border-brand-200 pt-8 space-y-6">
          <div>
            <label className="label-base">Full Description</label>
            <textarea className="input-base" rows={3} />
          </div>
          <div>
            <label className="label-base">Text Section 1</label>
            <textarea className="input-base" rows={3} />
          </div>
          <div>
            <label className="label-base">Text Section 2</label>
            <textarea className="input-base" rows={3} />
          </div>
          <div>
            <label className="label-base">Highlight Quote</label>
            <textarea className="input-base italic" rows={2} />
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="flex gap-3 w-full justify-end">
          <Link href="/admin/services" className="btn btn-secondary">Cancel</Link>
          <button className="btn btn-primary">
            <i className="ph ph-floppy-disk" /> Save Service
          </button>
        </div>
      </div>
    </div>
  );
}
