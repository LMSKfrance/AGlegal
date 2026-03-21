import Link from "next/link";

export default function NewsListPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">News &amp; Insights</h1>
          <p className="text-brand-500 mt-2">Manage articles, press releases, and legal insights.</p>
        </div>
        <Link href="/admin/news/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Add New Article
        </Link>
      </div>

      <div className="page-content">
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-brand-200 flex justify-between items-center bg-white">
            <div className="flex gap-2">
              <select className="input-base w-48 h-9 text-[13px]">
                <option>All Types</option>
                <option>In-depth Article</option>
                <option>News Notice</option>
                <option>Press Release</option>
              </select>
            </div>
            <div className="relative w-72">
              <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 text-lg" />
              <input type="text" className="input-base pl-10 h-9 text-[13px]" placeholder="Search articles..." />
            </div>
          </div>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-48">Date Published</th>
                  <th>Title</th>
                  <th className="w-32">Type</th>
                  <th className="w-24 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center text-brand-400 py-12">
                    No articles yet. <Link href="/admin/news/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
