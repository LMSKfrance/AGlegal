"use client";

import Link from "next/link";
import { useState, useRef, useTransition, useEffect } from "react";
import { reorderTeamMembers, deleteTeamMember, togglePublishTeamMember } from "@/lib/actions/team";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

type Member = {
  id: number;
  titleEn: string;
  titleKa: string | null;
  positionEn: string | null;
  image: string | null;
  showOnHome: number | null;
  homeOrder: number | null;
  published: number | null;
};

type Toast = { label: string; position: number; prevList: Member[] };

export function TeamListTable({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<Toast | null>(null);
  const dragId = useRef<number | null>(null);
  const dragOverId = useRef<number | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  function onDragStart(id: number) {
    dragId.current = id;
  }

  function onDragOver(e: React.DragEvent, id: number) {
    e.preventDefault();
    dragOverId.current = id;
  }

  function onDrop() {
    if (dragId.current === null || dragOverId.current === null) return;
    if (dragId.current === dragOverId.current) return;

    const prev = [...members];
    const next = [...members];
    const fromIdx = next.findIndex((m) => m.id === dragId.current);
    const toIdx = next.findIndex((m) => m.id === dragOverId.current);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    dragId.current = null;
    dragOverId.current = null;

    setMembers(next);
    setToast({ label: moved.titleEn, position: toIdx + 1, prevList: prev });

    startTransition(async () => {
      await reorderTeamMembers(next.map((m) => m.id));
    });
  }

  function handleUndo() {
    if (!toast) return;
    const prev = toast.prevList;
    setToast(null);
    setMembers(prev);
    startTransition(async () => {
      await reorderTeamMembers(prev.map((m) => m.id));
    });
  }

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="w-8" />
            <th className="hidden sm:table-cell text-center w-10 text-brand-400 font-medium">#</th>
            <th className="hidden sm:table-cell w-16" />
            <th>Name</th>
            <th>Position</th>
            <th className="hidden sm:table-cell text-center w-24">Homepage</th>
            <th className="text-center w-28">Published</th>
            <th className="text-right w-20">Actions</th>
          </tr>
        </thead>
        <tbody className={isPending ? "opacity-60" : ""}>
          {members.map((member) => (
            <tr
              key={member.id}
              draggable
              onDragStart={() => onDragStart(member.id)}
              onDragOver={(e) => onDragOver(e, member.id)}
              onDrop={onDrop}
              className="group"
            >
              <td className="w-8 text-center">
                <span className="cursor-grab active:cursor-grabbing text-brand-400 hover:text-brand-700 transition-colors select-none">
                  <i className="ph ph-dots-six-vertical text-[18px]" />
                </span>
              </td>
              <td className="hidden sm:table-cell text-center text-[12px] font-semibold text-brand-400 w-10">
                {members.indexOf(member) + 1}
              </td>
              <td className="hidden sm:table-cell">
                <Link href={`/admin/team/${member.id}/edit`} className="block">
                  {member.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.image}
                      alt={member.titleEn}
                      className="w-10 h-10 rounded-[4px] object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-[4px] bg-brand-100 flex items-center justify-center text-brand-400">
                      <i className="ph ph-user" />
                    </div>
                  )}
                </Link>
              </td>
              <td>
                <Link
                  href={`/admin/team/${member.id}/edit`}
                  className="font-medium text-brand-900 hover:text-primary-600 transition-colors"
                >
                  {member.titleEn}
                </Link>
                {member.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{member.titleKa}</div>}
              </td>
              <td className="text-brand-600 text-[13px]">
                {member.positionEn ?? <span className="text-brand-300">—</span>}
              </td>
              <td className="hidden sm:table-cell text-center">
                {member.showOnHome ? (
                  <span className="badge badge-green text-[11px]">Yes</span>
                ) : (
                  <span className="text-brand-300 text-[12px]">No</span>
                )}
              </td>
              <td className="text-center">
                <button
                  type="button"
                  title={member.published ? "Unpublish" : "Publish"}
                  onClick={() => {
                    const next = !member.published;
                    setMembers((prev) => prev.map((m) => m.id === member.id ? { ...m, published: next ? 1 : 0 } : m));
                    startTransition(() => togglePublishTeamMember(member.id, next));
                  }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                    member.published
                      ? "bg-green-50 text-green-700 hover:bg-green-100"
                      : "bg-brand-100 text-brand-400 hover:bg-brand-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${member.published ? "bg-green-500" : "bg-brand-300"}`} />
                  {member.published ? "Live" : "Draft"}
                </button>
              </td>
              <td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/team/${member.id}/edit`} className="btn-icon" title="Edit">
                    <i className="ph ph-pencil text-brand-500" />
                  </Link>
                  <DeleteButton action={deleteTeamMember.bind(null, member.id)} label={member.titleEn} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Reorder toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 toast-animate">
          <div className="card flex items-center gap-3 py-3 pl-4 pr-3 shadow-lg" style={{ minWidth: 320 }}>
            <i className="ph ph-arrows-down-up text-[17px] text-brand-400 shrink-0" />
            <p className="flex-1 text-[13px] text-brand-600 leading-snug">
              <span className="font-medium text-brand-900">{toast.label}</span>
              {" "}moved to position {toast.position}
            </p>
            <button
              onClick={handleUndo}
              className="btn btn-secondary h-[30px] px-3 text-[12px] shrink-0"
            >
              Undo
            </button>
          </div>
        </div>
      )}
    </>
  );
}
