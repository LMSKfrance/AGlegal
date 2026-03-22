import { getSaveHistory } from "@/lib/actions/history";
import { Pagination } from "@/app/admin/_components/Pagination";
import { HistoryList } from "./HistoryList";

export const dynamic = "force-dynamic";

const PER_PAGE = 8;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function groupByDate(entries: Awaited<ReturnType<typeof getSaveHistory>>) {
  const groups: Record<string, typeof entries> = {};
  const today = new Date().toDateString();
  for (const e of entries) {
    const d = new Date(e.savedAt);
    const key = d.toDateString() === today ? "Today" : formatDate(e.savedAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }
  return groups;
}


export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const entries = await getSaveHistory(30);

  const currentPage = Math.max(1, parseInt(page ?? "1") || 1);
  const totalPages = Math.ceil(entries.length / PER_PAGE);
  const paged = entries.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
  const groups = groupByDate(paged);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">History Log</h1>
          <p className="text-brand-500 mt-2">
            Last {entries.length} actions · {entries.length === 30 ? "older entries are auto-removed" : "auto-trims at 30 entries"}.
          </p>
        </div>
      </div>

      <div className="page-content max-w-3xl ml-0">
        {entries.length === 0 ? (
          <div className="text-center text-brand-400 py-20">No history yet.</div>
        ) : (
          <>
            <HistoryList groups={groups} />

            {totalPages > 1 && (
              <div className="mt-8 card overflow-hidden">
                <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/admin/history" />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
