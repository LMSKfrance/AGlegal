export default function HomepagePage() {
  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Homepage Manager</h1>
          <p className="text-brand-500 mt-2">Configure sections and layout for the main landing page.</p>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="page-content space-y-6 pb-24 pt-6">
        {/* Hero Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-monitor text-primary-600" /> Hero Section
            </h2>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="card-body space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label-base">Brand Label <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 40)</span></label>
                <input type="text" className="input-base" placeholder="AG Legal" maxLength={40} />
              </div>
              <div>
                <label className="label-base">CTA Button Label <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 24)</span></label>
                <input type="text" className="input-base" placeholder="Get Free Consultation" maxLength={24} />
              </div>
            </div>
            <div>
              <label className="label-base required">Main Title <span className="text-[10px] text-brand-400 font-normal ml-2">(EN required, Max 80)</span></label>
              <textarea className="input-base" rows={2} maxLength={80} placeholder="Leading Corporate Law Firm in Georgia" />
            </div>
            <div>
              <label className="label-base">Description <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 180)</span></label>
              <textarea className="input-base" rows={3} maxLength={180} />
            </div>
            <div>
              <label className="label-base">Hero Background Image</label>
              <div className="file-upload-zone flex flex-col items-center justify-center gap-3 h-40">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-upload-simple text-xl text-brand-500" />
                </div>
                <span className="text-[12px] font-medium text-brand-600">Drop image here or click to browse</span>
                <span className="text-[11px] text-brand-400">Shared between EN/KA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Who We Are */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-users-three text-primary-600" /> Who We Are Section
            </h2>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="card-body space-y-6">
            <div>
              <label className="label-base required">Section Title <span className="text-[10px] text-brand-400 font-normal ml-2">(EN required, Max 60)</span></label>
              <input type="text" className="input-base" maxLength={60} placeholder="Excellence in Legal Practice" />
            </div>
            <div>
              <label className="label-base">Body Text <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 260)</span></label>
              <textarea className="input-base" rows={4} maxLength={260} />
            </div>
            <div>
              <label className="label-base">Background Image (Optional)</label>
              <div className="file-upload-zone p-6 flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <i className="ph ph-upload-simple text-xl text-brand-500" />
                </div>
                <span className="text-[12px] font-medium text-brand-600">Drop image here or click to browse</span>
              </div>
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
          <button className="btn btn-primary">
            <i className="ph ph-floppy-disk" /> Save Homepage
          </button>
        </div>
      </div>
    </>
  );
}
