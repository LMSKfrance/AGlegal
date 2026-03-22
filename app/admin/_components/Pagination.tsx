import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null;

  function href(p: number) {
    return `${basePath}?page=${p}`;
  }

  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-brand-100">
      <Link
        href={href(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`btn-icon text-brand-500 ${currentPage === 1 ? "opacity-30 pointer-events-none" : ""}`}
        aria-label="Previous page"
      >
        <i className="ph ph-caret-left text-[15px]" />
      </Link>

      {start > 1 && (
        <>
          <Link href={href(1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium text-brand-600 hover:bg-brand-50 transition-colors">1</Link>
          {start > 2 && <span className="text-brand-300 text-[13px] px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <Link
          key={p}
          href={href(p)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium transition-colors
            ${p === currentPage ? "bg-primary-600 text-white" : "text-brand-600 hover:bg-brand-50"}`}
        >
          {p}
        </Link>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-brand-300 text-[13px] px-1">…</span>}
          <Link href={href(totalPages)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium text-brand-600 hover:bg-brand-50 transition-colors">{totalPages}</Link>
        </>
      )}

      <Link
        href={href(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`btn-icon text-brand-500 ${currentPage === totalPages ? "opacity-30 pointer-events-none" : ""}`}
        aria-label="Next page"
      >
        <i className="ph ph-caret-right text-[15px]" />
      </Link>
    </div>
  );
}
