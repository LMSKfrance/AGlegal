import Link from "next/link";
import { getNewsList, deleteNews } from "@/lib/actions/news";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";
import { Pagination } from "@/app/admin/_components/Pagination";
import { NewsFilters } from "./NewsFilters";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

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
          <NewsFilters q={q} type={type} />
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="hidden sm:table-cell w-40">Date Published</th>
                  <th>Title</th>
                  <th className="w-28">Type</th>
                  <th className="w-20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-brand-400 py-12">
                      {q || type ? "No articles match your search." : <>No articles yet. <Link href="/admin/news/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link></>}
                    </td>
                  </tr>
                ) : (
                  paged.map((article) => (
                    <tr key={article.id}>
                      <td className="hidden sm:table-cell text-brand-500 text-[13px]">{formatDate(article.date)}</td>
                      <td>
                        <div className="font-medium text-brand-900">{article.titleEn}</div>
                        {article.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{article.titleKa}</div>}
                        <div className="sm:hidden text-[11px] text-brand-400 mt-1">{formatDate(article.date)}</div>
                      </td>
                      <td>
                        {article.type ? (
                          <span className="badge badge-gray text-[11px]">{article.type}</span>
                        ) : (
                          <span className="text-brand-300">—</span>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/news/${article.id}/edit`} className="btn-icon" title="Edit">
                            <i className="ph ph-pencil text-brand-500" />
                          </Link>
                          <DeleteButton action={deleteNews.bind(null, article.id)} label={article.titleEn} />
                        </div>
                      </td>
                    </tr>
                  ))
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
