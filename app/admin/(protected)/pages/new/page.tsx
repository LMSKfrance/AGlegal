import Link from "next/link";

export default function NewPagePage() {
  return (
    <div className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-8 py-5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="btn-icon bg-white border border-brand-200 shadow-sm">
            <i className="ph ph-arrow-left" />
          </Link>
          <h1 className="text-xl font-bold text-brand-900">Create Page</h1>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="label-base required">Page Title</label>
            <input type="text" className="input-base" placeholder="e.g. Privacy Policy" />
          </div>
          <div>
            <label className="label-base required">URL Slug</label>
            <div className="flex items-center">
              <span className="px-4 bg-brand-50 border border-r-0 border-brand-200 rounded-l-lg h-[38px] flex items-center text-brand-500 font-mono text-[13px]">/</span>
              <input type="text" className="input-base !rounded-l-none" placeholder="privacy-policy" />
            </div>
          </div>
        </div>

        <div className="md-editor-wrap">
          <div className="md-toolbar">
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider px-2">Page Content (Markdown)</span>
          </div>
          <textarea
            className="input-base w-full p-6 font-mono text-[14px] leading-relaxed min-h-[300px] bg-[#fbfcfd]"
            rows={12}
            placeholder={"# Page Title\n\nContent goes here..."}
          />
        </div>

        <div className="card">
          <div className="card-header py-4 bg-brand-50">
            <h3 className="font-semibold text-brand-900 text-[14px]">
              <i className="ph ph-magnifying-glass mr-2 text-brand-500" /> SEO &amp; Open Graph Data
            </h3>
          </div>
          <div className="card-body space-y-5">
            <div className="grid grid-cols-2 gap-6">
              <div><label className="label-base">SEO Title</label><input type="text" className="input-base" /></div>
              <div><label className="label-base">OG Title</label><input type="text" className="input-base" /></div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="label-base">Meta Description</label><textarea className="input-base" rows={2} /></div>
              <div><label className="label-base">OG Description</label><textarea className="input-base" rows={2} /></div>
            </div>
            <div>
              <label className="label-base">OG Image URL <span className="text-xs font-normal text-brand-400 ml-2">(Recommended 1200×630)</span></label>
              <input type="text" className="input-base" placeholder="/uploads/og-image.jpg" />
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="flex gap-3 w-full justify-end">
          <Link href="/admin/pages" className="btn btn-secondary">Cancel</Link>
          <button className="btn btn-primary">
            <i className="ph ph-globe" /> Publish Page
          </button>
        </div>
      </div>
    </div>
  );
}
