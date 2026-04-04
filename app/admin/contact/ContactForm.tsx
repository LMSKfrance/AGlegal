"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useAdminLang } from "../AdminLangContext";
import OgImageUpload from "../OgImageUpload";
import type { ContactFormState, ContactSeoFormState } from "@/lib/actions/contact";

type ContactRow = {
  id: number;
  titleEn: string | null;
  titleKa: string | null;
  subtitleEn: string | null;
  subtitleKa: string | null;
  addressEn: string | null;
  addressKa: string | null;
  email: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  mapEmbedUrl: string | null;
};

type SeoPage = {
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

type Props = {
  contact: ContactRow | null;
  saveAction: (prev: ContactFormState, formData: FormData) => Promise<ContactFormState>;
  seoPage: SeoPage;
  saveSeoAction: (prev: ContactSeoFormState, formData: FormData) => Promise<ContactSeoFormState>;
  formVisible: boolean;
  setFormVisibleAction: (visible: boolean) => Promise<void>;
};

const INITIAL_CONTACT: ContactFormState = {};
const INITIAL_SEO: ContactSeoFormState = {};

export default function ContactForm({ contact, saveAction, seoPage, saveSeoAction, formVisible, setFormVisibleAction }: Props) {
  const [showForm, setShowForm] = useState(formVisible);
  const [formTogglePending, setFormTogglePending] = useState(false);
  const [state, formAction, pending] = useActionState(saveAction, INITIAL_CONTACT);
  const [seoState, seoFormAction, seoPending] = useActionState(saveSeoAction, INITIAL_SEO);
  const [hasSaved, setHasSaved] = useState(false);
  const [saveKey, setSaveKey] = useState(0);
  const prevPendingRef = useRef(false);
  const prevSeoPendingRef = useRef(false);
  const lang = useAdminLang();
  const contactFormRef = useRef<HTMLFormElement>(null);

  if (state.success && !hasSaved) setHasSaved(true);

  useEffect(() => {
    if (!pending && prevPendingRef.current && !state.error) setSaveKey((k) => k + 1);
    prevPendingRef.current = pending;
  }, [pending, state.error]);

  useEffect(() => {
    if (!seoPending && prevSeoPendingRef.current && !seoState.error) setSaveKey((k) => k + 1);
    prevSeoPendingRef.current = seoPending;
  }, [seoPending, seoState.error]);

  const formKey = `${lang}-${saveKey}`;

  const sp = seoPage ?? {
    titleEn: "Contact", titleKa: null, contentEn: null, contentKa: null,
    metaDescriptionEn: null, metaDescriptionKa: null, seoTitleEn: null, seoTitleKa: null,
    ogTitleEn: null, ogTitleKa: null, ogDescriptionEn: null, ogDescriptionKa: null, ogImage: null,
  };

  const seoField = (enKey: keyof typeof sp, kaKey: keyof typeof sp) =>
    (lang === "en" ? sp[enKey] : sp[kaKey]) as string ?? "";

  const L = lang === "en" ? "(EN)" : "(ქარ)";

  return (
    <>
      <div className="page-content space-y-6 pb-24 pt-6">

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="pb-6 pt-8 border-b border-brand-200">
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Contact</h1>
          <p className="text-brand-500 mt-2">Manage contact details, social links, map, and page SEO.</p>
        </div>

        {/* ── Contact Details ──────────────────────────────────────── */}
        <form id="contact-settings-form" ref={contactFormRef} action={formAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-envelope text-primary-600" /> Contact Details
              </h2>
            </div>
            <div key={formKey} className="card-body space-y-8">
              {state.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{state.error}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-base">Page Title {L}</label>
                  {lang === "en" ? (
                    <>
                      <input type="text" name="titleEn" className="input-base" placeholder="Get in Touch" defaultValue={contact?.titleEn ?? ""} />
                      <input type="hidden" name="titleKa" value={contact?.titleKa ?? ""} />
                    </>
                  ) : (
                    <>
                      <input type="text" name="titleKa" className="input-base" placeholder="Get in Touch (Georgian)" defaultValue={contact?.titleKa ?? ""} />
                      <input type="hidden" name="titleEn" value={contact?.titleEn ?? ""} />
                    </>
                  )}
                </div>
                <div>
                  <label className="label-base">Subtitle {L}</label>
                  {lang === "en" ? (
                    <>
                      <textarea name="subtitleEn" className="input-base !h-[38px] !min-h-0 py-2" rows={1} placeholder="Our team is ready to assist you." defaultValue={contact?.subtitleEn ?? ""} />
                      <input type="hidden" name="subtitleKa" value={contact?.subtitleKa ?? ""} />
                    </>
                  ) : (
                    <>
                      <textarea name="subtitleKa" className="input-base !h-[38px] !min-h-0 py-2" rows={1} placeholder="Our team is ready to assist you. (Georgian)" defaultValue={contact?.subtitleKa ?? ""} />
                      <input type="hidden" name="subtitleEn" value={contact?.subtitleEn ?? ""} />
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-base">Primary Email</label>
                  <input type="email" name="email" className="input-base" placeholder="info@aglegal.com" defaultValue={contact?.email ?? ""} />
                </div>
                <div>
                  <label className="label-base">Address {L}</label>
                  {lang === "en" ? (
                    <>
                      <textarea name="addressEn" className="input-base" rows={3} placeholder={"12 Rustaveli Avenue, Floor 4\nTbilisi 0108, Georgia"} defaultValue={contact?.addressEn ?? ""} />
                      <input type="hidden" name="addressKa" value={contact?.addressKa ?? ""} />
                    </>
                  ) : (
                    <>
                      <textarea name="addressKa" className="input-base" rows={3} placeholder="Address (Georgian)" defaultValue={contact?.addressKa ?? ""} />
                      <input type="hidden" name="addressEn" value={contact?.addressEn ?? ""} />
                    </>
                  )}
                </div>
                <div>
                  <label className="label-base">Primary Phone</label>
                  <input type="text" name="phone" className="input-base" placeholder="+995 32 2 123 456" defaultValue={contact?.phone ?? ""} />
                </div>
                <div>
                  <label className="label-base">Secondary Phone</label>
                  <input type="text" name="secondaryPhone" className="input-base" defaultValue={contact?.secondaryPhone ?? ""} />
                </div>
              </div>

              <div>
                <div className="text-[13px] font-semibold text-brand-800 mb-4">Social Media URLs</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="label-base">LinkedIn URL</label>
                    <input type="text" name="linkedinUrl" className="input-base" placeholder="https://linkedin.com/company/..." defaultValue={contact?.linkedinUrl ?? ""} />
                  </div>
                  <div>
                    <label className="label-base">Facebook URL</label>
                    <input type="text" name="facebookUrl" className="input-base" placeholder="https://facebook.com/..." defaultValue={contact?.facebookUrl ?? ""} />
                  </div>
                  <div>
                    <label className="label-base">X (Twitter) URL</label>
                    <input type="text" name="xUrl" className="input-base" defaultValue={contact?.xUrl ?? ""} />
                  </div>
                  <div>
                    <label className="label-base">Instagram URL</label>
                    <input type="text" name="instagramUrl" className="input-base" defaultValue={contact?.instagramUrl ?? ""} />
                  </div>
                </div>
              </div>

              <div>
                <label className="label-base">Google Maps Embed Code (iframe src URL)</label>
                <textarea name="mapEmbedUrl" className="input-base font-mono text-[13px] bg-[#fbfcfd]" rows={3}
                  placeholder="https://www.google.com/maps/embed?pb=..." defaultValue={contact?.mapEmbedUrl ?? ""} />
              </div>
            </div>
          </div>
        </form>

        {/* ── Feedback Form Visibility ─────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-paper-plane-tilt text-primary-600" /> Feedback Form
              </h2>
              <p className="text-[12px] text-brand-400 mt-0.5">Show or hide the contact form on the page.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <i className={`ph ph-eye text-[18px] transition-colors ${showForm ? "text-primary-600" : "text-brand-300"}`} />
              <label className={`toggle-switch${formTogglePending ? " opacity-50" : ""}`}>
                <input
                  type="checkbox"
                  checked={showForm}
                  disabled={formTogglePending}
                  onChange={async () => {
                    const next = !showForm;
                    setShowForm(next);
                    setFormTogglePending(true);
                    await setFormVisibleAction(next);
                    setFormTogglePending(false);
                  }}
                />
                <span className="toggle-slider" />
              </label>
              <span className="text-[12px] text-brand-500 font-medium">{showForm ? "Visible" : "Hidden"}</span>
            </div>
          </div>
        </div>

        {/* ── SEO & Open Graph ─────────────────────────────────────── */}
        <form action={seoFormAction}>
          <input type="hidden" name="titleEn" value={sp.titleEn} />
          <input type="hidden" name="titleKa" value={sp.titleKa ?? ""} />
          <input type="hidden" name="contentEn" value={sp.contentEn ?? ""} />
          <input type="hidden" name="contentKa" value={sp.contentKa ?? ""} />
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-magnifying-glass text-primary-600" /> Contact Page SEO &amp; Open Graph
              </h2>
              <div className="flex items-center gap-2">
                {seoState.error && <span className="text-[11px] text-red-600 font-medium">{seoState.error}</span>}
                {seoState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                <button type="submit" className="btn-save" disabled={seoPending} title="Save SEO">
                  {seoPending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
                </button>
              </div>
            </div>
            <div key={formKey} className="card-body space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-base">SEO Title {L}</label>
                  <input type="text" name={lang === "en" ? "seoTitleEn" : "seoTitleKa"} className="input-base"
                    defaultValue={seoField("seoTitleEn", "seoTitleKa")} />
                  <input type="hidden" name={lang === "en" ? "seoTitleKa" : "seoTitleEn"}
                    value={lang === "en" ? (sp.seoTitleKa ?? "") : (sp.seoTitleEn ?? "")} />
                </div>
                <div>
                  <label className="label-base">OG Title {L}</label>
                  <input type="text" name={lang === "en" ? "ogTitleEn" : "ogTitleKa"} className="input-base"
                    defaultValue={seoField("ogTitleEn", "ogTitleKa")} />
                  <input type="hidden" name={lang === "en" ? "ogTitleKa" : "ogTitleEn"}
                    value={lang === "en" ? (sp.ogTitleKa ?? "") : (sp.ogTitleEn ?? "")} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-base">Meta Description {L}</label>
                  <textarea name={lang === "en" ? "metaDescriptionEn" : "metaDescriptionKa"} className="input-base" rows={2}
                    defaultValue={seoField("metaDescriptionEn", "metaDescriptionKa")} />
                  <input type="hidden" name={lang === "en" ? "metaDescriptionKa" : "metaDescriptionEn"}
                    value={lang === "en" ? (sp.metaDescriptionKa ?? "") : (sp.metaDescriptionEn ?? "")} />
                </div>
                <div>
                  <label className="label-base">OG Description {L}</label>
                  <textarea name={lang === "en" ? "ogDescriptionEn" : "ogDescriptionKa"} className="input-base" rows={2}
                    defaultValue={seoField("ogDescriptionEn", "ogDescriptionKa")} />
                  <input type="hidden" name={lang === "en" ? "ogDescriptionKa" : "ogDescriptionEn"}
                    value={lang === "en" ? (sp.ogDescriptionKa ?? "") : (sp.ogDescriptionEn ?? "")} />
                </div>
              </div>
              <OgImageUpload existing={sp.ogImage} />
            </div>
          </div>
        </form>

      </div>

      {/* ── Sticky Action Bar — LAST element, outside page-content ─── */}
      <div className="action-bar">
        <div className="text-[12px] flex items-center gap-1.5">
          {state.error ? (
            <><span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" /><span className="text-red-600 font-medium truncate max-w-xs">{state.error}</span></>
          ) : pending ? (
            <><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 inline-block animate-pulse" /><span className="text-brand-500 font-medium">Saving…</span></>
          ) : hasSaved ? (
            <><span className="w-2 h-2 rounded-full bg-green-500 shrink-0 inline-block" /><span className="text-brand-500">Contact info saved</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-brand-300 shrink-0 inline-block" /><span className="text-brand-400">You have not made any changes</span></>
          )}
        </div>
        <div className="flex gap-3">
          <button type="reset" form="contact-settings-form" className="btn btn-secondary">Discard Changes</button>
          <button type="submit" form="contact-settings-form" className="btn btn-primary" disabled={pending}>
            {pending
              ? <><i className="ph ph-spinner animate-spin" /> Saving...</>
              : <><i className="ph ph-floppy-disk" /> Save Contact Info</>}
          </button>
        </div>
      </div>
    </>
  );
}
