import Link from "next/link";
import { Suspense } from "react";
import { getNewsList } from "@/lib/actions/news";
import { Pagination } from "@/app/admin/_components/Pagination";
import { NewsFilters } from "./NewsFilters";
import { NewsListTable } from "./NewsListTable";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

export default async function NewsListPage({ searchParams }: { searchParams: Promise<{ page?: string; q?: string; type?: string }> }) {
  const { page, q = "", type = "" } = await searchParams;
  const allArticles = await getNewsList();

  const filtered = allArticles.filter((a) => {
    const matchesQ = !q || a.titleEn?.toLowerCase().includes(q.toLowerCase()) || a.titleKa?.toLowerCase().includes(q.toLowerCase());
    const matchesType = !type || a.type === type;
    return matchesQ && matchesType;
  });

  const currentPage = Math.max(1, parseInt(page ?? "1") || 1);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

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
          <Suspense fallback={<div className="p-4 border-b border-brand-200 h-[61px]" />}>
            <NewsFilters q={q} type={type} />
          </Suspense>
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="hidden sm:table-cell w-40">Date Published</th>
                  <th>Title</th>
                  <th className="w-28">Type</th>
                  <th className="hidden sm:table-cell text-center w-28">Published</th>
                  <th className="w-20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 && !q && !type ? (
                  <tr>
                    <td colSpan={5} className="text-center text-brand-400 py-12">
                      No articles yet. <Link href="/admin/news/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link>
                    </td>
                  </tr>
                ) : (
                  <NewsListTable articles={paged} />
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/news" />
        </div>
      </div>
    </>
  );
}
