"use client";

import { useActionState, useState } from "react";
import type { ContactFormState } from "@/lib/actions/contact";

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

type Props = {
  contact: ContactRow | null;
  saveAction: (prev: ContactFormState, formData: FormData) => Promise<ContactFormState>;
};

const INITIAL: ContactFormState = {};

export default function ContactForm({ contact, saveAction }: Props) {
  const [state, formAction, pending] = useActionState(saveAction, INITIAL);
  const [lang, setLang] = useState<"en" | "ka">("en");

  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Contact Information</h1>
          <p className="text-brand-500 mt-2">Global contact details and social media links.</p>
        </div>
        <div className="lang-switcher">
          <div className={`lang-tab${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</div>
          <div className={`lang-tab${lang === "ka" ? " active" : ""}`} onClick={() => setLang("ka")}>KA</div>
        </div>
      </div>

      <form action={formAction}>
        <div className="page-content space-y-6 pb-40 max-w-4xl mx-auto ml-0 pt-6">
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{state.error}</div>
          )}
          {state.success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Contact settings saved successfully.</div>
          )}

          <div className="card">
            <div className="card-body space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <label className="label-base">Page Title {lang === "en" ? "(EN)" : "(KA)"}</label>
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
                  <label className="label-base">Subtitle {lang === "en" ? "(EN)" : "(KA)"}</label>
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

              <hr className="border-brand-200" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <label className="label-base">Primary Email</label>
                  <input type="email" name="email" className="input-base" placeholder="info@aglegal.com" defaultValue={contact?.email ?? ""} />
                </div>
                <div>
                  <label className="label-base">Address {lang === "en" ? "(EN)" : "(KA)"}</label>
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

              <hr className="border-brand-200" />
              <h3 className="font-semibold text-brand-900 text-[15px]">Social Media URLs</h3>
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

              <hr className="border-brand-200" />
              <div>
                <label className="label-base">Google Maps Embed Code (iframe src URL)</label>
                <textarea name="mapEmbedUrl" className="input-base font-mono text-[13px] bg-[#fbfcfd]" rows={3} placeholder="https://www.google.com/maps/embed?pb=..." defaultValue={contact?.mapEmbedUrl ?? ""} />
              </div>
            </div>
          </div>
        </div>

        <div className="action-bar">
          <div className="text-[12px] text-brand-500 flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="bg-brand-100 px-1.5 py-0.5 rounded font-mono text-[10px] text-brand-700">⌘S</kbd> Save
            </span>
          </div>
          <div className="flex gap-3">
            <button type="reset" className="btn btn-secondary">Discard Changes</button>
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Contact Info</>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
