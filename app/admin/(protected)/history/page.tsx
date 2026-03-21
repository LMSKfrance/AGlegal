import { getSaveHistory } from "@/lib/actions/history";

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

const ACTION_COLOR: Record<string, string> = {
  created: "bg-green-500",
  updated: "bg-blue-500",
  deleted: "bg-red-500",
};
const ACTION_BADGE: Record<string, string> = {
  created: "badge-green",
  updated: "badge-blue",
  deleted: "badge-red",
};

export default async function HistoryPage() {
  const entries = await getSaveHistory(100);
  const groups = groupByDate(entries);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">History Log</h1>
          <p className="text-brand-500 mt-2">Audit trail of all system actions.</p>
        </div>
      </div>

      <div className="page-content max-w-3xl ml-0">
        {Object.keys(groups).length === 0 ? (
          <div className="text-center text-brand-400 py-20">No history yet.</div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groups).map(([date, items]) => (
              <div key={date}>
                <div className="sticky top-0 bg-[#f8fafc] py-3 z-10 font-bold text-[14px] text-brand-900 flex items-center gap-4">
                  <span>{date}</span>
                  <div className="h-px bg-brand-200 flex-1" />
                </div>
                <div className="pl-5 border-l-2 border-brand-200 ml-2.5 space-y-8 pt-6 pb-4">
                  {items.map((entry) => (
                    <div key={entry.id} className="relative group">
                      <div className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-[3px] border-[#f8fafc] ${ACTION_COLOR[entry.action] ?? "bg-brand-400"}`} />
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[14px] text-brand-900">
                            <span className="font-bold">Admin</span>{" "}
                            {entry.action}{" "}
                            <span className="font-semibold">"{entry.label}"</span>
                          </div>
                          <div className="text-[12px] text-brand-500 mt-1.5 flex items-center gap-2">
                            <span className={`badge ${ACTION_BADGE[entry.action] ?? "badge-gray"} !text-[10px] uppercase tracking-wider`}>
                              {entry.action}
                            </span>
                            {formatTime(entry.savedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
