"use client";

import { useActionState, useState, useRef, useTransition } from "react";
import { upsertHomeBenefit, deleteHomeBenefit } from "@/lib/actions/home";
import type { HomeFormState } from "@/lib/actions/home";
import type { HomeBenefit } from "@/lib/db/schema";

const INITIAL: HomeFormState = {};

function BenefitItem({
  item,
  lang,
  onDelete,
}: {
  item: HomeBenefit;
  lang: "en" | "ka";
  onDelete: (id: number) => void;
}) {
  const action = upsertHomeBenefit.bind(null, item.id);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const iconRef = useRef<HTMLInputElement>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    item.iconPath ? `/api/images/${item.iconPath}` : null
  );

  return (
    <form action={formAction} key={lang}>
      <div className="bg-white border border-brand-200 p-4 rounded-xl relative group">
        {state.error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{state.error}</div>
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

        <div className="flex gap-5 items-start">
          {/* Icon square */}
          <div className="w-24 shrink-0">
            <label className="label-base">Icon</label>
            <div
              className="aspect-square bg-brand-50 border-2 border-dashed border-brand-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-400 overflow-hidden"
              onClick={() => iconRef.current?.click()}
            >
              {iconPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className="ph ph-image text-3xl text-brand-300" />
              )}
            </div>
            <input
              ref={iconRef} type="file" name="icon" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setIconPreview(URL.createObjectURL(f)); }}
            />
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4 pr-16">
            <div>
              <label className="label-base">Title <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 60)</span></label>
              <input
                type="text"
                name={lang === "en" ? "titleEn" : "titleKa"}
                className="input-base"
                maxLength={60}
                defaultValue={lang === "en" ? item.titleEn : (item.titleKa ?? "")}
              />
              <input type="hidden" name={lang === "en" ? "titleKa" : "titleEn"} value={lang === "en" ? (item.titleKa ?? "") : item.titleEn} />
            </div>
            <div>
              <label className="label-base">Description <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 220)</span></label>
              <textarea
                name={lang === "en" ? "descriptionEn" : "descriptionKa"}
                className="input-base"
                rows={2}
                maxLength={220}
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

function NewBenefitForm({ onDone }: { onDone: () => void }) {
  const action = upsertHomeBenefit.bind(null, null);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const iconRef = useRef<HTMLInputElement>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  return (
    <form action={formAction}>
      <div className="bg-white border-2 border-primary-200 p-4 rounded-xl">
        {state.error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{state.error}</div>
        )}
        <div className="flex gap-5 items-start">
          <div className="w-24 shrink-0">
            <label className="label-base">Icon</label>
            <div
              className="aspect-square bg-brand-50 border-2 border-dashed border-brand-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary-400 overflow-hidden"
              onClick={() => iconRef.current?.click()}
            >
              {iconPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={iconPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <i className="ph ph-upload-simple text-2xl text-brand-300" />
              )}
            </div>
            <input ref={iconRef} type="file" name="icon" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) setIconPreview(URL.createObjectURL(f)); }} />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="label-base required">Title (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 60)</span></label>
              <input type="text" name="titleEn" className="input-base" maxLength={60} required />
            </div>
            <div>
              <label className="label-base">Description (EN) <span className="text-[10px] text-brand-400 font-normal ml-1">(Max 220)</span></label>
              <textarea name="descriptionEn" className="input-base" rows={2} maxLength={220} />
            </div>
            {/* hidden KA fields empty on create */}
            <input type="hidden" name="titleKa" value="" />
            <input type="hidden" name="descriptionKa" value="" />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button type="button" className="btn btn-secondary text-[12px] py-1.5 px-3" onClick={onDone}>Cancel</button>
          <button type="submit" className="btn btn-primary text-[12px] py-1.5 px-3" disabled={pending}>
            {pending ? <><i className="ph ph-spinner animate-spin" /> Adding…</> : <><i className="ph ph-plus" /> Add Card</>}
          </button>
        </div>
      </div>
    </form>
  );
}

export default function HomeBenefitsSection({
  initialBenefits,
  lang,
}: {
  initialBenefits: HomeBenefit[];
  lang: "en" | "ka";
}) {
  const [adding, setAdding] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();

  function handleDelete(id: number) {
    if (!confirm("Delete this benefit?")) return;
    startDeleteTransition(async () => {
      await deleteHomeBenefit(id);
    });
  }

  return (
    <div className={`space-y-4${deletePending ? " opacity-60 pointer-events-none" : ""}`}>
      {initialBenefits.length === 0 && !adding && (
        <div className="text-center py-6 text-brand-400 text-[13px]">No benefits yet. Add up to 4 cards.</div>
      )}
      {initialBenefits.map((b) => (
        <BenefitItem key={`${b.id}-${lang}`} item={b} lang={lang} onDelete={handleDelete} />
      ))}
      {adding && <NewBenefitForm onDone={() => setAdding(false)} />}
      {initialBenefits.length < 4 && !adding && (
        <button
          className="btn btn-secondary w-full border-dashed border-2 hover:border-primary-400 text-brand-600 bg-transparent hover:bg-white"
          onClick={() => setAdding(true)}
        >
          <i className="ph ph-plus" /> Add Benefit Card
        </button>
      )}
    </div>
  );
}
