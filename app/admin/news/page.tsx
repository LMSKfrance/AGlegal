import Link from "next/link";
import { getNewsList, deleteNews } from "@/lib/actions/news";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export default async function NewsListPage() {
  const articles = await getNewsList();

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
          <div className="p-4 border-b border-brand-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between bg-white">
            <select className="input-base h-9 text-[13px] sm:w-48">
              <option>All Types</option>
              <option>In-depth Article</option>
              <option>News Notice</option>
              <option>Press Release</option>
            </select>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <i className="ph ph-magnifying-glass text-brand-400 text-[17px]" />
              </span>
              <input type="text" className="input-base input-with-icon h-9 text-[13px] w-full sm:w-72" placeholder="Search articles..." />
            </div>
          </div>
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
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center text-brand-400 py-12">
                      No articles yet. <Link href="/admin/news/new" className="text-primary-600 font-medium hover:underline">Add the first one →</Link>
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
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
        </div>
      </div>
    </>
  );
}
