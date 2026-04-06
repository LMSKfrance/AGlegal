"use client";

import Link from "next/link";
import { useActionState, useState, useRef, useEffect } from "react";
import { useAdminLang } from "../AdminLangContext";
import type { TeamFormState } from "@/lib/actions/team";
import OgImageUpload from "../OgImageUpload";
import RichTextEditor from "../components/RichTextEditor";

type Social = { platform: string; link: string };

type Member = {
  id: number;
  slug: string;
  titleEn: string;
  titleKa: string | null;
  positionEn: string | null;
  positionKa: string | null;
  descriptionEn: string | null;
  descriptionKa: string | null;
  quoteEn: string | null;
  quoteKa: string | null;
  text1En: string | null;
  text1Ka: string | null;
  text2En: string | null;
  text2Ka: string | null;
  image: string | null;
  imagePosition: string | null;
  published: number | null;
  showOnHome: number | null;
  homeOrder: number | null;
  metaDescriptionEn: string | null;
  metaDescriptionKa: string | null;
  seoTitleEn: string | null;
  seoTitleKa: string | null;
  ogTitleEn: string | null;
  ogTitleKa: string | null;
  ogDescriptionEn: string | null;
  ogDescriptionKa: string | null;
  ogImage: string | null;
  socials: Social[];
};

type Props = {
  action: (prev: TeamFormState, formData: FormData) => Promise<TeamFormState>;
  member?: Member;
};

const INITIAL: TeamFormState = {};

