"use client";

import { useActionState, useState, useEffect } from "react";
import type { AboutSectionSettings } from "@/lib/about";
import { useAdminLang } from "../AdminLangContext";
import OgImageUpload from "../OgImageUpload";
import FaqEditor from "./FaqEditor";

type FormState = { success?: boolean; error?: string };

type PageRecord = {
  id: number;
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

type FaqRow = {
  id: number;
  questionEn: string;
  questionKa: string | null;
  answerEn: string;
  answerKa: string | null;
  sortOrder: number | null;
};

type Props = {
  settings: AboutSectionSettings;
  saveSettingsAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
  visibilityAction: (formData: FormData) => Promise<void>;
  page: PageRecord;
  saveHeroAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
  faqs: FaqRow[];
};

const INITIAL: FormState = {};

function SectionToggle({
  on,
  name,
  visibilityAction,
}: {
  on: boolean;
  name: string;
  visibilityAction: (fd: FormData) => Promise<void>;
}) {
  const [checked, setChecked] = useState(on);
  const [pending, setPending] = useState(false);

  async function toggle() {
    const next = !checked;
    setChecked(next);
    setPending(true);
    const fd = new FormData();
    fd.set("sectionId", name);
    fd.set("visible", next ? "1" : "0");
    await visibilityAction(fd);
    setPending(false);
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <i className={`ph ph-eye text-[18px] transition-colors ${checked ? "text-primary-600" : "text-brand-300"}`} />
      <label className={`toggle-switch${pending ? " opacity-50" : ""}`}>
        <input type="checkbox" checked={checked} onChange={toggle} disabled={pending} />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

export default function AboutForm({ settings, saveSettingsAction, visibilityAction, page, saveHeroAction, faqs }: Props) {
  const [heroState, heroFormAction, heroPending] = useActionState(saveHeroAction, INITIAL);
  const [settingsState, settingsFormAction, settingsPending] = useActionState(saveSettingsAction, INITIAL);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const lang = useAdminLang();

  useEffect(() => { if (settingsState.success) setSettingsSaved(true); }, [settingsState.success]);

  function field<T extends object>(obj: T, enKey: keyof T, kaKey: keyof T) {
    return lang === "en" ? (obj[enKey] as string) ?? "" : (obj[kaKey] as string) ?? "";
  }

  function hidden<T extends object>(obj: T, enName: string, kaName: string, enKey: keyof T, kaKey: keyof T) {
    if (lang === "en") return <input type="hidden" name={kaName} value={(obj[kaKey] as string) ?? ""} />;
    return <input type="hidden" name={enName} value={(obj[enKey] as string) ?? ""} />;
  }

  const p = page ?? {
    id: 0, titleEn: "", titleKa: null, contentEn: null, contentKa: null,
    metaDescriptionEn: null, metaDescriptionKa: null, seoTitleEn: null, seoTitleKa: null,
    ogTitleEn: null, ogTitleKa: null, ogDescriptionEn: null, ogDescriptionKa: null, ogImage: null,
  };

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">About Page</h1>
        <p className="text-brand-500 mt-2">Manage hero content, section settings, FAQs, and SEO for the About page.</p>
      </div>

      <div className="page-content space-y-8 pb-20 max-w-4xl mx-auto ml-0 pt-6">

        {/* ─── Hero Content ─────────────────────────────────────────────── */}
        <div>
          <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest mb-3">Hero Content</h2>
          <form action={heroFormAction}>
            <div className="space-y-5">
              <div className="card">
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
                  <div className="text-[13px] font-semibold text-brand-900">Page Title &amp; Content</div>
                  <div className="flex items-center gap-2">
                    {heroState.error && <span className="text-[11px] text-red-600 font-medium">{heroState.error}</span>}
                    {heroState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                    <button type="submit" className="btn-save" disabled={heroPending} title="Save hero content">
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
                      placeholder="About the Firm"
                      defaultValue={field(p, "titleEn", "titleKa")}
                    />
                    {hidden(p, "titleEn", "titleKa", "titleEn", "titleKa")}
                  </div>
                  <div>
                    <label className="label-base">Intro Text / Content {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <textarea
                      name={lang === "en" ? "contentEn" : "contentKa"}
                      className="input-base"
                      rows={4}
                      defaultValue={field(p, "contentEn", "contentKa")}
                    />
                    {hidden(p, "contentEn", "contentKa", "contentEn", "contentKa")}
                  </div>
                </div>
              </div>

              {/* SEO / OG */}
              <div className="card">
                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-brand-100">
                  <div className="text-[13px] font-semibold text-brand-900">SEO &amp; Open Graph</div>
                </div>
                <div className="card-body space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-base">SEO Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                      <input
                        type="text"
                        name={lang === "en" ? "seoTitleEn" : "seoTitleKa"}
                        className="input-base"
                        placeholder="About AG Legal — Law Firm"
                        defaultValue={field(p, "seoTitleEn", "seoTitleKa")}
                      />
                      {hidden(p, "seoTitleEn", "seoTitleKa", "seoTitleEn", "seoTitleKa")}
                    </div>
                    <div>
                      <label className="label-base">OG Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                      <input
                        type="text"
                        name={lang === "en" ? "ogTitleEn" : "ogTitleKa"}
                        className="input-base"
                        defaultValue={field(p, "ogTitleEn", "ogTitleKa")}
                      />
                      {hidden(p, "ogTitleEn", "ogTitleKa", "ogTitleEn", "ogTitleKa")}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-base">Meta Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                      <textarea
                        name={lang === "en" ? "metaDescriptionEn" : "metaDescriptionKa"}
                        className="input-base"
                        rows={2}
                        defaultValue={field(p, "metaDescriptionEn", "metaDescriptionKa")}
                      />
                      {hidden(p, "metaDescriptionEn", "metaDescriptionKa", "metaDescriptionEn", "metaDescriptionKa")}
                    </div>
                    <div>
                      <label className="label-base">OG Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                      <textarea
                        name={lang === "en" ? "ogDescriptionEn" : "ogDescriptionKa"}
                        className="input-base"
                        rows={2}
                        defaultValue={field(p, "ogDescriptionEn", "ogDescriptionKa")}
                      />
                      {hidden(p, "ogDescriptionEn", "ogDescriptionKa", "ogDescriptionEn", "ogDescriptionKa")}
                    </div>
                  </div>
                  <OgImageUpload existing={p.ogImage} />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ─── Section Visibility & Content ─────────────────────────────── */}
        <div>
          <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest mb-3">Section Settings</h2>
          <form action={settingsFormAction}>
            <div className="space-y-5">
              {settingsState.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{settingsState.error}</div>
              )}

              {/* Key Numbers */}
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-brand-900 text-[15px]">Key Numbers Section</h3>
                  <SectionToggle on={settings.sectionVisibility.numbers} name="numbers" visibilityAction={visibilityAction} />
                </div>
                <div className="card-body space-y-5">
                  <div>
                    <label className="label-base">Section Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <input
                      type="text"
                      name={lang === "en" ? "numbersTitleEn" : "numbersTitleKa"}
                      className="input-base"
                      placeholder="Our Impact in Numbers"
                      defaultValue={field(settings, "numbersTitleEn", "numbersTitleKa")}
                    />
                    {hidden(settings, "numbersTitleEn", "numbersTitleKa", "numbersTitleEn", "numbersTitleKa")}
                  </div>
                  <div>
                    <label className="label-base">Section Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <textarea
                      name={lang === "en" ? "numbersDescriptionEn" : "numbersDescriptionKa"}
                      className="input-base"
                      rows={2}
                      defaultValue={field(settings, "numbersDescriptionEn", "numbersDescriptionKa")}
                    />
                    {hidden(settings, "numbersDescriptionEn", "numbersDescriptionKa", "numbersDescriptionEn", "numbersDescriptionKa")}
                  </div>
                </div>
              </div>

              {/* Our Mission */}
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-brand-900 text-[15px]">Our Mission Section</h3>
                  <SectionToggle on={settings.sectionVisibility.mission} name="mission" visibilityAction={visibilityAction} />
                </div>
                <div className="card-body space-y-5">
                  <div>
                    <label className="label-base">Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <input
                      type="text"
                      name={lang === "en" ? "missionTitleEn" : "missionTitleKa"}
                      className="input-base"
                      placeholder="Driven by Excellence"
                      defaultValue={field(settings, "missionTitleEn", "missionTitleKa")}
                    />
                    {hidden(settings, "missionTitleEn", "missionTitleKa", "missionTitleEn", "missionTitleKa")}
                  </div>
                  <div>
                    <label className="label-base">Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <textarea
                      name={lang === "en" ? "missionDescriptionEn" : "missionDescriptionKa"}
                      className="input-base"
                      rows={2}
                      defaultValue={field(settings, "missionDescriptionEn", "missionDescriptionKa")}
                    />
                    {hidden(settings, "missionDescriptionEn", "missionDescriptionKa", "missionDescriptionEn", "missionDescriptionKa")}
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-brand-900 text-[15px]">Core Features Section</h3>
                  <SectionToggle on={settings.sectionVisibility.features} name="features" visibilityAction={visibilityAction} />
                </div>
                <div className="card-body">
                  <div>
                    <label className="label-base">Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <input
                      type="text"
                      name={lang === "en" ? "featuresTitleEn" : "featuresTitleKa"}
                      className="input-base"
                      placeholder="What Sets Us Apart"
                      defaultValue={field(settings, "featuresTitleEn", "featuresTitleKa")}
                    />
                    {hidden(settings, "featuresTitleEn", "featuresTitleKa", "featuresTitleEn", "featuresTitleKa")}
                  </div>
                </div>
              </div>

              {/* Our Philosophy */}
              <div className="card">
                <div className="card-header">
                  <h3 className="font-semibold text-brand-900 text-[15px]">Our Philosophy Section</h3>
                  <SectionToggle on={settings.sectionVisibility.philosophy} name="philosophy" visibilityAction={visibilityAction} />
                </div>
                <div className="card-body space-y-5">
                  <div>
                    <label className="label-base">Title {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <input
                      type="text"
                      name={lang === "en" ? "philosophyTitleEn" : "philosophyTitleKa"}
                      className="input-base"
                      placeholder="A Client-First Approach"
                      defaultValue={field(settings, "philosophyTitleEn", "philosophyTitleKa")}
                    />
                    {hidden(settings, "philosophyTitleEn", "philosophyTitleKa", "philosophyTitleEn", "philosophyTitleKa")}
                  </div>
                  <div>
                    <label className="label-base">Description {lang === "en" ? "(EN)" : "(ქარ)"}</label>
                    <textarea
                      name={lang === "en" ? "philosophyDescriptionEn" : "philosophyDescriptionKa"}
                      className="input-base"
                      rows={2}
                      defaultValue={field(settings, "philosophyDescriptionEn", "philosophyDescriptionKa")}
                    />
                    {hidden(settings, "philosophyDescriptionEn", "philosophyDescriptionKa", "philosophyDescriptionEn", "philosophyDescriptionKa")}
                  </div>
                </div>
              </div>
            </div>

            <div className="action-bar mt-6">
              <div className="text-[12px] flex items-center gap-1.5">
                {settingsState.error ? (
                  <><span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" /><span className="text-red-600 font-medium truncate max-w-xs">{settingsState.error}</span></>
                ) : settingsPending ? (
                  <><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 inline-block animate-pulse" /><span className="text-brand-500 font-medium">Saving…</span></>
                ) : settingsSaved ? (
                  <><span className="w-2 h-2 rounded-full bg-green-500 shrink-0 inline-block" /><span className="text-brand-500">All changes saved</span></>
                ) : (
                  <><span className="w-2 h-2 rounded-full bg-brand-300 shrink-0 inline-block" /><span className="text-brand-400">You have not made any changes</span></>
                )}
              </div>
              <div className="flex gap-3">
                <button type="reset" className="btn btn-secondary">Discard Changes</button>
                <button type="submit" className="btn btn-primary" disabled={settingsPending}>
                  {settingsPending ? <><i className="ph ph-spinner animate-spin" /> Saving...</> : <><i className="ph ph-floppy-disk" /> Save Section Settings</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ─── FAQ Editor ───────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-brand-400 uppercase tracking-widest">FAQ Entries</h2>
            <SectionToggle on={settings.sectionVisibility.faq} name="faq" visibilityAction={visibilityAction} />
          </div>
          <FaqEditor initialFaqs={faqs} />
        </div>

      </div>
    </>
  );
}
