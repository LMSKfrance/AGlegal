"use client";

import { useActionState, useState, useRef } from "react";
import { upsertHomeProcessStep, deleteHomeProcessStep } from "@/lib/actions/home";
import type { HomeFormState } from "@/lib/actions/home";
import type { HomeProcessStep } from "@/lib/db/schema";

const INITIAL: HomeFormState = {};

function ProcessForm({
  item,
  onDone,
}: {
  item: HomeProcessStep | null;
  onDone: () => void;
}) {
  const action = upsertHomeProcessStep.bind(null, item?.id ?? null);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(
    item?.image ? `/api/images/${item.image}` : null
  );

  return (
    <form action={formAction} className="space-y-4 p-5 bg-brand-50 rounded-xl border border-brand-200">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{state.error}</div>
      )}
      {state.success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Saved!</div>
      )}

      {/* Tab titles (one word each) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-base required">Tab Label (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(1 word, max 20)</span></label>
          <input type="text" name="tabTitleEn" className="input-base" maxLength={20} required placeholder="Consult" defaultValue={item?.tabTitleEn ?? ""} />
        </div>
        <div>
          <label className="label-base">Tab Label (KA)</label>
          <input type="text" name="tabTitleKa" className="input-base" maxLength={20} defaultValue={item?.tabTitleKa ?? ""} />
        </div>
      </div>

      {/* Step titles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-base required">Step Title (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 80)</span></label>
          <input type="text" name="titleEn" className="input-base" maxLength={80} required defaultValue={item?.titleEn ?? ""} />
        </div>
        <div>
          <label className="label-base">Step Title (KA)</label>
          <input type="text" name="titleKa" className="input-base" maxLength={80} defaultValue={item?.titleKa ?? ""} />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-base">Description (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 260)</span></label>
          <textarea name="descriptionEn" className="input-base" rows={3} maxLength={260} defaultValue={item?.descriptionEn ?? ""} />
        </div>
        <div>
          <label className="label-base">Description (KA)</label>
          <textarea name="descriptionKa" className="input-base" rows={3} maxLength={260} defaultValue={item?.descriptionKa ?? ""} />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="label-base">Step Image (Optional)</label>
        <div
          className="file-upload-zone flex flex-col items-center gap-2 h-32 cursor-pointer overflow-hidden"
          onClick={() => imgRef.current?.click()}
        >
          {imgPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imgPreview} alt="step" className="h-full w-full object-cover rounded" />
          ) : (
            <>
              <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                <i className="ph ph-upload-simple text-lg text-brand-500" />
              </div>
              <span className="text-[11px] text-brand-500">Click to upload image</span>
            </>
          )}
        </div>
        <input ref={imgRef} type="file" name="image" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setImgPreview(URL.createObjectURL(f)); }} />
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn btn-secondary" onClick={onDone}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? <><i className="ph ph-spinner animate-spin" /> Saving…</> : <><i className="ph ph-floppy-disk" /> Save Step</>}
        </button>
      </div>
    </form>
  );
}

export default function HomeProcessSection({
  initialSteps,
}: {
  initialSteps: HomeProcessStep[];
  lang: "en" | "ka";
}) {
  const [editingId, setEditingId] = useState<number | "new" | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this step?")) return;
    await deleteHomeProcessStep(id);
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
          <i className="ph ph-arrows-clockwise text-primary-600" /> How We Work
          <span className="text-[11px] font-normal text-brand-400 ml-1">(max 4 steps)</span>
        </h2>
        {initialSteps.length < 4 && editingId !== "new" && (
          <button className="btn btn-secondary text-[12px] py-1 px-3" onClick={() => setEditingId("new")}>
            <i className="ph ph-plus" /> Add Step
          </button>
        )}
      </div>
      <div className="card-body space-y-4">
        {editingId === "new" && (
          <ProcessForm item={null} onDone={() => setEditingId(null)} />
        )}
        {initialSteps.length === 0 && editingId !== "new" && (
          <div className="text-center py-8 text-brand-400 text-[13px]">
            No process steps yet. Add up to 4 steps.
          </div>
        )}
        {initialSteps.map((step) => (
          <div key={step.id}>
            {editingId === step.id ? (
              <ProcessForm item={step} onDone={() => setEditingId(null)} />
            ) : (
              <div className="flex items-start justify-between gap-4 p-4 border border-brand-100 rounded-xl bg-white hover:bg-brand-50 transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-[13px] font-bold shrink-0">
                    {step.stepNumber ?? "—"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[14px] font-semibold text-brand-900">
                      {step.titleEn}
                      {step.tabTitleEn && <span className="ml-2 text-[11px] text-brand-400 font-normal">Tab: {step.tabTitleEn}</span>}
                    </div>
                    {step.descriptionEn && (
                      <div className="text-[12px] text-brand-500 mt-0.5 line-clamp-2">{step.descriptionEn}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button className="btn-icon" onClick={() => setEditingId(step.id)} title="Edit">
                    <i className="ph ph-pencil text-brand-500" />
                  </button>
                  <button className="btn-icon text-red-400 hover:text-red-600" onClick={() => handleDelete(step.id)} title="Delete">
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
