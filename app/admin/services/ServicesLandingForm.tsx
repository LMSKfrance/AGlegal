"use client";

import { useActionState } from "react";
import { useAdminLang } from "../AdminLangContext";
import OgImageUpload from "../OgImageUpload";
import type { ServicesPageFormState } from "@/lib/actions/services";

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

const INITIAL: ServicesPageFormState = {};

export default function ServicesLandingForm({
  page,
  saveAction,
}: {
  page: PageRecord;
  saveAction: (_prev: ServicesPageFormState, fd: FormData) => Promise<ServicesPageFormState>;
}) {
  const [heroState, heroFormAction, heroPending] = useActionState(saveAction, INITIAL);
  const [seoState, seoFormAction, seoPending] = useActionState(saveAction, INITIAL);
  const lang = useAdminLang();

  const p = page ?? {
    titleEn: "", titleKa: null, contentEn: null, contentKa: null,
    metaDescriptionEn: null, metaDescriptionKa: null, seoTitleEn: null, seoTitleKa: null,
    ogTitleEn: null, ogTitleKa: null, ogDescriptionEn: null, ogDescriptionKa: null, ogImage: null,
  };

  const f = (enKey: keyof typeof p, kaKey: keyof typeof p) =>
    (lang === "en" ? p[enKey] : p[kaKey]) as string ?? "";

  function Preserved({ skip }: { skip: string[] }) {
    const allKeys: [string, string, keyof typeof p, keyof typeof p][] = [
      ["titleEn", "titleKa", "titleEn", "titleKa"],
      ["contentEn", "contentKa", "contentEn", "contentKa"],
      ["seoTitleEn", "seoTitleKa", "seoTitleEn", "seoTitleKa"],
      ["ogTitleEn", "ogTitleKa", "ogTitleEn", "ogTitleKa"],
      ["metaDescriptionEn", "metaDescriptionKa", "metaDescriptionEn", "metaDescriptionKa"],
      ["ogDescriptionEn", "ogDescriptionKa", "ogDescriptionEn", "ogDescriptionKa"],
    ];
    return (
      <>
        {allKeys
          .filter(([en, ka]) => !skip.includes(en) && !skip.includes(ka))
          .flatMap(([en, ka, enKey, kaKey]) => [
            <input key={en} type="hidden" name={en} value={(p[enKey] as string) ?? ""} />,
            <input key={ka} type="hidden" name={ka} value={(p[kaKey] as string) ?? ""} />,
          ])}
      </>
    );
  }

  return (
    <>
      {/* ─── Landing Page Content ──────────────────────────────── */}
      <div className="px-8 pt-7 pb-8 border-b border-brand-100">
        <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest mb-6">
          Landing Page Content
        </h2>
        <form action={heroFormAction}>
          <Preserved skip={["titleEn", "titleKa", "contentEn", "contentKa"]} />
          <div className="max-w-4xl ml-0">
            <div className="card">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
                <div className="text-[13px] font-semibold text-brand-900">Page Title &amp; Intro</div>
                <div className="flex items-center gap-2">
                  {heroState.error && <span className="text-[11px] text-red-600 font-medium">{heroState.error}</span>}
                  {heroState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                  <button type="submit" className="btn-save" disabled={heroPending} title="Save">
                    {heroPending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
                  </button>
                </div>
              </div>
              <div className="card-body space-y-5">
                <div>
                  <label className="label-base">Page Title {lang === "en" ? "(EN)" : "(ქარ)"} <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    name={lang === "en" ? "titleEn" : "titleKa"}
                    className="input-base"
                    placeholder="Our Practice Areas"
                    defaultValue={f("titleEn", "titleKa")}
                  />
                  <input type="hidden" name={lang === "en" ? "titleKa" : "titleEn"} value={lang === "en" ? (p.titleKa ?? "") : p.titleEn} />
                </div>
                <div>
                  <label className="label-base">Intro Text {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                  <textarea
                    name={lang === "en" ? "contentEn" : "contentKa"}
                    className="input-base"
                    rows={3}
                    defaultValue={f("contentEn", "contentKa")}
                  />
                  <input type="hidden" name={lang === "en" ? "contentKa" : "contentEn"} value={lang === "en" ? (p.contentKa ?? "") : (p.contentEn ?? "")} />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ─── SEO & Open Graph ─────────────────────────────────── */}
      <div className="px-8 pt-7 pb-10 border-b border-brand-100">
        <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest mb-6">
          SEO &amp; Open Graph
        </h2>
        <form action={seoFormAction}>
          <Preserved skip={["seoTitleEn", "seoTitleKa", "ogTitleEn", "ogTitleKa", "metaDescriptionEn", "metaDescriptionKa", "ogDescriptionEn", "ogDescriptionKa"]} />
          <div className="max-w-4xl ml-0">
            <div className="card">
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
                <div className="text-[13px] font-semibold text-brand-900">SEO &amp; Open Graph</div>
                <div className="flex items-center gap-2">
                  {seoState.error && <span className="text-[11px] text-red-600 font-medium">{seoState.error}</span>}
                  {seoState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                  <button type="submit" className="btn-save" disabled={seoPending} title="Save SEO">
                    {seoPending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
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
    </>
  );
}
