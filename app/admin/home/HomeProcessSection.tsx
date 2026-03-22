"use client";

import { useActionState, useState, useRef, useTransition } from "react";
import { upsertHomeProcessStep, deleteHomeProcessStep } from "@/lib/actions/home";
import type { HomeFormState } from "@/lib/actions/home";
import type { HomeProcessStep } from "@/lib/db/schema";

const INITIAL: HomeFormState = {};

function ProcessStepItem({
  item,
  lang,
  onDelete,
}: {
  item: HomeProcessStep;
  lang: "en" | "ka";
  onDelete: (id: number) => void;
}) {
  const action = upsertHomeProcessStep.bind(null, item.id);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(
    item.image ? `/api/images/${item.image}` : null
  );

  return (
    <form action={formAction} key={lang}>
      <div className="bg-white border border-brand-200 p-5 rounded-xl relative group">
        {state.error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{state.error}</div>
        )}
        {state.success && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">Saved!</div>
        )}

        {/* Hover controls */}
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <button type="submit" className="btn-icon text-primary-600 hover:bg-primary-50" disabled={pending} title="Save">
            <i className={pending ? "ph ph-spinner animate-spin" : "ph ph-floppy-disk"} />
          </button>
          <button type="button" className="btn-icon text-red-500 hover:bg-red-50" onClick={() => onDelete(item.id)} title="Delete">
            <i className="ph ph-trash" />
          </button>
        </div>

        <div className="flex gap-6 items-start">
          {/* Step image */}
          <div className="w-32 shrink-0">
            <label className="label-base">Image</label>
            <div
              className="aspect-square bg-brand-50 border-2 border-dashed border-brand-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-400 overflow-hidden"
              onClick={() => imgRef.current?.click()}
            >
              {imgPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className="ph ph-image text-3xl text-brand-300" />
              )}
            </div>
            <input
              ref={imgRef} type="file" name="image" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setImgPreview(URL.createObjectURL(f)); }}
            />
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4 pr-16">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Tab Label <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 20)</span></label>
                <input
                  type="text"
                  name={lang === "en" ? "tabTitleEn" : "tabTitleKa"}
                  className="input-base"
                  maxLength={20}
                  placeholder="Consult"
                  defaultValue={lang === "en" ? (item.tabTitleEn ?? "") : (item.tabTitleKa ?? "")}
                />
                <input type="hidden" name={lang === "en" ? "tabTitleKa" : "tabTitleEn"} value={lang === "en" ? (item.tabTitleKa ?? "") : (item.tabTitleEn ?? "")} />
              </div>
              <div>
                <label className="label-base">Step Title <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 80)</span></label>
                <input
                  type="text"
                  name={lang === "en" ? "titleEn" : "titleKa"}
                  className="input-base"
                  maxLength={80}
                  defaultValue={lang === "en" ? (item.titleEn ?? "") : (item.titleKa ?? "")}
                />
                <input type="hidden" name={lang === "en" ? "titleKa" : "titleEn"} value={lang === "en" ? (item.titleKa ?? "") : (item.titleEn ?? "")} />
              </div>
            </div>
            <div>
              <label className="label-base">Description <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 260)</span></label>
              <textarea
                name={lang === "en" ? "descriptionEn" : "descriptionKa"}
                className="input-base"
                rows={3}
                maxLength={260}
                defaultValue={lang === "en" ? (item.descriptionEn ?? "") : (item.descriptionKa ?? "")}
              />
              <input type="hidden" name={lang === "en" ? "descriptionKa" : "descriptionEn"} value={lang === "en" ? (item.descriptionKa ?? "") : (item.descriptionEn ?? "")} />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function NewProcessStepForm({ onDone }: { onDone: () => void }) {
  const action = upsertHomeProcessStep.bind(null, null);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  return (
    <form action={formAction}>
      <div className="bg-white border-2 border-primary-200 p-5 rounded-xl">
        {state.error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{state.error}</div>
        )}
        <div className="flex gap-6 items-start">
          <div className="w-32 shrink-0">
            <label className="label-base">Image</label>
            <div
              className="aspect-square bg-brand-50 border-2 border-dashed border-brand-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-400 overflow-hidden"
              onClick={() => imgRef.current?.click()}
            >
              {imgPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imgPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className="ph ph-upload-simple text-2xl text-brand-300" />
              )}
            </div>
            <input ref={imgRef} type="file" name="image" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setImgPreview(URL.createObjectURL(f)); }} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base required">Tab Label (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 20)</span></label>
                <input type="text" name="tabTitleEn" className="input-base" maxLength={20} placeholder="Consult" required />
              </div>
              <div>
                <label className="label-base">Tab Label (KA)</label>
                <input type="text" name="tabTitleKa" className="input-base" maxLength={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base required">Step Title (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 80)</span></label>
                <input type="text" name="titleEn" className="input-base" maxLength={80} required />
              </div>
              <div>
                <label className="label-base">Step Title (KA)</label>
                <input type="text" name="titleKa" className="input-base" maxLength={80} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Description (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 260)</span></label>
                <textarea name="descriptionEn" className="input-base" rows={3} maxLength={260} />
              </div>
              <div>
                <label className="label-base">Description (KA)</label>
                <textarea name="descriptionKa" className="input-base" rows={3} maxLength={260} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary text-[12px] py-1.5 px-3" onClick={onDone}>Cancel</button>
          <button type="submit" className="btn btn-primary text-[12px] py-1.5 px-3" disabled={pending}>
            {pending ? <><i className="ph ph-spinner animate-spin" /> Adding…</> : <><i className="ph ph-plus" /> Add Step</>}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function HomeProcessSection({
  initialSteps,
  lang,
}: {
  initialSteps: HomeProcessStep[];
  lang: "en" | "ka";
}) {
  const [adding, setAdding] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();

  function handleDelete(id: number) {
    if (!confirm("Delete this step?")) return;
    startDeleteTransition(async () => {
      await deleteHomeProcessStep(id);
    });
  }

  return (
    <div className={`space-y-4${deletePending ? " opacity-60 pointer-events-none" : ""}`}>
      {initialSteps.length === 0 && !adding && (
        <div className="text-center py-6 text-brand-400 text-[13px]">No process steps yet. Add up to 4 steps.</div>
      )}
      {initialSteps.map((step) => (
        <ProcessStepItem key={`${step.id}-${lang}`} item={step} lang={lang} onDelete={handleDelete} />
      ))}
      {adding && <NewProcessStepForm onDone={() => setAdding(false)} />}
      {initialSteps.length < 4 && !adding && (
        <button
          className="btn btn-secondary w-full border-dashed border-2 hover:border-primary-400 text-brand-600 bg-transparent hover:bg-white"
          onClick={() => setAdding(true)}
        >
          <i className="ph ph-plus" /> Add Process Step
        </button>
      )}
    </div>
  );
}
