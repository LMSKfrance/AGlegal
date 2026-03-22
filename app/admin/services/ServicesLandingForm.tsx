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
  section = "all",
}: {
  page: PageRecord;
  saveAction: (_prev: ServicesPageFormState, fd: FormData) => Promise<ServicesPageFormState>;
  section?: "content" | "seo" | "all";
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

  const L = lang === "en" ? "(EN)" : "(ქარ)";

  return (
    <>
      {/* ── Landing Page Content card ─────────────────────────────── */}
      {(section === "all" || section === "content") && <form action={heroFormAction}>
        {/* Preserve SEO fields so hero save doesn't wipe them */}
        <input type="hidden" name="seoTitleEn" value={p.seoTitleEn ?? ""} />
        <input type="hidden" name="seoTitleKa" value={p.seoTitleKa ?? ""} />
        <input type="hidden" name="ogTitleEn" value={p.ogTitleEn ?? ""} />
        <input type="hidden" name="ogTitleKa" value={p.ogTitleKa ?? ""} />
        <input type="hidden" name="metaDescriptionEn" value={p.metaDescriptionEn ?? ""} />
        <input type="hidden" name="metaDescriptionKa" value={p.metaDescriptionKa ?? ""} />
        <input type="hidden" name="ogDescriptionEn" value={p.ogDescriptionEn ?? ""} />
        <input type="hidden" name="ogDescriptionKa" value={p.ogDescriptionKa ?? ""} />
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-article text-primary-600" /> Landing Page Content
            </h2>
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
              <label className="label-base">Page Title {L} <span className="text-red-400">*</span></label>
              <input
                type="text"
                name={lang === "en" ? "titleEn" : "titleKa"}
                className="input-base"
                placeholder="Our Practice Areas"
                defaultValue={f("titleEn", "titleKa")}
              />
              <input type="hidden" name={lang === "en" ? "titleKa" : "titleEn"}
                value={lang === "en" ? (p.titleKa ?? "") : p.titleEn} />
            </div>
            <div>
              <label className="label-base">Intro Text {L}</label>
              <textarea
                name={lang === "en" ? "contentEn" : "contentKa"}
                className="input-base"
                rows={3}
                defaultValue={f("contentEn", "contentKa")}
              />
              <input type="hidden" name={lang === "en" ? "contentKa" : "contentEn"}
                value={lang === "en" ? (p.contentKa ?? "") : (p.contentEn ?? "")} />
            </div>
          </div>
        </div>
      </form>

      {/* ── SEO & Open Graph card ──────────────────────────────────── */}
      {(section === "all" || section === "seo") && <form action={seoFormAction}>
        {/* Preserve hero fields so SEO save doesn't wipe them */}
        <input type="hidden" name="titleEn" value={p.titleEn} />
        <input type="hidden" name="titleKa" value={p.titleKa ?? ""} />
        <input type="hidden" name="contentEn" value={p.contentEn ?? ""} />
        <input type="hidden" name="contentKa" value={p.contentKa ?? ""} />
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-magnifying-glass text-primary-600" /> Services Page SEO &amp; Open Graph
            </h2>
            <div className="flex items-center gap-2">
              {seoState.error && <span className="text-[11px] text-red-600 font-medium">{seoState.error}</span>}
              {seoState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
              <button type="submit" className="btn-save" disabled={seoPending} title="Save SEO">
                {seoPending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
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
      </form>}
    </>
  );
}
