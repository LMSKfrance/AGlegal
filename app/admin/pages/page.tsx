import Link from "next/link";
import { getPagesList, deletePage } from "@/lib/actions/pages";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";
import { Pagination } from "@/app/admin/_components/Pagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

export default async function PagesListPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const pagesList = await getPagesList();

  const currentPage = Math.max(1, parseInt(page ?? "1") || 1);
  const totalPages = Math.ceil(pagesList.length / PER_PAGE);
  const paged = pagesList.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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
                  <th className="hidden sm:table-cell">Page Title</th>
                  <th>URL Slug</th>
                  <th className="hidden sm:table-cell">Last Modified</th>
                  <th className="text-right w-20">Actions</th>
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
                  paged.map((p) => (
                    <tr key={p.id}>
                      <td className="hidden sm:table-cell">
                        <Link href={`/admin/pages/${p.id}/edit`} className="font-medium text-brand-900 hover:text-primary-600 transition-colors">
                          {p.titleEn}
                        </Link>
                        {p.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{p.titleKa}</div>}
                      </td>
                      <td>
                        <a
                          href={`/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[13px] text-primary-600 hover:underline flex items-center gap-1"
                        >
                          /{p.slug} <i className="ph ph-arrow-square-out text-[11px]" />
                        </a>
                      </td>
                      <td className="hidden sm:table-cell text-brand-500 text-[13px]">{formatDate(p.updatedAt)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/pages/${p.id}/edit`} className="btn-icon" title="Edit">
                            <i className="ph ph-pencil text-brand-500" />
                          </Link>
                          <DeleteButton action={deletePage.bind(null, p.id)} label={p.titleEn} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/pages" />
        </div>
      </div>
    </>
  );
}
