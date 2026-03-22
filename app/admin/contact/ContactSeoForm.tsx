"use client";

import { useActionState } from "react";
import { useAdminLang } from "../AdminLangContext";
import OgImageUpload from "../OgImageUpload";
import type { ContactSeoFormState } from "@/lib/actions/contact";

type PageRecord = {
  titleEn: string;
  titleKa: string | null;
  contentEn: string | null;
  contentKa: string | null;
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

const INITIAL: ContactSeoFormState = {};

export default function ContactSeoForm({
  page,
  saveAction,
}: {
  page: PageRecord;
  saveAction: (_prev: ContactSeoFormState, fd: FormData) => Promise<ContactSeoFormState>;
}) {
  const [state, formAction, pending] = useActionState(saveAction, INITIAL);
  const lang = useAdminLang();

  const p = page ?? {
    titleEn: "Contact", titleKa: null, contentEn: null, contentKa: null,
    metaDescriptionEn: null, metaDescriptionKa: null, seoTitleEn: null, seoTitleKa: null,
    ogTitleEn: null, ogTitleKa: null, ogDescriptionEn: null, ogDescriptionKa: null, ogImage: null,
  };

  const f = (enKey: keyof typeof p, kaKey: keyof typeof p) =>
    (lang === "en" ? p[enKey] : p[kaKey]) as string ?? "";

  return (
    <div className="px-8 pt-7 pb-10 border-t border-brand-100">
      <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest mb-6">
        SEO &amp; Open Graph
      </h2>
      <form action={formAction}>
        {/* Preserve non-SEO fields so they aren't wiped */}
        <input type="hidden" name="titleEn" value={p.titleEn} />
        <input type="hidden" name="titleKa" value={p.titleKa ?? ""} />
        <input type="hidden" name="contentEn" value={p.contentEn ?? ""} />
        <input type="hidden" name="contentKa" value={p.contentKa ?? ""} />

        <div className="max-w-4xl ml-0">
          <div className="card">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
              <div className="text-[13px] font-semibold text-brand-900">Contact Page SEO &amp; Open Graph</div>
              <div className="flex items-center gap-2">
                {state.error && <span className="text-[11px] text-red-600 font-medium">{state.error}</span>}
                {state.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                <button type="submit" className="btn-save" disabled={pending} title="Save SEO">
                  {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
                </button>
              </div>
            </div>
            <div className="card-body space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">SEO Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                  <input type="text" name={lang === "en" ? "seoTitleEn" : "seoTitleKa"} className="input-base" defaultValue={f("seoTitleEn", "seoTitleKa")} />
                  <input type="hidden" name={lang === "en" ? "seoTitleKa" : "seoTitleEn"} value={lang === "en" ? (p.seoTitleKa ?? "") : (p.seoTitleEn ?? "")} />
                </div>
                <div>
                  <label className="label-base">OG Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                  <input type="text" name={lang === "en" ? "ogTitleEn" : "ogTitleKa"} className="input-base" defaultValue={f("ogTitleEn", "ogTitleKa")} />
                  <input type="hidden" name={lang === "en" ? "ogTitleKa" : "ogTitleEn"} value={lang === "en" ? (p.ogTitleKa ?? "") : (p.ogTitleEn ?? "")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-base">Meta Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                  <textarea name={lang === "en" ? "metaDescriptionEn" : "metaDescriptionKa"} className="input-base" rows={2} defaultValue={f("metaDescriptionEn", "metaDescriptionKa")} />
                  <input type="hidden" name={lang === "en" ? "metaDescriptionKa" : "metaDescriptionEn"} value={lang === "en" ? (p.metaDescriptionKa ?? "") : (p.metaDescriptionEn ?? "")} />
                </div>
                <div>
                  <label className="label-base">OG Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                  <textarea name={lang === "en" ? "ogDescriptionEn" : "ogDescriptionKa"} className="input-base" rows={2} defaultValue={f("ogDescriptionEn", "ogDescriptionKa")} />
                  <input type="hidden" name={lang === "en" ? "ogDescriptionKa" : "ogDescriptionEn"} value={lang === "en" ? (p.ogDescriptionKa ?? "") : (p.ogDescriptionEn ?? "")} />
                </div>
              </div>
              <OgImageUpload existing={p.ogImage} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
