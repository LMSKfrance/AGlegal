"use client";

import { useActionState, useState, useRef, useTransition } from "react";
import { setHomeSectionVisible } from "@/lib/actions/home";
import type {
  HomeFormState,
  HomeHeroSettings,
  HomeAboutSettings,
  HomeSectionHeadingsSettings,
} from "@/lib/actions/home";
import type { HomeBenefit, HomeProcessStep } from "@/lib/db/schema";
import type { HomeSectionId, HomeSectionVisibility } from "@/lib/home";
import HomeBenefitsSection from "./HomeBenefitsSection";
import HomeProcessSection from "./HomeProcessSection";

type Props = {
  heroAction: (prev: HomeFormState, formData: FormData) => Promise<HomeFormState>;
  aboutAction: (prev: HomeFormState, formData: FormData) => Promise<HomeFormState>;
  headingsAction: (prev: HomeFormState, formData: FormData) => Promise<HomeFormState>;
  hero: HomeHeroSettings;
  about: HomeAboutSettings;
  headings: HomeSectionHeadingsSettings;
  benefits: HomeBenefit[];
  processSteps: HomeProcessStep[];
  visibility: HomeSectionVisibility;
};

const INITIAL: HomeFormState = {};

function SectionToggle({
  sectionId,
  initialValue,
}: {
  sectionId: HomeSectionId;
  initialValue: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [on, setOn] = useState(initialValue);

  function toggle() {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      await setHomeSectionVisible(sectionId, next);
    });
  }

  return (
    <label className={`toggle-switch shrink-0${pending ? " opacity-50" : ""}`}>
      <input type="checkbox" checked={on} onChange={toggle} disabled={pending} />
      <span className="toggle-slider" />
    </label>
  );
}