export default function TeamForm({ action, member }: Props) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [hasSaved, setHasSaved] = useState(false);
  const lang = useAdminLang();
  const [imagePreview, setImagePreview] = useState<string | null>(
    member?.image ?? null
  );
  const [imagePosition, setImagePosition] = useState<string>(
    member?.imagePosition ?? "top"
  );
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      setHasSaved(true);
      window.location.href = "/admin/team";
    }
  }, [state.success]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  const linkedinUrl = member?.socials?.find((s) => s.platform === "linkedin")?.link ?? "";
  const twitterUrl = member?.socials?.find((s) => s.platform === "twitter")?.link ?? "";

  return (
    <form action={formAction} className="relative bg-white flex flex-col min-h-full">
      <div className="border-b border-brand-200 px-4 sm:px-8 py-4 flex items-center gap-4 bg-brand-50">
        <Link href="/admin/team" className="btn-icon bg-white border border-brand-200 shadow-sm">
          <i className="ph ph-arrow-left" />
        </Link>
        <h1 className="text-xl font-bold text-brand-900">{member ? "Edit Team Member" : "Add Team Member"}</h1>
        <input type="hidden" name="published" value={member?.published ?? 1} />
      </div>

      {state.error && (
        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5 sm:p-8 max-w-4xl mx-auto w-full space-y-8 pb-24">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
          {/* Photo */}
          <div className="w-48 shrink-0">
            <label className="label-base">Profile Photo</label>

            {/* Upload zone with hover-to-change overlay */}
            <div
              className="file-upload-zone w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden relative group"
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition:
                        imagePosition === "bottom" ? "bottom center" :
                        imagePosition === "center" ? "center" : "top center"
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                    <i className="ph ph-camera-rotate text-white text-2xl" />
                    <span className="text-white text-[11px] font-medium">Change Photo</span>
                  </div>
                </>
              ) : (
                <>
                  <i className="ph ph-camera text-3xl text-brand-400" />
                  <span className="text-[12px] font-medium text-brand-600">Upload Photo</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Focus point */}
            <div className="mt-3">
              <label className="label-base">Focus Point</label>
              <input type="hidden" name="imagePosition" value={imagePosition} />
              <div className="inline-flex w-full bg-brand-100 rounded-lg p-0.5 border border-brand-200 gap-0.5">
                {(["top", "center", "bottom"] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => setImagePosition(pos)}
                    className={`flex-1 text-center capitalize text-[12px] font-medium py-1.5 px-2 rounded-md transition-all ${
                      imagePosition === pos
                        ? "bg-white text-brand-900 shadow-sm border border-brand-200 font-semibold"
                        : "text-brand-500 hover:text-brand-700"
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base required">Name {lang === "en" ? "(En)" : "(ქარ)"}</label>
                {lang === "en" ? (
                  <input type="text" name="titleEn" className="input-base" placeholder="Full name" defaultValue={member?.titleEn ?? ""} required />
                ) : (
                  <>
                    <input type="hidden" name="titleEn" value={member?.titleEn ?? ""} />
                    <input type="text" name="titleKa" className="input-base" placeholder="Full name (Georgian)" defaultValue={member?.titleKa ?? ""} />
                  </>
                )}
              </div>
              <div>
                <label className="label-base">Position {lang === "en" ? "(En)" : "(ქარ)"}</label>
                {lang === "en" ? (
                  <input key="pos-en" type="text" name="positionEn" className="input-base" placeholder="e.g. Managing Partner" defaultValue={member?.positionEn ?? ""} />
                ) : (
                  <input key="pos-ka" type="text" name="positionKa" className="input-base" placeholder="Position (Georgian)" defaultValue={member?.positionKa ?? ""} />
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 p-4 bg-brand-50 rounded-lg border border-brand-200">
              <div className="flex items-center justify-between gap-4 min-w-[180px]">
                <span className="text-[14px] font-semibold text-brand-900">Show on Homepage</span>
                <label className="toggle-switch">
                  <input type="checkbox" name="showOnHome" defaultChecked={!!member?.showOnHome} />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="flex-1 border-l border-brand-200 pl-6 flex items-center gap-4">
                <label className="label-base !mb-0">Display Order</label>
                <input type="number" name="homeOrder" className="input-base w-24" defaultValue={member?.homeOrder ?? 1} min={0} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 border-t border-brand-200 pt-8">
          <div>
            <label className="label-base">Bio {lang === "en" ? "(En)" : "(ქარ)"}</label>
            <p className="text-[11px] text-brand-400 mb-2">Paragraphs, <strong>bold</strong>, <em>italic</em> and links are supported.</p>
            {lang === "en" ? (
              <RichTextEditor
                key={`bio-en-${member?.id ?? "new"}`}
                name="text1En"
                defaultValue={member?.text1En ?? ""}
                placeholder="Write biography… use Enter for a new paragraph, Shift+Enter for a line break."
              />
            ) : (
              <RichTextEditor
                key={`bio-ka-${member?.id ?? "new"}`}
                name="text1Ka"
                defaultValue={member?.text1Ka ?? ""}
                placeholder="Biography (Georgian)…"
              />
            )}
          </div>
          {/* Keep hidden inputs so the server action receives all expected fields */}
          <input type="hidden" name="descriptionEn" value={member?.descriptionEn ?? ""} />
          <input type="hidden" name="descriptionKa" value={member?.descriptionKa ?? ""} />
          <input type="hidden" name="quoteEn" value={member?.quoteEn ?? ""} />
          <input type="hidden" name="quoteKa" value={member?.quoteKa ?? ""} />
          <input type="hidden" name="text2En" value={member?.text2En ?? ""} />
          <input type="hidden" name="text2Ka" value={member?.text2Ka ?? ""} />
          {/* Preserve inactive-language values so they aren't overwritten on save */}
          {lang === "en" ? (
            <>
              <input type="hidden" name="titleKa" value={member?.titleKa ?? ""} />
              <input type="hidden" name="positionKa" value={member?.positionKa ?? ""} />
              <input type="hidden" name="text1Ka" value={member?.text1Ka ?? ""} />
              <input type="hidden" name="seoTitleKa" value={member?.seoTitleKa ?? ""} />
              <input type="hidden" name="ogTitleKa" value={member?.ogTitleKa ?? ""} />
              <input type="hidden" name="metaDescriptionKa" value={member?.metaDescriptionKa ?? ""} />
              <input type="hidden" name="ogDescriptionKa" value={member?.ogDescriptionKa ?? ""} />
            </>
          ) : (
            <>
              {/* titleEn is already preserved near the name input above */}
              <input type="hidden" name="positionEn" value={member?.positionEn ?? ""} />
              <input type="hidden" name="text1En" value={member?.text1En ?? ""} />
              <input type="hidden" name="seoTitleEn" value={member?.seoTitleEn ?? ""} />
              <input type="hidden" name="ogTitleEn" value={member?.ogTitleEn ?? ""} />
              <input type="hidden" name="metaDescriptionEn" value={member?.metaDescriptionEn ?? ""} />
              <input type="hidden" name="ogDescriptionEn" value={member?.ogDescriptionEn ?? ""} />
            </>
          )}
        </div>

        <div className="space-y-5 border-t border-brand-200 pt-8 bg-brand-50 -mx-8 px-8 py-8 rounded-b-xl">
          <h3 className="font-semibold text-brand-900 text-[15px]">Social Profiles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="label-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn URL
              </label>
              <input
                type="url"
                name="linkedinUrl"
                className="input-base bg-white"
                placeholder="https://linkedin.com/in/..."
                defaultValue={linkedinUrl}
              />
            </div>
            <div>
              <label className="label-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-brand-500">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter) URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                className="input-base bg-white"
                placeholder="https://x.com/..."
                defaultValue={twitterUrl}
              />
            </div>
          </div>
        </div>

        {/* SEO & Open Graph */}
        <div className="card">
          <div className="card-header py-4 bg-brand-50">
            <h3 className="font-semibold text-brand-900 text-[14px]">
              <i className="ph ph-magnifying-glass mr-2 text-brand-500" /> SEO &amp; Open Graph {lang === "en" ? "(En)" : "(ქარ)"}
            </h3>
          </div>
          <div className="card-body space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base">SEO Title</label>
                {lang === "en"
                  ? <input type="text" name="seoTitleEn" className="input-base" defaultValue={member?.seoTitleEn ?? ""} />
                  : <input type="text" name="seoTitleKa" className="input-base" defaultValue={member?.seoTitleKa ?? ""} />}
              </div>
              <div>
                <label className="label-base">OG Title</label>
                {lang === "en"
                  ? <input type="text" name="ogTitleEn" className="input-base" defaultValue={member?.ogTitleEn ?? ""} />
                  : <input type="text" name="ogTitleKa" className="input-base" defaultValue={member?.ogTitleKa ?? ""} />}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="label-base">Meta Description</label>
                {lang === "en"
                  ? <textarea name="metaDescriptionEn" className="input-base" rows={2} defaultValue={member?.metaDescriptionEn ?? ""} />
                  : <textarea name="metaDescriptionKa" className="input-base" rows={2} defaultValue={member?.metaDescriptionKa ?? ""} />}
              </div>
              <div>
                <label className="label-base">OG Description</label>
                {lang === "en"
                  ? <textarea name="ogDescriptionEn" className="input-base" rows={2} defaultValue={member?.ogDescriptionEn ?? ""} />
                  : <textarea name="ogDescriptionKa" className="input-base" rows={2} defaultValue={member?.ogDescriptionKa ?? ""} />}
              </div>
            </div>
            <div>
              <OgImageUpload
                existing={member?.ogImage ?? null}
                fallback={member?.image ?? null}
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
          <Link href="/admin/team" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? (
              <><i key="spinner" className="ph ph-spinner animate-spin" /> Saving...</>
            ) : (
              <><i key="save" className="ph ph-floppy-disk" /> {member ? "Save Changes" : "Save Profile"}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
