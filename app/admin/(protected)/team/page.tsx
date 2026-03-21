import Link from "next/link";

export default function TeamListPage() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Team Directory</h1>
          <p className="text-brand-500 mt-2">Manage lawyers, partners, and staff profiles.</p>
        </div>
        <Link href="/admin/team/new" className="btn btn-primary">
          <i className="ph ph-plus" /> Add Member
        </Link>
      </div>

      <div className="page-content">
        <div className="card overflow-hidden">
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="w-16" />
                  <th>Name</th>
                  <th>Position</th>
                  <th className="text-center w-24">Homepage</th>
                  <th className="text-center w-20">Order</th>
                  <th className="text-right w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center text-brand-400 py-12">
                    No team members yet. <Link href="/admin/team/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link>
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
