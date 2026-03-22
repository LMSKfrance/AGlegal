"use client";

import { useActionState } from "react";
import { upsertHomeBenefit } from "@/lib/actions/home";
import type { HomeFormState } from "@/lib/actions/home";
import type { HomeBenefit } from "@/lib/db/schema";

const INITIAL: HomeFormState = {};
const TOTAL_SLOTS = 4;

function BenefitCard({
  item,
  index,
  lang,
}: {
  item: HomeBenefit | null;
  index: number;
  lang: "en" | "ka";
}) {
  const action = upsertHomeBenefit.bind(null, item?.id ?? null);
  const [state, formAction, pending] = useActionState(action, INITIAL);

  return (
    <form action={formAction}>
      {/* preserve the other language's values */}
      <input type="hidden" name={lang === "en" ? "titleKa" : "titleEn"} value={lang === "en" ? (item?.titleKa ?? "") : (item?.titleEn ?? "")} />
      <input type="hidden" name={lang === "en" ? "descriptionKa" : "descriptionEn"} value={lang === "en" ? (item?.descriptionKa ?? "") : (item?.descriptionEn ?? "")} />

      <div className="bg-white border border-brand-200 p-4 rounded-lg">
        {/* Card header: label + status + save */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-semibold text-brand-400 uppercase tracking-wider">Card {index + 1}</div>
          <div className="flex items-center gap-2">
            {state.error && <span className="text-[11px] text-red-600 font-medium">{state.error}</span>}
            {state.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
            <button type="submit" className="btn-save" disabled={pending} title="Save card">
              {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-base">Title <span className="text-[10px] text-brand-400 font-normal ml-1">({lang === "en" ? "En" : "ქარ"}, Max 60)</span></label>
            <input
              type="text"
              name={lang === "en" ? "titleEn" : "titleKa"}
              className="input-base"
              maxLength={60}
              defaultValue={lang === "en" ? (item?.titleEn ?? "") : (item?.titleKa ?? "")}
            />
          </div>
          <div>
            <label className="label-base">Description <span className="text-[10px] text-brand-400 font-normal ml-1">({lang === "en" ? "En" : "ქარ"}, Max 220)</span></label>
            <textarea
              name={lang === "en" ? "descriptionEn" : "descriptionKa"}
              className="input-base"
              rows={2}
              maxLength={220}
              defaultValue={lang === "en" ? (item?.descriptionEn ?? "") : (item?.descriptionKa ?? "")}
            />
          </div>
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
  // Always show exactly 4 slots; fill missing with null
  const slots: (HomeBenefit | null)[] = Array.from({ length: TOTAL_SLOTS }, (_, i) => initialBenefits[i] ?? null);

  return (
    <div className="space-y-4">
      {slots.map((item, i) => (
        <BenefitCard key={item?.id ?? `empty-${i}`} item={item} index={i} lang={lang} />
      ))}
    </div>
  );
}
