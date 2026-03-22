"use client";

import Link from "next/link";
import { useState, useRef, useTransition } from "react";
import { reorderServices, deleteService } from "@/lib/actions/services";
import { DeleteButton } from "@/app/admin/_components/DeleteButton";

type Service = {
  id: number;
  titleEn: string;
  titleKa: string | null;
  clickable: number | null;
  showOnHome: number | null;
  homeOrder: number | null;
};

export function ServicesListTable({ initialServices }: { initialServices: Service[] }) {
  const [servicesList, setServicesList] = useState(initialServices);
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

    const next = [...servicesList];
    const fromIdx = next.findIndex((s) => s.id === dragId.current);
    const toIdx = next.findIndex((s) => s.id === dragOverId.current);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    setServicesList(next);
    dragId.current = null;
    dragOverId.current = null;

    startTransition(async () => {
      await reorderServices(next.map((s) => s.id));
    });
  }

  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th className="w-8" />
          <th>Title</th>
          <th className="hidden sm:table-cell text-center w-24">Clickable</th>
          <th className="hidden sm:table-cell text-center w-24">Homepage</th>
          <th className="text-right w-20">Actions</th>
        </tr>
      </thead>
      <tbody className={isPending ? "opacity-60" : ""}>
        {servicesList.map((service) => (
          <tr
            key={service.id}
            draggable
            onDragStart={() => onDragStart(service.id)}
            onDragOver={(e) => onDragOver(e, service.id)}
            onDrop={onDrop}
            className="group"
          >
            {/* Drag handle */}
            <td className="w-8 text-center">
              <span className="cursor-grab active:cursor-grabbing text-brand-300 hover:text-brand-500 transition-colors select-none">
                <i className="ph ph-dots-six-vertical text-[18px]" />
              </span>
            </td>

            {/* Title */}
            <td>
              <Link
                href={`/admin/services/${service.id}/edit`}
                className="font-medium text-brand-900 hover:text-primary-600 transition-colors"
              >
                {service.titleEn}
              </Link>
              {service.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{service.titleKa}</div>}
            </td>

            {/* Clickable */}
            <td className="hidden sm:table-cell text-center">
              {service.clickable ? (
                <span className="badge badge-green text-[11px]">Yes</span>
              ) : (
                <span className="text-brand-300 text-[12px]">No</span>
              )}
            </td>

            {/* Homepage */}
            <td className="hidden sm:table-cell text-center">
              {service.showOnHome ? (
                <span className="badge badge-green text-[11px]">Yes</span>
              ) : (
                <span className="text-brand-300 text-[12px]">No</span>
              )}
            </td>

            {/* Actions */}
            <td className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin/services/${service.id}/edit`} className="btn-icon" title="Edit">
                  <i className="ph ph-pencil text-brand-500" />
                </Link>
                <DeleteButton action={deleteService.bind(null, service.id)} label={service.titleEn} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
