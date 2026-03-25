"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { deleteNews, toggleArticlePublished } from "@/lib/actions/news";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

type Article = {
  id: number;
  titleEn: string;
  titleKa: string | null;
  date: string;
  type: string | null;
  published: number | null;
};

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function NewsListTable({ articles }: { articles: Article[] }) {
  const [list, setList] = useState(articles);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [, startTransition] = useTransition();

  function handleToggle(article: Article) {
    const newVal = article.published ? 0 : 1;
    setTogglingId(article.id);
    setList((prev) => prev.map((a) => a.id === article.id ? { ...a, published: newVal } : a));
    startTransition(async () => {
      await toggleArticlePublished(article.id, newVal);
      setTogglingId(null);
    });
  }

  if (list.length === 0) {
    return (
      <tr>
        <td colSpan={5} className="text-center text-brand-400 py-12">
          No articles match your search.
        </td>
      </tr>
    );
  }

  return (
    <>
      {list.map((article) => (
        <tr key={article.id}>
          <td className="hidden sm:table-cell text-brand-500 text-[13px]">{formatDate(article.date)}</td>
          <td>
            <Link href={`/admin/news/${article.id}/edit`} className="font-medium text-brand-900 hover:text-primary-600 transition-colors">
              {article.titleEn}
            </Link>
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
          <td className="hidden sm:table-cell text-center">
            <button
              type="button"
              onClick={() => handleToggle(article)}
              disabled={togglingId === article.id}
              title={article.published ? "Unpublish" : "Publish"}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors border ${
                article.published
                  ? "bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  : "bg-brand-100 text-brand-400 border-brand-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200"
              }`}
            >
              {togglingId === article.id
                ? <i className="ph ph-spinner animate-spin" />
                : article.published
                  ? <><i className="ph ph-eye" /> Published</>
                  : <><i className="ph ph-eye-slash" /> Draft</>
              }
            </button>
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
      ))}
    </>
  );
}
