"use client";

import { useState } from "react";
import { RestoreButton } from "@/app/admin/_components/RestoreButton";

type Entry = {
  id: number;
  action: string;
  label: string;
  section: string;
  savedAt: string;
  snapshotType: string | null;
  snapshot: string | null;
};

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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function HistoryList({ groups }: { groups: Record<string, Entry[]> }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  function toggleRow(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-10">
      {Object.entries(groups).map(([date, items]) => (
        <div key={date}>
          <div className="py-3 font-bold text-[14px] text-brand-900 flex items-center gap-4">
            <span>{date}</span>
            <div className="h-px bg-brand-200 flex-1" />
          </div>
          <div className="pl-5 border-l-2 border-brand-200 ml-2.5 space-y-8 pt-6 pb-4">
            {items.map((entry) => {
              const isSelected = selectedId === entry.id;
              return (
                <div
                  key={entry.id}
                  className={`relative cursor-pointer select-none rounded-lg transition-colors ${isSelected ? "bg-brand-50" : "hover:bg-brand-50/60"}`}
                  onClick={() => toggleRow(entry.id)}
                >
                  <div className={`absolute -left-[27px] top-4 w-3 h-3 rounded-full border-[3px] border-[#f8fafc] ${ACTION_COLOR[entry.action] ?? "bg-brand-400"}`} />
                  <div className="flex justify-between items-center gap-4 px-3 py-2.5">
                    <div>
                      <div className="text-[14px] text-brand-900">
                        <span className="font-bold">Admin</span>{" "}
                        {entry.action}{" "}
                        <span className="font-semibold">&quot;{entry.label}&quot;</span>
                      </div>
                      <div className="text-[12px] text-brand-500 mt-1.5 flex items-center gap-2">
                        <span className={`badge ${ACTION_BADGE[entry.action] ?? "badge-gray"} !text-[10px] uppercase tracking-wider`}>
                          {entry.action}
                        </span>
                        {formatTime(entry.savedAt)}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                        <RestoreButton historyId={entry.id} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
