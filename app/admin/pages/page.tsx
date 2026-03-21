import Link from "next/link";

export default function PagesListPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Static Pages</h1>
          <p className="text-brand-500 mt-2">Manage content for standalone pages.</p>
        </div>
        <Link href="/admin/pages/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Create Page
        </Link>
      </div>
      <div className="page-content">
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-1/3">Page Title</th>
                  <th className="w-1/3">URL Slug</th>
                  <th className="w-1/4">Last Modified</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center text-brand-400 py-12">
                    No pages yet. <Link href="/admin/pages/new" className="text-primary-600 font-medium hover:underline">Create the first one →</Link>
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
