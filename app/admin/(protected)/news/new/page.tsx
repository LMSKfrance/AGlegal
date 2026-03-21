import Link from "next/link";

export default function NewArticlePage() {
  return (
    <div className="relative bg-white flex flex-col min-h-full">
      {/* Sticky top bar */}
      <div className="border-b border-brand-200 px-8 py-5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/news" className="btn-icon bg-white border border-brand-200 shadow-sm">
            <i className="ph ph-arrow-left" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-brand-900">New Article</h1>
            <div className="text-[12px] text-brand-500 mt-1">Draft — not published</div>
          </div>
        </div>
        <div className="lang-switcher">
          <div className="lang-tab active">EN</div>
          <div className="lang-tab">KA</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        {/* Title */}
        <div className="space-y-4">
          <div>
            <label className="label-base required text-lg">Article Title</label>
            <input
              type="text"
              className="input-base !text-3xl !font-bold !h-14 !border-0 !border-b-2 !border-brand-200 !rounded-none focus:!border-primary-600 focus:!ring-0 !px-0 bg-transparent"
              placeholder="Enter title..."
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-400">
            <span>Slug:</span>
            <span className="font-mono bg-brand-50 px-2 py-1 rounded border border-brand-200">/news/article-slug</span>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-6 p-6 bg-brand-50 rounded-xl border border-brand-200">
          <div>
            <label className="label-base required">Content Type</label>
            <select className="input-base bg-white">
              <option>News Notice</option>
              <option>In-depth Article</option>
              <option>Blog Post</option>
              <option>Press Release</option>
            </select>
          </div>
          <div>
            <label className="label-base">Tags (comma separated)</label>
            <input type="text" className="input-base bg-white" placeholder="e.g. Taxation, Corporate" />
          </div>
          <div>
            <label className="label-base required">Publication Date</label>
            <input type="date" className="input-base bg-white" required />
          </div>
          <div>
            <label className="label-base">Publication Time</label>
            <input type="time" className="input-base bg-white" placeholder="09:00" />
          </div>
        </div>

        {/* Featured image */}
        <div>
          <label className="label-base">Featured Image</label>
          <div className="file-upload-zone flex flex-col items-center gap-3 h-40 justify-center">
            <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
              <i className="ph ph-upload-simple text-xl text-brand-500" />
            </div>
            <span className="text-[12px] font-medium text-brand-600">Drop image here or click to browse</span>
            <span className="text-[11px] text-brand-400">JPG, PNG · Max 5MB</span>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label className="label-base">Short Description / Excerpt</label>
          <textarea className="input-base" rows={3} placeholder="Brief summary shown in article listings..." />
        </div>

        {/* Content editor */}
        <div className="md-editor-wrap">
          <div className="md-toolbar">
            <button title="Bold"><i className="ph ph-text-b" /></button>
            <button title="Italic"><i className="ph ph-text-italic" /></button>
            <div className="w-px h-5 bg-brand-200 mx-2" />
            <button title="Heading 2"><i className="ph ph-text-h-two" /></button>
            <button title="Heading 3"><i className="ph ph-text-h-three" /></button>
            <div className="w-px h-5 bg-brand-200 mx-2" />
            <button title="Link"><i className="ph ph-link" /></button>
            <button title="Image"><i className="ph ph-image" /></button>
            <button title="List"><i className="ph ph-list-bullets" /></button>
            <button title="Quote"><i className="ph ph-quotes" /></button>
            <div className="flex-1" />
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider px-2">Markdown Supported</span>
          </div>
          <textarea
            className="input-base w-full p-6 font-mono text-[14px] leading-relaxed bg-[#fbfcfd]"
            placeholder="Start writing content here..."
            rows={10}
          />
        </div>
      </div>

      {/* Action bar */}
      <div className="action-bar">
        <div className="flex gap-2">
          <span className="badge badge-gray">Draft</span>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/news" className="btn btn-secondary">Cancel</Link>
          <button className="btn btn-primary">
            <i className="ph ph-paper-plane-tilt" /> Publish Article
          </button>
        </div>
      </div>
    </div>
  );
}
