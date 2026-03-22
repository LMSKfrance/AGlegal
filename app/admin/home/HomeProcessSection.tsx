"use client";

import { useActionState, useRef, useState } from "react";
import { upsertHomeProcessStep } from "@/lib/actions/home";
import type { HomeFormState } from "@/lib/actions/home";
import type { HomeProcessStep } from "@/lib/db/schema";

const INITIAL: HomeFormState = {};
const TOTAL_SLOTS = 4;

function ProcessStepCard({
  item,
  index,
  lang,
}: {
  item: HomeProcessStep | null;
  index: number;
  lang: "en" | "ka";
}) {
  const action = upsertHomeProcessStep.bind(null, item?.id ?? null);
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const imgRef = useRef<HTMLInputElement>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(
    item?.image ?? null
  );

  return (
    <form action={formAction}>
      {/* preserve the other language's values */}
      <input type="hidden" name={lang === "en" ? "tabTitleKa" : "tabTitleEn"} value={lang === "en" ? (item?.tabTitleKa ?? "") : (item?.tabTitleEn ?? "")} />
      <input type="hidden" name={lang === "en" ? "titleKa" : "titleEn"} value={lang === "en" ? (item?.titleKa ?? "") : (item?.titleEn ?? "")} />
      <input type="hidden" name={lang === "en" ? "descriptionKa" : "descriptionEn"} value={lang === "en" ? (item?.descriptionKa ?? "") : (item?.descriptionEn ?? "")} />

      <div className="bg-white border border-brand-200 p-5 rounded-lg relative group">
        {state.error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">{state.error}</div>
        )}
        {state.success && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">Saved!</div>
        )}

        {/* Save button */}
        <div className="absolute right-4 top-4">
          <button type="submit" className="btn-save" disabled={pending} title="Save step">
            {pending
              ? <i className="ph ph-spinner animate-spin" />
              : <i className="ph ph-floppy-disk" />}
          </button>
        </div>

        <div className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider mb-3">Step {index + 1}</div>

        <div className="flex gap-6 items-start">
          {/* Step image */}
          <div className="w-32 shrink-0">
            <label className="label-base">Step Image</label>
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
          <div className="flex-1 space-y-4 pr-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-base">Tab Title <span className="text-[10px] text-brand-400 font-normal ml-1">({lang === "en" ? "En" : "ქარ"}, Max 20)</span></label>
                <input
                  type="text"
                  name={lang === "en" ? "tabTitleEn" : "tabTitleKa"}
                  className="input-base"
                  maxLength={20}
                  placeholder="Consult"
                  defaultValue={lang === "en" ? (item?.tabTitleEn ?? "") : (item?.tabTitleKa ?? "")}
                />
              </div>
              <div>
                <label className="label-base">Step Title <span className="text-[10px] text-brand-400 font-normal ml-1">({lang === "en" ? "En" : "ქარ"}, Max 80)</span></label>
                <input
                  type="text"
                  name={lang === "en" ? "titleEn" : "titleKa"}
                  className="input-base"
                  maxLength={80}
                  defaultValue={lang === "en" ? (item?.titleEn ?? "") : (item?.titleKa ?? "")}
                />
              </div>
            </div>
            <div>
              <label className="label-base">Description <span className="text-[10px] text-brand-400 font-normal ml-1">({lang === "en" ? "En" : "ქარ"}, Max 260)</span></label>
              <textarea
                name={lang === "en" ? "descriptionEn" : "descriptionKa"}
                className="input-base"
                rows={3}
                maxLength={260}
                defaultValue={lang === "en" ? (item?.descriptionEn ?? "") : (item?.descriptionKa ?? "")}
              />
            </div>
          </div>
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
  // Always show exactly 4 slots; fill missing with null
  const slots: (HomeProcessStep | null)[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => initialSteps[i] ?? null);

  return (
    <div className="space-y-4">
      {slots.map((item, i) => (
        <ProcessStepCard key={item?.id ?? `empty-${i}`} item={item} index={i} lang={lang} />
      ))}
    </div>
  );
}
