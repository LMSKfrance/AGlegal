"use client";

import { useActionState } from "react";
import { useAdminLang } from "../AdminLangContext";
import OgImageUpload from "../OgImageUpload";
import type { TeamPageSeoState } from "@/lib/actions/pages";

type PageRecord = {
  metaDescriptionEn: string | null;
  metaDescriptionKa: string | null;
  seoTitleEn: string | null;
  seoTitleKa: string | null;
  ogTitleEn: string | null;
  ogTitleKa: string | null;
  ogDescriptionEn: string | null;
  ogDescriptionKa: string | null;
  ogImage: string | null;
} | null;

const INITIAL: TeamPageSeoState = {};

export default function TeamSeoForm({
  page,
  saveAction,
}: {
  page: PageRecord;
  saveAction: (_prev: TeamPageSeoState, fd: FormData) => Promise<TeamPageSeoState>;
}) {
  const [state, formAction, pending] = useActionState(saveAction, INITIAL);
  const lang = useAdminLang();

  const p = page ?? {
    metaDescriptionEn: null, metaDescriptionKa: null,
    seoTitleEn: null, seoTitleKa: null,
    ogTitleEn: null, ogTitleKa: null,
    ogDescriptionEn: null, ogDescriptionKa: null,
    ogImage: null,
  };

  const f = (enKey: keyof typeof p, kaKey: keyof typeof p) =>
    (lang === "en" ? p[enKey] : p[kaKey]) as string ?? "";

  const L = lang === "en" ? "(EN)" : "(ქარ)";

  return (
    <form action={formAction}>
      <div className="card">
        <div className="card-header">
          <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
            <i className="ph ph-magnifying-glass text-primary-600" /> Team Page SEO &amp; Open Graph
          </h2>
          <div className="flex items-center gap-2">
            {state.error && <span className="text-[11px] text-red-600 font-medium">{state.error}</span>}
            {state.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
            <button type="submit" className="btn-save" disabled={pending} title="Save SEO">
              {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
            </button>
          </div>
        </div>
        <div className="card-body space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label-base">SEO Title {L}</label>
              <input type="text" name={lang === "en" ? "seoTitleEn" : "seoTitleKa"} className="input-base"
                defaultValue={f("seoTitleEn", "seoTitleKa")} />
              <input type="hidden" name={lang === "en" ? "seoTitleKa" : "seoTitleEn"}
                value={lang === "en" ? (p.seoTitleKa ?? "") : (p.seoTitleEn ?? "")} />
            </div>
            <div>
              <label className="label-base">OG Title {L}</label>
              <input type="text" name={lang === "en" ? "ogTitleEn" : "ogTitleKa"} className="input-base"
                defaultValue={f("ogTitleEn", "ogTitleKa")} />
              <input type="hidden" name={lang === "en" ? "ogTitleKa" : "ogTitleEn"}
                value={lang === "en" ? (p.ogTitleKa ?? "") : (p.ogTitleEn ?? "")} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label-base">Meta Description {L}</label>
              <textarea name={lang === "en" ? "metaDescriptionEn" : "metaDescriptionKa"} className="input-base" rows={2}
                defaultValue={f("metaDescriptionEn", "metaDescriptionKa")} />
              <input type="hidden" name={lang === "en" ? "metaDescriptionKa" : "metaDescriptionEn"}
                value={lang === "en" ? (p.metaDescriptionKa ?? "") : (p.metaDescriptionEn ?? "")} />
            </div>
            <div>
              <label className="label-base">OG Description {L}</label>
              <textarea name={lang === "en" ? "ogDescriptionEn" : "ogDescriptionKa"} className="input-base" rows={2}
                defaultValue={f("ogDescriptionEn", "ogDescriptionKa")} />
              <input type="hidden" name={lang === "en" ? "ogDescriptionKa" : "ogDescriptionEn"}
                value={lang === "en" ? (p.ogDescriptionKa ?? "") : (p.ogDescriptionEn ?? "")} />
            </div>
          </div>
          <OgImageUpload existing={p.ogImage} />
        </div>
      </div>
    </form>
  );
}
