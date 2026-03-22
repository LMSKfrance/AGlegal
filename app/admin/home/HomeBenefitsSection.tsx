"use client";

import { useActionState, useState, useRef } from "react";
import { upsertHomeBenefit, deleteHomeBenefit } from "@/lib/actions/home";
import type { HomeFormState } from "@/lib/actions/home";
import type { HomeBenefit } from "@/lib/db/schema";

const INITIAL: HomeFormState = {};

function BenefitForm({
  item,
  lang,
  onDone,
}: {
  item: HomeBenefit | null;
  lang: "en" | "ka";
  onDone: () => void;
}) {
  const action = upsertHomeBenefit.bind(null, item?.id ?? null);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const iconRef = useRef<HTMLInputElement>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    item?.iconPath ? `/api/images/${item.iconPath}` : null
  );

  return (
    <form action={formAction} className="space-y-4 p-5 bg-brand-50 rounded-xl border border-brand-200">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{state.error}</div>
      )}
      {state.success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Saved!</div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-base required">Title (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 60)</span></label>
          <input type="text" name="titleEn" className="input-base" maxLength={60} required defaultValue={item?.titleEn ?? ""} />
        </div>
        <div>
          <label className="label-base">Title (KA) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 60)</span></label>
          <input type="text" name="titleKa" className="input-base" maxLength={60} defaultValue={item?.titleKa ?? ""} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-base">Description (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 220)</span></label>
          <textarea name="descriptionEn" className="input-base" rows={3} maxLength={220} defaultValue={item?.descriptionEn ?? ""} />
        </div>
        <div>
          <label className="label-base">Description (KA)</label>
          <textarea name="descriptionKa" className="input-base" rows={3} maxLength={220} defaultValue={item?.descriptionKa ?? ""} />
        </div>
      </div>
      <div>
        <label className="label-base">Icon / Image (Optional)</label>
        <div
          className="file-upload-zone flex flex-col items-center gap-2 h-24 cursor-pointer overflow-hidden"
          onClick={() => iconRef.current?.click()}
        >
          {iconPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={iconPreview} alt="icon" className="h-full object-contain rounded" />
          ) : (
            <>
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <i className="ph ph-upload-simple text-lg text-brand-500" />
              </div>
              <span className="text-[11px] text-brand-500">Click to upload icon</span>
            </>
          )}
        </div>
        <input ref={iconRef} type="file" name="icon" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setIconPreview(URL.createObjectURL(f)); }} />
      </div>
      <div className="flex justify-end gap-3">
        <button type="button" className="btn btn-secondary" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <><i className="ph ph-spinner animate-spin" /> Saving…</> : <><i className="ph ph-floppy-disk" /> Save Benefit</>}
        </button>
      </div>
    </form>
  );
}

export default function HomeBenefitsSection({
  initialBenefits,
}: {
  initialBenefits: HomeBenefit[];
  lang: "en" | "ka";
}) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this benefit?")) return;
    await deleteHomeBenefit(id);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
          <i className="ph ph-star text-primary-600" /> Why Work With Us
          <span className="text-[11px] font-normal text-brand-400 ml-1">(max 4 cards)</span>
        </h2>
        {initialBenefits.length < 4 && editingId !== "new" && (
          <button className="btn btn-secondary text-[12px] py-1 px-3" onClick={() => setEditingId("new")}>
            <i className="ph ph-plus" /> Add Benefit
          </button>
        )}
      </div>
      <div className="card-body space-y-4">
        {editingId === "new" && (
          <BenefitForm item={null} lang={lang} onDone={() => setEditingId(null)} />
        )}
        {initialBenefits.length === 0 && editingId !== "new" && (
          <div className="text-center py-8 text-brand-400 text-[13px]">
            No benefits yet. Add up to 4 cards.
          </div>
        )}
        {initialBenefits.map((b) => (
          <div key={b.id}>
            {editingId === b.id ? (
              <BenefitForm item={b} lang={lang} onDone={() => setEditingId(null)} />
            ) : (
              <div className="flex items-start justify-between gap-4 p-4 border border-brand-100 rounded-xl bg-white hover:bg-brand-50 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  {b.iconPath && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`/api/images/${b.iconPath}`} alt="" className="w-10 h-10 object-contain rounded shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-brand-900 truncate">
                      {lang === "en" ? b.titleEn : (b.titleKa || b.titleEn)}
                    </div>
                    {(lang === "en" ? b.descriptionEn : b.descriptionKa) && (
                      <div className="text-[12px] text-brand-500 mt-0.5 line-clamp-2">
                        {lang === "en" ? b.descriptionEn : b.descriptionKa}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="btn-icon" onClick={() => setEditingId(b.id)} title="Edit">
                    <i className="ph ph-pencil text-brand-500" />
                  </button>
                  <button className="btn-icon text-red-400 hover:text-red-600" onClick={() => handleDelete(b.id)} title="Delete">
                    <i className="ph ph-trash" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
