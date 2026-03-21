import Link from "next/link";
import { getPagesList, deletePage } from "@/lib/actions/pages";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function PagesListPage() {
  const pagesList = await getPagesList();

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
                {pagesList.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-brand-400 py-12">
                      No pages yet. <Link href="/admin/pages/new" className="text-primary-600 font-medium hover:underline">Create the first one →</Link>
                    </td>
                  </tr>
                ) : (
                  pagesList.map((page) => (
                    <tr key={page.id}>
                      <td>
                        <div className="font-medium text-brand-900">{page.titleEn}</div>
                        {page.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{page.titleKa}</div>}
                      </td>
                      <td>
                        <a
                          href={`/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[13px] text-primary-600 hover:underline flex items-center gap-1"
                        >
                          /{page.slug} <i className="ph ph-arrow-square-out text-[11px]" />
                        </a>
                      </td>
                      <td className="text-brand-500 text-[13px]">{formatDate(page.updatedAt)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/pages/${page.id}/edit`} className="btn-icon" title="Edit">
                            <i className="ph ph-pencil text-brand-500" />
                          </Link>
                          <DeleteButton action={deletePage.bind(null, page.id)} label={page.titleEn} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
