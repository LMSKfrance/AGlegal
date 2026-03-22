"use client";

import Link from "next/link";
import { useState, useRef, useTransition } from "react";
import { reorderTeamMembers, deleteTeamMember } from "@/lib/actions/team";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

type Member = {
  id: number;
  titleEn: string;
  titleKa: string | null;
  positionEn: string | null;
  image: string | null;
  showOnHome: number | null;
  homeOrder: number | null;
};

export function TeamListTable({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
  const [isPending, startTransition] = useTransition();
  const dragId = useRef<number | null>(null);
  const dragOverId = useRef<number | null>(null);

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

    const next = [...members];
    const fromIdx = next.findIndex((m) => m.id === dragId.current);
    const toIdx = next.findIndex((m) => m.id === dragOverId.current);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    setMembers(next);
    dragId.current = null;
    dragOverId.current = null;

    startTransition(async () => {
      await reorderTeamMembers(next.map((m) => m.id));
    });
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th className="w-8" />
          <th className="hidden sm:table-cell text-center w-10 text-brand-400 font-medium">#</th>
          <th className="hidden sm:table-cell w-16" />
          <th>Name</th>
          <th>Position</th>
          <th className="hidden sm:table-cell text-center w-24">Homepage</th>
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
            {/* Drag handle */}
            <td className="w-8 text-center">
              <span className="cursor-grab active:cursor-grabbing text-brand-400 hover:text-brand-700 transition-colors select-none">
                <i className="ph ph-dots-six-vertical text-[18px]" />
              </span>
            </td>

            {/* Order */}
            <td className="hidden sm:table-cell text-center text-[12px] font-semibold text-brand-400 w-10">
              {members.indexOf(member) + 1}
            </td>

            {/* Avatar */}
            <td className="hidden sm:table-cell">
              <Link href={`/admin/team/${member.id}/edit`} className="block">
                {member.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/api/images/${member.image}`}
                    alt={member.titleEn}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-400">
                    <i className="ph ph-user" />
                  </div>
                )}
              </Link>
            </td>

            {/* Name */}
            <td>
              <Link
                href={`/admin/team/${member.id}/edit`}
                className="font-medium text-brand-900 hover:text-primary-600 transition-colors"
              >
                {member.titleEn}
              </Link>
              {member.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{member.titleKa}</div>}
            </td>

            {/* Position */}
            <td className="text-brand-600 text-[13px]">
              {member.positionEn ?? <span className="text-brand-300">—</span>}
            </td>

            {/* Homepage */}
            <td className="hidden sm:table-cell text-center">
              {member.showOnHome ? (
                <span className="badge badge-green text-[11px]">Yes</span>
              ) : (
                <span className="text-brand-300 text-[12px]">No</span>
              )}
            </td>

            {/* Actions */}
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
  );
}
