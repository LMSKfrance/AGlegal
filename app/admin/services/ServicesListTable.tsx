"use client";

import Link from "next/link";
import { useState, useRef, useTransition, useEffect } from "react";
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

type Toast = { label: string; position: number; prevList: Service[] };

export function ServicesListTable({ initialServices }: { initialServices: Service[] }) {
  const [servicesList, setServicesList] = useState(initialServices);
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

    const prev = [...servicesList];
    const next = [...servicesList];
    const fromIdx = next.findIndex((s) => s.id === dragId.current);
    const toIdx = next.findIndex((s) => s.id === dragOverId.current);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);

    dragId.current = null;
    dragOverId.current = null;

    setServicesList(next);
    setToast({ label: moved.titleEn, position: toIdx + 1, prevList: prev });

    startTransition(async () => {
      await reorderServices(next.map((s) => s.id));
    });
  }

  function handleUndo() {
    if (!toast) return;
    const prev = toast.prevList;
    setToast(null);
    setServicesList(prev);
    startTransition(async () => {
      await reorderServices(prev.map((s) => s.id));
    });
  }

  return (
    <>
      <table className="admin-table">
        <thead>
          <tr>
            <th className="w-8" />
            <th className="hidden sm:table-cell text-center w-10 text-brand-400 font-medium">#</th>
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
              <td className="w-8 text-center">
                <span className="cursor-grab active:cursor-grabbing text-brand-400 hover:text-brand-700 transition-colors select-none">
                  <i className="ph ph-dots-six-vertical text-[18px]" />
                </span>
              </td>
              <td className="hidden sm:table-cell text-center text-[12px] font-semibold text-brand-400 w-10">
                {servicesList.indexOf(service) + 1}
              </td>
              <td>
                <Link
                  href={`/admin/services/${service.id}/edit`}
                  className="font-medium text-brand-900 hover:text-primary-600 transition-colors"
                >
                  {service.titleEn}
                </Link>
                {service.titleKa && <div className="text-[12px] text-brand-400 mt-0.5">{service.titleKa}</div>}
              </td>
              <td className="hidden sm:table-cell text-center">
                {service.clickable ? (
                  <span className="badge badge-green text-[11px]">Yes</span>
                ) : (
                  <span className="text-brand-300 text-[12px]">No</span>
                )}
              </td>
              <td className="hidden sm:table-cell text-center">
                {service.showOnHome ? (
                  <span className="badge badge-green text-[11px]">Yes</span>
                ) : (
                  <span className="text-brand-300 text-[12px]">No</span>
                )}
              </td>
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
