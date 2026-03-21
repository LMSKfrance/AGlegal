"use client";

import { useActionState, useState, useRef } from "react";
import type { HomeFormState, HomeHeroSettings, HomeAboutSettings } from "@/lib/actions/home";

type Props = {
  heroAction: (prev: HomeFormState, formData: FormData) => Promise<HomeFormState>;
  aboutAction: (prev: HomeFormState, formData: FormData) => Promise<HomeFormState>;
  hero: HomeHeroSettings;
  about: HomeAboutSettings;
};

const INITIAL: HomeFormState = {};

export default function HomeForm({ heroAction, aboutAction, hero, about }: Props) {
  const [heroState, heroFormAction, heroPending] = useActionState(heroAction, INITIAL);
  const [aboutState, aboutFormAction, aboutPending] = useActionState(aboutAction, INITIAL);
  const [lang, setLang] = useState<"en" | "ka">("en");
  const heroImgRef = useRef<HTMLInputElement>(null);
  const aboutImgRef = useRef<HTMLInputElement>(null);
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(hero.image ? `/api/images/${hero.image}` : null);
  const [aboutImgPreview, setAboutImgPreview] = useState<string | null>(about.image ? `/api/images/${about.image}` : null);

  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <div>
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Homepage Manager</h1>
          <p className="text-brand-500 mt-2">Configure sections and layout for the main landing page.</p>
        </div>
        <div className="lang-switcher">
          <div className={`lang-tab${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</div>
          <div className={`lang-tab${lang === "ka" ? " active" : ""}`} onClick={() => setLang("ka")}>KA</div>
        </div>
      </div>

      <div className="page-content space-y-6 pb-24 pt-6">
        {/* Hero Section */}
        <form action={heroFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-monitor text-primary-600" /> Hero Section
              </h2>
            </div>
            <div className="card-body space-y-6">
              {heroState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{heroState.error}</div>
              )}
              {heroState.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Hero section saved successfully.</div>
              )}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label-base">Brand Label <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 40)</span></label>
                  <input type="text" name={lang === "en" ? "brandEn" : "brandKa"} className="input-base" placeholder="AG Legal" maxLength={40} defaultValue={lang === "en" ? hero.brandEn : hero.brandKa} />
                  {lang === "ka" && <input type="hidden" name="brandEn" value={hero.brandEn} />}
                  {lang === "en" && <input type="hidden" name="brandKa" value={hero.brandKa} />}
                </div>
                <div>
                  <label className="label-base">CTA Button Label <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 24)</span></label>
                  <input type="text" name={lang === "en" ? "ctaEn" : "ctaKa"} className="input-base" placeholder="Get Free Consultation" maxLength={24} defaultValue={lang === "en" ? hero.ctaEn : hero.ctaKa} />
                  {lang === "ka" && <input type="hidden" name="ctaEn" value={hero.ctaEn} />}
                  {lang === "en" && <input type="hidden" name="ctaKa" value={hero.ctaKa} />}
                </div>
              </div>
              <div>
                <label className="label-base required">Main Title <span className="text-[10px] text-brand-400 font-normal ml-2">(EN required, Max 80)</span></label>
                <textarea name={lang === "en" ? "titleEn" : "titleKa"} className="input-base" rows={2} maxLength={80} placeholder="Leading Corporate Law Firm in Georgia" defaultValue={lang === "en" ? hero.titleEn : hero.titleKa} />
                {lang === "ka" && <input type="hidden" name="titleEn" value={hero.titleEn} />}
                {lang === "en" && <input type="hidden" name="titleKa" value={hero.titleKa} />}
              </div>
              <div>
                <label className="label-base">Description <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 180)</span></label>
                <textarea name={lang === "en" ? "descriptionEn" : "descriptionKa"} className="input-base" rows={3} maxLength={180} defaultValue={lang === "en" ? hero.descriptionEn : hero.descriptionKa} />
                {lang === "ka" && <input type="hidden" name="descriptionEn" value={hero.descriptionEn} />}
                {lang === "en" && <input type="hidden" name="descriptionKa" value={hero.descriptionKa} />}
              </div>
              <div>
                <label className="label-base">Hero Background Image</label>
                <div
                  className="file-upload-zone flex flex-col items-center justify-center gap-3 h-40 cursor-pointer overflow-hidden"
                  onClick={() => heroImgRef.current?.click()}
                >
                  {heroImgPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={heroImgPreview} alt="hero" className="h-full w-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                        <i className="ph ph-upload-simple text-xl text-brand-500" />
                      </div>
                      <span className="text-[12px] font-medium text-brand-600">Drop image here or click to browse</span>
                      <span className="text-[11px] text-brand-400">Shared between EN/KA</span>
                    </>
                  )}
                </div>
                <input
                  ref={heroImgRef}
                  type="file"
                  name="heroImage"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setHeroImgPreview(URL.createObjectURL(f)); }}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={heroPending}>
                  {heroPending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Hero</>}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Who We Are */}
        <form action={aboutFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-users-three text-primary-600" /> Who We Are Section
              </h2>
            </div>
            <div className="card-body space-y-6">
              {aboutState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{aboutState.error}</div>
              )}
              {aboutState.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Who We Are section saved successfully.</div>
              )}
              <div>
                <label className="label-base required">Section Title <span className="text-[10px] text-brand-400 font-normal ml-2">(EN required, Max 60)</span></label>
                <input type="text" name={lang === "en" ? "titleEn" : "titleKa"} className="input-base" maxLength={60} placeholder="Excellence in Legal Practice" defaultValue={lang === "en" ? about.titleEn : about.titleKa} />
                {lang === "ka" && <input type="hidden" name="titleEn" value={about.titleEn} />}
                {lang === "en" && <input type="hidden" name="titleKa" value={about.titleKa} />}
              </div>
              <div>
                <label className="label-base">Body Text <span className="text-[10px] text-brand-400 font-normal ml-2">(Max 260)</span></label>
                <textarea name={lang === "en" ? "descriptionEn" : "descriptionKa"} className="input-base" rows={4} maxLength={260} defaultValue={lang === "en" ? about.descriptionEn : about.descriptionKa} />
                {lang === "ka" && <input type="hidden" name="descriptionEn" value={about.descriptionEn} />}
                {lang === "en" && <input type="hidden" name="descriptionKa" value={about.descriptionKa} />}
              </div>
              <div>
                <label className="label-base">Background Image (Optional)</label>
                <div
                  className="file-upload-zone p-6 flex flex-col items-center gap-2 cursor-pointer overflow-hidden"
                  onClick={() => aboutImgRef.current?.click()}
                >
                  {aboutImgPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={aboutImgPreview} alt="about" className="h-32 w-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                        <i className="ph ph-upload-simple text-xl text-brand-500" />
                      </div>
                      <span className="text-[12px] font-medium text-brand-600">Drop image here or click to browse</span>
                    </>
                  )}
                </div>
                <input
                  ref={aboutImgRef}
                  type="file"
                  name="aboutImage"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setAboutImgPreview(URL.createObjectURL(f)); }}
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={aboutPending}>
                  {aboutPending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Who We Are</>}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
