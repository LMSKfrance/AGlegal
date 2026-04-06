"use client";

import Link from "next/link";
import { useActionState, useState, useEffect, useRef } from "react";
import { useAdminLang } from "../AdminLangContext";
import type { PageFormState } from "@/lib/actions/pages";
import OgImageUpload from "../OgImageUpload";

type Page = {
  id: number;
  slug: string;
  titleEn: string;
  titleKa: string | null;
  contentEn: string | null;
  contentKa: string | null;
  seoTitleEn: string | null;
  seoTitleKa: string | null;
  ogTitleEn: string | null;
  ogTitleKa: string | null;
  metaDescriptionEn: string | null;
  metaDescriptionKa: string | null;
  ogDescriptionEn: string | null;
  ogDescriptionKa: string | null;
  ogImage: string | null;
  heroImage?: string | null;
  ctaTextEn?: string | null;
  ctaTextKa?: string | null;
  ctaUrl?: string | null;
};

type Props = {
  action: (prev: PageFormState, formData: FormData) => Promise<PageFormState>;
  page?: Page;
};

const INITIAL: PageFormState = {};

export default function PageForm({ action, page }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [hasSaved, setHasSaved] = useState(false);
  const lang = useAdminLang();
  const heroImgRef = useRef<HTMLInputElement>(null);
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(page?.heroImage ?? null);
  const [heroImgRemoved, setHeroImgRemoved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setHasSaved(true);
      window.location.href = "/admin/pages";
    }
  }, [state.success]);

  return (
    <form action={formAction} className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-4 sm:px-8 py-4 flex items-center gap-4 bg-brand-50">
        <Link href="/admin/pages" className="btn-icon bg-white border border-brand-200 shadow-sm">
          <i className="ph ph-arrow-left" />
        </Link>
        <h1 className="text-xl font-bold text-brand-900">{page ? "Edit Page" : "Create Page"}</h1>
      </div>

      {state.error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <label className="label-base required">Page Title {lang === "en" ? "(En)" : "(ქარ)"}</label>
            {lang === "en" ? (
              <input type="text" name="titleEn" className="input-base" placeholder="e.g. Privacy Policy" defaultValue={page?.titleEn ?? ""} required />
            ) : (
              <input type="text" name="titleKa" className="input-base" placeholder="Page title (Georgian)" defaultValue={page?.titleKa ?? ""} />
            )}
          </div>
          <div>
            <label className="label-base required">URL Slug</label>
            <div className="flex items-center">
              <span className="px-4 bg-brand-50 border border-r-0 border-brand-200 rounded-l-lg h-[38px] flex items-center text-brand-500 font-mono text-[13px]">/</span>
              <input
                type="text"
                name="slug"
                className="input-base !rounded-l-none"
                placeholder="privacy-policy"
                defaultValue={page?.slug ?? ""}
                required
              />
            </div>
          </div>
        </div>

        <div className="md-editor-wrap">
          <div className="md-toolbar">
            <span className="text-[11px] font-bold text-brand-400 uppercase tracking-wider px-2">
              Page Content (Markdown) {lang === "en" ? "— En" : "— ქარ"}
            </span>
          </div>
          {lang === "en" ? (
            <textarea
              name="contentEn"
              className="input-base w-full p-6 font-mono text-[14px] leading-relaxed min-h-[300px] bg-[#fbfcfd]"
              rows={12}
              placeholder={"# Page Title\n\nContent goes here..."}
              defaultValue={page?.contentEn ?? ""}
            />
          ) : (
            <textarea
              name="contentKa"
              className="input-base w-full p-6 font-mono text-[14px] leading-relaxed min-h-[300px] bg-[#fbfcfd]"
              rows={12}
              placeholder={"# გვერდის სათაური\n\nშინაარსი..."}
              defaultValue={page?.contentKa ?? ""}
            />
          )}
        </div>

        <div className="card">
          <div className="card-header py-4 bg-brand-50">
            <h3 className="font-semibold text-brand-900 text-[14px]">
              <i className="ph ph-image mr-2 text-brand-500" /> Hero Image &amp; CTA Button
            </h3>
          </div>
          <div className="card-body space-y-5">
            <div>
              <label className="label-base">Hero Image <span className="text-[10px] text-brand-400 font-normal ml-1">(optional — shown above page content)</span></label>
              <div
                className="file-upload-zone flex flex-col items-center justify-center gap-3 h-40 cursor-pointer overflow-hidden"
                onClick={() => heroImgRef.current?.click()}
              >
                {heroImgPreview && !heroImgRemoved ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={heroImgPreview} alt="hero" className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                      <i className="ph ph-upload-simple text-xl text-brand-500" />
                    </div>
                    <span className="text-[13px] text-brand-500 font-medium">Upload hero image</span>
                  </>
                )}
              </div>
              {heroImgPreview && !heroImgRemoved && (
                <button
                  type="button"
                  className="mt-1 text-[11px] text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => { setHeroImgRemoved(true); setHeroImgPreview(null); if (heroImgRef.current) heroImgRef.current.value = ""; }}
                >
                  Remove image
                </button>
              )}
              <input
                ref={heroImgRef}
                type="file"
                name="heroImage"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setHeroImgPreview(URL.createObjectURL(f)); setHeroImgRemoved(false); }
                }}
              />
              {heroImgRemoved && <input type="hidden" name="removeHeroImage" value="1" />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="label-base">CTA Button Text {lang === "en" ? "(En)" : "(ქარ)"} <span className="text-[10px] text-brand-400 font-normal ml-1">(optional)</span></label>
                {lang === "en" ? (
                  <>
                    <input type="text" name="ctaTextEn" className="input-base" placeholder="Learn More" defaultValue={page?.ctaTextEn ?? ""} />
                    <input type="hidden" name="ctaTextKa" value={page?.ctaTextKa ?? ""} />
                  </>
                ) : (
                  <>
                    <input type="text" name="ctaTextKa" className="input-base" placeholder="გაიგე მეტი" defaultValue={page?.ctaTextKa ?? ""} />
                    <input type="hidden" name="ctaTextEn" value={page?.ctaTextEn ?? ""} />
                  </>
                )}
              </div>
              <div>
                <label className="label-base">CTA Button URL <span className="text-[10px] text-brand-400 font-normal ml-1">(optional)</span></label>
                <input type="text" name="ctaUrl" className="input-base" placeholder="/contact" defaultValue={page?.ctaUrl ?? ""} />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header py-4 bg-brand-50">
            <h3 className="font-semibold text-brand-900 text-[14px]">
              <i className="ph ph-magnifying-glass mr-2 text-brand-500" /> SEO &amp; Open Graph Data {lang === "en" ? "(En)" : "(ქარ)"}
            </h3>
          </div>
          <div className="card-body space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base">SEO Title</label>
                {lang === "en" ? (
                  <input type="text" name="seoTitleEn" className="input-base" defaultValue={page?.seoTitleEn ?? ""} />
                ) : (
                  <input type="text" name="seoTitleKa" className="input-base" defaultValue={page?.seoTitleKa ?? ""} />
                )}
              </div>
              <div>
                <label className="label-base">OG Title</label>
                {lang === "en" ? (
                  <input type="text" name="ogTitleEn" className="input-base" defaultValue={page?.ogTitleEn ?? ""} />
                ) : (
                  <input type="text" name="ogTitleKa" className="input-base" defaultValue={page?.ogTitleKa ?? ""} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base">Meta Description</label>
                {lang === "en" ? (
                  <textarea name="metaDescriptionEn" className="input-base" rows={2} defaultValue={page?.metaDescriptionEn ?? ""} />
                ) : (
                  <textarea name="metaDescriptionKa" className="input-base" rows={2} defaultValue={page?.metaDescriptionKa ?? ""} />
                )}
              </div>
              <div>
                <label className="label-base">OG Description</label>
                {lang === "en" ? (
                  <textarea name="ogDescriptionEn" className="input-base" rows={2} defaultValue={page?.ogDescriptionEn ?? ""} />
                ) : (
                  <textarea name="ogDescriptionKa" className="input-base" rows={2} defaultValue={page?.ogDescriptionKa ?? ""} />
                )}
              </div>
            </div>
            <div>
              <OgImageUpload
                existing={page?.ogImage ?? null}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="action-bar">
        <div className="text-[12px] flex items-center gap-1.5">
          {state.error ? (
            <><span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" /><span className="text-red-600 font-medium truncate max-w-xs">{state.error}</span></>
          ) : pending ? (
            <><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 inline-block animate-pulse" /><span className="text-brand-500 font-medium">Saving…</span></>
          ) : hasSaved ? (
            <><span className="w-2 h-2 rounded-full bg-green-500 shrink-0 inline-block" /><span className="text-brand-500">All changes saved</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-brand-300 shrink-0 inline-block" /><span className="text-brand-400">You have not made any changes</span></>
          )}
        </div>
        <div className="flex gap-3">
          <Link href="/admin/pages" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? (
              <><i key="spinner" className="ph ph-spinner animate-spin" /> Saving...</>
            ) : (
              <><i key="save" className="ph ph-globe" /> {page ? "Save Changes" : "Publish Page"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
