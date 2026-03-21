export default function ContactPage() {
  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Contact Information</h1>
          <p className="text-brand-500 mt-2">Global contact details and social media links.</p>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="page-content space-y-6 pb-40 max-w-4xl mx-auto ml-0 pt-6">
        <div className="card">
          <div className="card-body space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div><label className="label-base">Page Title</label><input type="text" className="input-base" placeholder="Get in Touch" /></div>
              <div><label className="label-base">Subtitle</label><textarea className="input-base !h-[38px] !min-h-0 py-2" rows={1} placeholder="Our team is ready to assist you." /></div>
            </div>

            <hr className="border-brand-200" />

            <div className="grid grid-cols-2 gap-8">
              <div><label className="label-base">Primary Email</label><input type="email" className="input-base" placeholder="info@aglegal.com" /></div>
              <div>
                <label className="label-base">Address</label>
                <textarea className="input-base" rows={3} placeholder={"12 Rustaveli Avenue, Floor 4\nTbilisi 0108, Georgia"} />
              </div>
              <div><label className="label-base">Primary Phone</label><input type="text" className="input-base" placeholder="+995 32 2 123 456" /></div>
              <div><label className="label-base">Secondary Phone</label><input type="text" className="input-base" /></div>
            </div>

            <hr className="border-brand-200" />
            <h3 className="font-semibold text-brand-900 text-[15px]">Social Media URLs</h3>
            <div className="grid grid-cols-2 gap-6">
              <div><label className="label-base">LinkedIn URL</label><input type="text" className="input-base" placeholder="https://linkedin.com/company/..." /></div>
              <div><label className="label-base">Facebook URL</label><input type="text" className="input-base" placeholder="https://facebook.com/..." /></div>
              <div><label className="label-base">X (Twitter) URL</label><input type="text" className="input-base" /></div>
              <div><label className="label-base">Instagram URL</label><input type="text" className="input-base" /></div>
            </div>

            <hr className="border-brand-200" />
            <div>
              <label className="label-base">Google Maps Embed Code (iframe src URL)</label>
              <textarea className="input-base font-mono text-[13px] bg-[#fbfcfd]" rows={3} placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
          </div>
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
          <button className="btn btn-primary"><i className="ph ph-floppy-disk" /> Save Contact Info</button>
        </div>
      </div>
    </>
  );
}