export default function HomeForm({
  heroAction,
  aboutAction,
  headingsAction,
  hero,
  about,
  headings,
  benefits,
  processSteps,
  visibility,
}: Props) {
  const [heroState, heroFormAction, heroPending] = useActionState(heroAction, INITIAL);
  const [aboutState, aboutFormAction, aboutPending] = useActionState(aboutAction, INITIAL);
  const [headingsState, headingsFormAction, headingsPending] = useActionState(headingsAction, INITIAL);
  const [lang, setLang] = useState<"en" | "ka">("en");
  const heroImgRef = useRef<HTMLInputElement>(null);
  const aboutImgRef = useRef<HTMLInputElement>(null);
  const [heroImgPreview, setHeroImgPreview] = useState<string | null>(hero.image ? `/api/images/${hero.image}` : null);
  const [aboutImgPreview, setAboutImgPreview] = useState<string | null>(about.image ? `/api/images/${about.image}` : null);

  return (
    <>
      <div className="page-header border-b border-brand-200 sticky top-0 bg-[#f8fafc]/95 backdrop-blur z-10 pb-6 pt-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">Homepage Manager</h1>
        <div className="lang-switcher">
          <div className={`lang-tab${lang === "en" ? " active" : ""}`} onClick={() => setLang("en")}>EN</div>
          <div className={`lang-tab${lang === "ka" ? " active" : ""}`} onClick={() => setLang("ka")}>KA</div>
        </div>
      </div>

      <div className="page-content space-y-6 pb-24 pt-6">

        {/* ── Hero Section ────────────────────────────────────────────────── */}
        <form action={heroFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-monitor text-primary-600" /> Hero Banner
              </h2>
              <SectionToggle sectionId="hero" initialValue={visibility.hero} />
            </div>
            <div className="card-body space-y-6">
              {heroState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{heroState.error}</div>
              )}
              {heroState.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Hero section saved successfully.</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                <input ref={heroImgRef} type="file" name="heroImage" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setHeroImgPreview(URL.createObjectURL(f)); }} />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={heroPending}>
                  {heroPending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Hero</>}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* ── Who We Are ──────────────────────────────────────────────────── */}
        <form action={aboutFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-users-three text-primary-600" /> Who We Are
              </h2>
              <SectionToggle sectionId="about" initialValue={visibility.about} />
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
                <input ref={aboutImgRef} type="file" name="aboutImage" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) setAboutImgPreview(URL.createObjectURL(f)); }} />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={aboutPending}>
                  {aboutPending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Who We Are</>}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* ── Section Headings ─────────────────────────────────────────────── */}
        <form action={headingsFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-text-aa text-primary-600" /> Section Headings
              </h2>
            </div>
            <div className="card-body space-y-6">
              {headingsState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{headingsState.error}</div>
              )}
              {headingsState.success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Section headings saved.</div>
              )}

              {/* Services */}
              <div>
                <div className="text-[12px] font-bold text-brand-400 uppercase tracking-wider mb-3">Our Services Section</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="label-base">Title (EN)</label>
                    <input type="text" name="servicesTitleEn" className="input-base" defaultValue={headings.servicesTitleEn} />
                  </div>
                  <div>
                    <label className="label-base">Title (KA)</label>
                    <input type="text" name="servicesTitleKa" className="input-base" defaultValue={headings.servicesTitleKa} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Subtitle (EN)</label>
                    <textarea name="servicesDescriptionEn" className="input-base" rows={2} defaultValue={headings.servicesDescriptionEn} />
                  </div>
                  <div>
                    <label className="label-base">Subtitle (KA)</label>
                    <textarea name="servicesDescriptionKa" className="input-base" rows={2} defaultValue={headings.servicesDescriptionKa} />
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-100" />

              {/* Benefits */}
              <div>
                <div className="text-[12px] font-bold text-brand-400 uppercase tracking-wider mb-3">Why Work With Us Section</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Title (EN)</label>
                    <input type="text" name="benefitsTitleEn" className="input-base" defaultValue={headings.benefitsTitleEn} />
                  </div>
                  <div>
                    <label className="label-base">Title (KA)</label>
                    <input type="text" name="benefitsTitleKa" className="input-base" defaultValue={headings.benefitsTitleKa} />
                  </div>
                </div>
              </div>

              <div className="border-t border-brand-100" />

              {/* Process */}
              <div>
                <div className="text-[12px] font-bold text-brand-400 uppercase tracking-wider mb-3">How We Work Section</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="label-base">Title (EN)</label>
                    <input type="text" name="processTitleEn" className="input-base" defaultValue={headings.processTitleEn} />
                  </div>
                  <div>
                    <label className="label-base">Title (KA)</label>
                    <input type="text" name="processTitleKa" className="input-base" defaultValue={headings.processTitleKa} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Subtitle (EN)</label>
                    <textarea name="processDescriptionEn" className="input-base" rows={2} defaultValue={headings.processDescriptionEn} />
                  </div>
                  <div>
                    <label className="label-base">Subtitle (KA)</label>
                    <textarea name="processDescriptionKa" className="input-base" rows={2} defaultValue={headings.processDescriptionKa} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary" disabled={headingsPending}>
                  {headingsPending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Headings</>}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* ── Benefits (Why Work With Us) ──────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-star text-primary-600" /> Why Work With Us
              <span className="text-[11px] font-normal text-brand-400 ml-1">(max 4 cards)</span>
            </h2>
            <SectionToggle sectionId="benefits" initialValue={visibility.benefits} />
          </div>
          <div className="card-body">
            <HomeBenefitsSection initialBenefits={benefits} lang={lang} />
          </div>
        </div>

        {/* ── Process Steps (How We Work) ──────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-arrows-clockwise text-primary-600" /> How We Work
              <span className="text-[11px] font-normal text-brand-400 ml-1">(max 4 steps)</span>
            </h2>
            <SectionToggle sectionId="process" initialValue={visibility.process} />
          </div>
          <div className="card-body">
            <HomeProcessSection initialSteps={processSteps} lang={lang} />
          </div>
        </div>

        {/* ── News & CTA Visibility ─────────────────────────────────────────── */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-eye text-primary-600" /> Section Visibility
            </h2>
          </div>
          <div className="card-body space-y-0 divide-y divide-brand-100">
            {[
              { id: "services" as HomeSectionId, label: "Our Services", icon: "ph-briefcase" },
              { id: "team" as HomeSectionId, label: "Meet the Team", icon: "ph-users" },
              { id: "news" as HomeSectionId, label: "Latest News", icon: "ph-newspaper" },
              { id: "cta" as HomeSectionId, label: "Call to Action", icon: "ph-megaphone" },
            ].map(({ id, label, icon }) => (
              <div key={id} className="flex items-center justify-between px-1 py-4">
                <div className="flex items-center gap-3">
                  <i className={`ph ${icon} text-[18px] text-brand-500`} />
                  <span className="text-[14px] font-medium text-brand-900">{label}</span>
                </div>
                <SectionToggle sectionId={id} initialValue={visibility[id]} />
              </div>
            ))}
            <div className="pt-4">
              <div className="flex items-start gap-2 p-3 bg-brand-50 rounded-lg text-[12px] text-brand-500">
                <i className="ph ph-info text-[16px] shrink-0 mt-0.5" />
                <span>Hero, Who We Are, Benefits, and Process visibility are managed in their respective sections above.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
