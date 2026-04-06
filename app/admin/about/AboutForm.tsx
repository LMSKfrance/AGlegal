"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import type { AboutSectionSettings } from "@/lib/about";
import { useAdminLang } from "../AdminLangContext";
import OgImageUpload from "../OgImageUpload";
import FaqEditor from "./FaqEditor";
import RichTextEditor from "../components/RichTextEditor";

function TabImageUpload({ label, fieldName, existing }: { label: string; fieldName: string; existing: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(existing || null);
  const [removed, setRemoved] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="label-base">{label}</label>
      <div
        className="file-upload-zone relative flex flex-col items-center justify-center cursor-pointer overflow-hidden"
        style={{ height: 130 }}
        onClick={() => fileRef.current?.click()}
      >
        {preview && !removed ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt={label} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full">
                Click to replace
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center mb-1.5">
              <i className="ph ph-image text-lg text-brand-500" />
            </div>
            <span className="text-[12px] font-medium text-brand-600">Upload image</span>
          </>
        )}
      </div>
      {preview && !removed && (
        <button
          type="button"
          className="text-[11px] text-red-500 hover:text-red-700 transition-colors text-left"
          onClick={() => { setRemoved(true); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
        >
          Remove image
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        name={fieldName}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) { setPreview(URL.createObjectURL(f)); setRemoved(false); }
        }}
      />
      {removed && <input type="hidden" name={`remove_${fieldName}`} value="1" />}
    </div>
  );
}

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

type TeamRow = {
  id: number;
  titleEn: string;
  titleKa: string | null;
  positionEn: string | null;
  image: string | null;
  showOnAbout: number | null;
  published: number | null;
};

type Props = {
  settings: AboutSectionSettings;
  saveSettingsAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
  visibilityAction: (formData: FormData) => Promise<void>;
  page: PageRecord;
  saveHeroAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
  saveMissionSectionAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
  savePhilosophySectionAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
  faqs: FaqRow[];
  teamMembers: TeamRow[];
  toggleAboutMemberAction: (id: number, show: boolean) => Promise<void>;
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

function SaveBtn({ pending }: { pending: boolean }) {
  return (
    <button type="submit" className="btn-save" disabled={pending} title="Save">
      {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
    </button>
  );
}

export default function AboutForm({ settings, saveSettingsAction, visibilityAction, page, saveHeroAction, saveMissionSectionAction, savePhilosophySectionAction, faqs, teamMembers, toggleAboutMemberAction }: Props) {
  const [heroState, heroFormAction, heroPending] = useActionState(saveHeroAction, INITIAL);
  const [seoState, seoFormAction, seoPending] = useActionState(saveHeroAction, INITIAL);
  const [missionState, missionFormAction, missionPending] = useActionState(saveMissionSectionAction, INITIAL);
  const [philosophyState, philosophyFormAction, philosophyPending] = useActionState(savePhilosophySectionAction, INITIAL);
  const [settingsState, settingsFormAction, settingsPending] = useActionState(saveSettingsAction, INITIAL);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [saveKey, setSaveKey] = useState(0);
  const lang = useAdminLang();
  const [aboutMembers, setAboutMembers] = useState(teamMembers);

  const anyPending = heroPending || missionPending || philosophyPending || settingsPending || seoPending;
  const prevAnyPendingRef = useRef(false);
  useEffect(() => {
    if (!anyPending && prevAnyPendingRef.current) setSaveKey((k) => k + 1);
    prevAnyPendingRef.current = anyPending;
  }, [anyPending]);

  const formKey = `${lang}-${saveKey}`;

  const p = page ?? {
    id: 0, titleEn: "", titleKa: null, contentEn: null, contentKa: null,
    metaDescriptionEn: null, metaDescriptionKa: null, seoTitleEn: null, seoTitleKa: null,
    ogTitleEn: null, ogTitleKa: null, ogDescriptionEn: null, ogDescriptionKa: null, ogImage: null,
  };

  // settingsSaved toast
  if (settingsState.success && !settingsSaved) setSettingsSaved(true);

  function field<T extends object>(obj: T, enKey: keyof T, kaKey: keyof T) {
    return lang === "en" ? (obj[enKey] as string) ?? "" : (obj[kaKey] as string) ?? "";
  }

  function hidden<T extends object>(obj: T, enName: string, kaName: string, enKey: keyof T, kaKey: keyof T) {
    if (lang === "en") return <input type="hidden" name={kaName} value={(obj[kaKey] as string) ?? ""} />;
    return <input type="hidden" name={enName} value={(obj[enKey] as string) ?? ""} />;
  }

  const L = lang === "en" ? "(EN)" : "(ქარ)";

  return (
    <>
      {/* All content inside page-content so layout matches homepage */}
      <div className="page-content space-y-6 pb-24 pt-6">

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="pb-6 pt-8 border-b border-brand-200">
          <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">About Page</h1>
          <p className="text-brand-500 mt-2">Manage hero content, section settings, FAQs, and SEO for the About page.</p>
        </div>

        {/* ── Hero Content ─────────────────────────────────────────── */}
        <form action={heroFormAction}>
          {/* Pass SEO/OG fields through so they aren't wiped on hero save */}
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
                <i className="ph ph-article text-primary-600" /> Page Title &amp; Content
              </h2>
              <div className="flex items-center gap-2">
                {heroState.error && <span className="text-[11px] text-red-600 font-medium">{heroState.error}</span>}
                {heroState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                <SaveBtn pending={heroPending} />
              </div>
            </div>
            <div key={formKey} className="card-body space-y-5">
              <div>
                <label className="label-base">Page Title {L} <span className="text-red-400">*</span></label>
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
                <label className="label-base">Intro Text / Content {L}</label>
                <textarea
                  name={lang === "en" ? "contentEn" : "contentKa"}
                  className="input-base"
                  rows={4}
                  defaultValue={field(p, "contentEn", "contentKa")}
                />
                {hidden(p, "contentEn", "contentKa", "contentEn", "contentKa")}
              </div>
              <div>
                <label className="label-base">CTA Button Text {L}</label>
                <input
                  type="text"
                  name={lang === "en" ? "heroCTAEn" : "heroCTAKa"}
                  className="input-base"
                  placeholder={lang === "en" ? "LEARN MORE" : "გაიგე მეტი"}
                  defaultValue={field(settings, "heroCTAEn", "heroCTAKa")}
                />
                {hidden(settings, "heroCTAEn", "heroCTAKa", "heroCTAEn", "heroCTAKa")}
              </div>
            </div>
          </div>
        </form>

        {/* ── Section Settings ─────────────────────────────────────── */}
        <div className="text-[13px] font-bold text-brand-400 uppercase tracking-widest pt-2">Section Settings</div>

        <form id="about-section-settings" action={settingsFormAction}>
          <div className="space-y-4">
            {settingsState.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{settingsState.error}</div>
            )}

            {/* Body Text */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                  <i className="ph ph-text-align-left text-primary-600" /> Body Text
                </h2>
                <div className="flex items-center gap-2">
                  {settingsState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                  <SaveBtn pending={settingsPending} />
                </div>
              </div>
              <div key={formKey} className="card-body space-y-3">
                <p className="text-[11px] text-brand-400">Shown below the Key Numbers section. Supports bold, italic, links, bullets.</p>
                {lang === "en" ? (
                  <>
                    <RichTextEditor
                      key={`body-en-${saveKey}`}
                      name="bodyEn"
                      defaultValue={settings.bodyEn}
                      placeholder="Write about page body text…"
                    />
                    <input type="hidden" name="bodyKa" value={settings.bodyKa} />
                  </>
                ) : (
                  <>
                    <RichTextEditor
                      key={`body-ka-${saveKey}`}
                      name="bodyKa"
                      defaultValue={settings.bodyKa}
                      placeholder="ტექსტი (ქართული)…"
                    />
                    <input type="hidden" name="bodyEn" value={settings.bodyEn} />
                  </>
                )}
              </div>
            </div>

            {/* Key Numbers */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                  <i className="ph ph-chart-bar text-primary-600" /> Key Numbers Section
                </h2>
                <SectionToggle on={settings.sectionVisibility.numbers} name="numbers" visibilityAction={visibilityAction} />
              </div>
              <div key={formKey} className="card-body space-y-5">
                <div>
                  <label className="label-base">Section Title {L}</label>
                  <input type="text" name={lang === "en" ? "numbersTitleEn" : "numbersTitleKa"} className="input-base"
                    placeholder="Our Impact in Numbers" defaultValue={field(settings, "numbersTitleEn", "numbersTitleKa")} />
                  {hidden(settings, "numbersTitleEn", "numbersTitleKa", "numbersTitleEn", "numbersTitleKa")}
                </div>
                <div>
                  <label className="label-base">Section Description {L}</label>
                  <textarea name={lang === "en" ? "numbersDescriptionEn" : "numbersDescriptionKa"} className="input-base" rows={2}
                    defaultValue={field(settings, "numbersDescriptionEn", "numbersDescriptionKa")} />
                  {hidden(settings, "numbersDescriptionEn", "numbersDescriptionKa", "numbersDescriptionEn", "numbersDescriptionKa")}
                </div>
                <div>
                  <label className="label-base text-brand-500">Stat Cards</label>
                  <div className="space-y-3 mt-2">
                    {([
                      { vName: "stat1Value", lEnName: "stat1LabelEn", lKaName: "stat1LabelKa", vKey: "stat1Value" as const, lEnKey: "stat1LabelEn" as const, lKaKey: "stat1LabelKa" as const, vph: "10,000+", lph: "Successful cases" },
                      { vName: "stat2Value", lEnName: "stat2LabelEn", lKaName: "stat2LabelKa", vKey: "stat2Value" as const, lEnKey: "stat2LabelEn" as const, lKaKey: "stat2LabelKa" as const, vph: "20+", lph: "Years of experience" },
                      { vName: "stat3Value", lEnName: "stat3LabelEn", lKaName: "stat3LabelKa", vKey: "stat3Value" as const, lEnKey: "stat3LabelEn" as const, lKaKey: "stat3LabelKa" as const, vph: "5,000+", lph: "Satisfied clients" },
                    ] as const).map((s, i) => (
                      <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-brand-50 rounded-lg">
                        <div>
                          <label className="label-base text-[11px]">Value (stat #{i + 1})</label>
                          <input type="text" name={s.vName} className="input-base" placeholder={s.vph}
                            defaultValue={settings[s.vKey]} />
                        </div>
                        <div>
                          <label className="label-base text-[11px]">Label {L}</label>
                          <input type="text" name={lang === "en" ? s.lEnName : s.lKaName} className="input-base"
                            placeholder={s.lph} defaultValue={lang === "en" ? settings[s.lEnKey] : settings[s.lKaKey]} />
                          {lang === "en"
                            ? <input type="hidden" name={s.lKaName} value={settings[s.lKaKey]} />
                            : <input type="hidden" name={s.lEnName} value={settings[s.lEnKey]} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Features */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                  <i className="ph ph-star text-primary-600" /> Core Features Section
                </h2>
                <SectionToggle on={settings.sectionVisibility.features} name="features" visibilityAction={visibilityAction} />
              </div>
              <div key={formKey} className="card-body space-y-5">
                <div>
                  <label className="label-base">Title {L}</label>
                  <input type="text" name={lang === "en" ? "featuresTitleEn" : "featuresTitleKa"} className="input-base"
                    placeholder="What Sets Us Apart" defaultValue={field(settings, "featuresTitleEn", "featuresTitleKa")} />
                  {hidden(settings, "featuresTitleEn", "featuresTitleKa", "featuresTitleEn", "featuresTitleKa")}
                </div>
                <div>
                  <label className="label-base text-brand-500">Feature Items</label>
                  <div className="space-y-3 mt-2">
                    {([
                      { tEnN: "featuresItem1TitleEn", tKaN: "featuresItem1TitleKa", dEnN: "featuresItem1DescEn", dKaN: "featuresItem1DescKa", tEnK: "featuresItem1TitleEn" as const, tKaK: "featuresItem1TitleKa" as const, dEnK: "featuresItem1DescEn" as const, dKaK: "featuresItem1DescKa" as const, ph: "Client-centered approach" },
                      { tEnN: "featuresItem2TitleEn", tKaN: "featuresItem2TitleKa", dEnN: "featuresItem2DescEn", dKaN: "featuresItem2DescKa", tEnK: "featuresItem2TitleEn" as const, tKaK: "featuresItem2TitleKa" as const, dEnK: "featuresItem2DescEn" as const, dKaK: "featuresItem2DescKa" as const, ph: "Proven track record" },
                      { tEnN: "featuresItem3TitleEn", tKaN: "featuresItem3TitleKa", dEnN: "featuresItem3DescEn", dKaN: "featuresItem3DescKa", tEnK: "featuresItem3TitleEn" as const, tKaK: "featuresItem3TitleKa" as const, dEnK: "featuresItem3DescEn" as const, dKaK: "featuresItem3DescKa" as const, ph: "Experienced legal team" },
                      { tEnN: "featuresItem4TitleEn", tKaN: "featuresItem4TitleKa", dEnN: "featuresItem4DescEn", dKaN: "featuresItem4DescKa", tEnK: "featuresItem4TitleEn" as const, tKaK: "featuresItem4TitleKa" as const, dEnK: "featuresItem4DescEn" as const, dKaK: "featuresItem4DescKa" as const, ph: "Commitment to ethical practice" },
                    ] as const).map((item, i) => (
                      <div key={i} className="p-3 bg-brand-50 rounded-lg space-y-2">
                        <div className="text-[11px] font-semibold text-brand-500">Item {i + 1} {L}</div>
                        <input type="text" name={lang === "en" ? item.tEnN : item.tKaN} className="input-base"
                          placeholder={item.ph}
                          defaultValue={lang === "en" ? settings[item.tEnK] : settings[item.tKaK]} />
                        {lang === "en"
                          ? <input type="hidden" name={item.tKaN} value={settings[item.tKaK]} />
                          : <input type="hidden" name={item.tEnN} value={settings[item.tEnK]} />}
                        <textarea name={lang === "en" ? item.dEnN : item.dKaN} className="input-base" rows={2}
                          placeholder="Description..."
                          defaultValue={lang === "en" ? settings[item.dEnK] : settings[item.dKaK]} />
                        {lang === "en"
                          ? <input type="hidden" name={item.dKaN} value={settings[item.dKaK]} />
                          : <input type="hidden" name={item.dEnN} value={settings[item.dEnK]} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>

        {/* ── Team Section ─────────────────────────────────────────── */}
        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-users text-primary-600" /> Team Section
            </h2>
            <SectionToggle on={settings.sectionVisibility.team} name="team" visibilityAction={visibilityAction} />
          </div>
          <div className="card-body space-y-3">
            <p className="text-[12px] text-brand-400">
              Toggle which members appear on the About page. Members shown here must also be <span className="font-semibold">Visible</span> in the Team directory.
            </p>
            {aboutMembers.length === 0 ? (
              <p className="text-[13px] text-brand-400 py-2">No team members found.</p>
            ) : (
              <div className="divide-y divide-brand-50">
                {aboutMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 py-2.5">
                    {m.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt={m.titleEn} className="w-8 h-8 rounded-[4px] object-cover shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-[4px] bg-brand-100 flex items-center justify-center shrink-0">
                        <i className="ph ph-user text-brand-400 text-[14px]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-brand-900 truncate">{m.titleEn}</div>
                      {m.positionEn && <div className="text-[11px] text-brand-400 truncate">{m.positionEn}</div>}
                    </div>
                    {!m.published && (
                      <span className="text-[10px] text-brand-300 font-medium shrink-0">hidden</span>
                    )}
                    <button
                      type="button"
                      title={m.showOnAbout ? "Remove from About page" : "Show on About page"}
                      onClick={() => {
                        const next = !m.showOnAbout;
                        setAboutMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, showOnAbout: next ? 1 : 0 } : x));
                        toggleAboutMemberAction(m.id, next);
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold transition-colors shrink-0 ${
                        m.showOnAbout
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-brand-100 text-brand-400 hover:bg-brand-200"
                      }`}
                    >
                      <i className={`ph ${m.showOnAbout ? "ph-eye" : "ph-eye-slash"} text-[12px]`} />
                      {m.showOnAbout ? "Shown" : "Hidden"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Our Mission (text + images combined) ─────────────────── */}
        <form action={missionFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-target text-primary-600" /> Our Mission Section
              </h2>
              <div className="flex items-center gap-2">
                {missionState.error && <span className="text-[11px] text-red-600 font-medium">{missionState.error}</span>}
                {missionState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                <SectionToggle on={settings.sectionVisibility.mission} name="mission" visibilityAction={visibilityAction} />
                <SaveBtn pending={missionPending} />
              </div>
            </div>
            <div key={formKey} className="card-body space-y-5">
              <div>
                <label className="label-base">Title {L}</label>
                <input type="text" name={lang === "en" ? "missionTitleEn" : "missionTitleKa"} className="input-base"
                  placeholder="Driven by Excellence" defaultValue={field(settings, "missionTitleEn", "missionTitleKa")} />
                {hidden(settings, "missionTitleEn", "missionTitleKa", "missionTitleEn", "missionTitleKa")}
              </div>
              <div>
                <label className="label-base">Description {L}</label>
                <textarea name={lang === "en" ? "missionDescriptionEn" : "missionDescriptionKa"} className="input-base" rows={2}
                  defaultValue={field(settings, "missionDescriptionEn", "missionDescriptionKa")} />
                {hidden(settings, "missionDescriptionEn", "missionDescriptionKa", "missionDescriptionEn", "missionDescriptionKa")}
              </div>
              <div>
                <label className="label-base text-brand-500">Tab Content</label>
                <p className="text-[12px] text-brand-400 mb-3">Title and description for each tab.</p>
                <div className="space-y-3">
                  {([
                    { titleEnName: "missionTab1TitleEn", titleKaName: "missionTab1TitleKa", descEnName: "missionTab1DescEn", descKaName: "missionTab1DescKa", titleEnKey: "missionTab1TitleEn" as const, titleKaKey: "missionTab1TitleKa" as const, descEnKey: "missionTab1DescEn" as const, descKaKey: "missionTab1DescKa" as const, label: "Tab 1" },
                    { titleEnName: "missionTab2TitleEn", titleKaName: "missionTab2TitleKa", descEnName: "missionTab2DescEn", descKaName: "missionTab2DescKa", titleEnKey: "missionTab2TitleEn" as const, titleKaKey: "missionTab2TitleKa" as const, descEnKey: "missionTab2DescEn" as const, descKaKey: "missionTab2DescKa" as const, label: "Tab 2" },
                    { titleEnName: "missionTab3TitleEn", titleKaName: "missionTab3TitleKa", descEnName: "missionTab3DescEn", descKaName: "missionTab3DescKa", titleEnKey: "missionTab3TitleEn" as const, titleKaKey: "missionTab3TitleKa" as const, descEnKey: "missionTab3DescEn" as const, descKaKey: "missionTab3DescKa" as const, label: "Tab 3" },
                  ] as const).map((tab, i) => (
                    <div key={i} className="p-3 bg-brand-50 rounded-lg space-y-2">
                      <div className="text-[11px] font-semibold text-brand-500">{tab.label} {L}</div>
                      <input type="text" name={lang === "en" ? tab.titleEnName : tab.titleKaName} className="input-base"
                        placeholder={["Integrity", "Compassion", "Expertise"][i]}
                        defaultValue={lang === "en" ? settings[tab.titleEnKey] : settings[tab.titleKaKey]} />
                      {lang === "en"
                        ? <input type="hidden" name={tab.titleKaName} value={settings[tab.titleKaKey]} />
                        : <input type="hidden" name={tab.titleEnName} value={settings[tab.titleEnKey]} />}
                      <textarea name={lang === "en" ? tab.descEnName : tab.descKaName} className="input-base" rows={2}
                        placeholder="Description..."
                        defaultValue={lang === "en" ? settings[tab.descEnKey] : settings[tab.descKaKey]} />
                      {lang === "en"
                        ? <input type="hidden" name={tab.descKaName} value={settings[tab.descKaKey]} />
                        : <input type="hidden" name={tab.descEnName} value={settings[tab.descEnKey]} />}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-base">Tab Images</label>
                <p className="text-[12px] text-brand-400 mb-3">Images shown when clicking each tab (Integrity, Compassion, Expertise).</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TabImageUpload label="Integrity" fieldName="tab1Image" existing={settings.missionTab1Image} />
                  <TabImageUpload label="Compassion" fieldName="tab2Image" existing={settings.missionTab2Image} />
                  <TabImageUpload label="Expertise" fieldName="tab3Image" existing={settings.missionTab3Image} />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ── Our Philosophy (text + images combined) ───────────────── */}
        <form action={philosophyFormAction}>
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-lightbulb text-primary-600" /> Our Philosophy Section
              </h2>
              <div className="flex items-center gap-2">
                {philosophyState.error && <span className="text-[11px] text-red-600 font-medium">{philosophyState.error}</span>}
                {philosophyState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                <SectionToggle on={settings.sectionVisibility.philosophy} name="philosophy" visibilityAction={visibilityAction} />
                <SaveBtn pending={philosophyPending} />
              </div>
            </div>
            <div key={formKey} className="card-body space-y-5">
              <div>
                <label className="label-base">Title {L}</label>
                <input type="text" name={lang === "en" ? "philosophyTitleEn" : "philosophyTitleKa"} className="input-base"
                  placeholder="A Client-First Approach" defaultValue={field(settings, "philosophyTitleEn", "philosophyTitleKa")} />
                {hidden(settings, "philosophyTitleEn", "philosophyTitleKa", "philosophyTitleEn", "philosophyTitleKa")}
              </div>
              <div>
                <label className="label-base">Description {L}</label>
                <textarea name={lang === "en" ? "philosophyDescriptionEn" : "philosophyDescriptionKa"} className="input-base" rows={2}
                  defaultValue={field(settings, "philosophyDescriptionEn", "philosophyDescriptionKa")} />
                {hidden(settings, "philosophyDescriptionEn", "philosophyDescriptionKa", "philosophyDescriptionEn", "philosophyDescriptionKa")}
              </div>
              <div>
                <label className="label-base">Value Card Images</label>
                <p className="text-[12px] text-brand-400 mb-3">Background images for the Integrity and Dedication cards.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TabImageUpload label="Integrity card" fieldName="card1Image" existing={settings.philosophyCard1Image} />
                  <TabImageUpload label="Dedication card" fieldName="card2Image" existing={settings.philosophyCard2Image} />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ── FAQ Entries ──────────────────────────────────────────── */}
        <div className="card overflow-hidden">
          <div className="card-header">
            <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
              <i className="ph ph-question text-primary-600" /> FAQ Entries
            </h2>
            <SectionToggle on={settings.sectionVisibility.faq} name="faq" visibilityAction={visibilityAction} />
          </div>
          <div className="card-body">
            <FaqEditor initialFaqs={faqs} />
          </div>
        </div>

        {/* ── SEO & Open Graph ─────────────────────────────────────── */}
        <form action={seoFormAction}>
          {/* Pass hero fields through hidden so they aren't wiped on SEO save */}
          <input type="hidden" name="titleEn" value={p.titleEn ?? ""} />
          <input type="hidden" name="titleKa" value={p.titleKa ?? ""} />
          <input type="hidden" name="contentEn" value={p.contentEn ?? ""} />
          <input type="hidden" name="contentKa" value={p.contentKa ?? ""} />
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
                <i className="ph ph-magnifying-glass text-primary-600" /> SEO &amp; Open Graph
              </h2>
              <div className="flex items-center gap-2">
                {seoState.error && <span className="text-[11px] text-red-600 font-medium">{seoState.error}</span>}
                {seoState.success && <span className="text-[11px] text-green-600 font-medium">Saved!</span>}
                <SaveBtn pending={seoPending} />
              </div>
            </div>
            <div key={formKey} className="card-body space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-base">SEO Title {L}</label>
                  <input type="text" name={lang === "en" ? "seoTitleEn" : "seoTitleKa"} className="input-base"
                    placeholder="About AG Legal — Law Firm" defaultValue={field(p, "seoTitleEn", "seoTitleKa")} />
                  {hidden(p, "seoTitleEn", "seoTitleKa", "seoTitleEn", "seoTitleKa")}
                </div>
                <div>
                  <label className="label-base">OG Title {L}</label>
                  <input type="text" name={lang === "en" ? "ogTitleEn" : "ogTitleKa"} className="input-base"
                    defaultValue={field(p, "ogTitleEn", "ogTitleKa")} />
                  {hidden(p, "ogTitleEn", "ogTitleKa", "ogTitleEn", "ogTitleKa")}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="label-base">Meta Description {L}</label>
                  <textarea name={lang === "en" ? "metaDescriptionEn" : "metaDescriptionKa"} className="input-base" rows={2}
                    defaultValue={field(p, "metaDescriptionEn", "metaDescriptionKa")} />
                  {hidden(p, "metaDescriptionEn", "metaDescriptionKa", "metaDescriptionEn", "metaDescriptionKa")}
                </div>
                <div>
                  <label className="label-base">OG Description {L}</label>
                  <textarea name={lang === "en" ? "ogDescriptionEn" : "ogDescriptionKa"} className="input-base" rows={2}
                    defaultValue={field(p, "ogDescriptionEn", "ogDescriptionKa")} />
                  {hidden(p, "ogDescriptionEn", "ogDescriptionKa", "ogDescriptionEn", "ogDescriptionKa")}
                </div>
              </div>
              <OgImageUpload existing={p.ogImage} />
            </div>
          </div>
        </form>

      </div>

      {/* ── Sticky Action Bar — LAST element, outside page-content ─── */}
      <div className="action-bar">
        <div className="text-[12px] flex items-center gap-1.5">
          {settingsState.error ? (
            <><span className="w-2 h-2 rounded-full bg-red-500 shrink-0 inline-block" /><span className="text-red-600 font-medium truncate max-w-xs">{settingsState.error}</span></>
          ) : settingsPending ? (
            <><span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 inline-block animate-pulse" /><span className="text-brand-500 font-medium">Saving…</span></>
          ) : settingsSaved ? (
            <><span className="w-2 h-2 rounded-full bg-green-500 shrink-0 inline-block" /><span className="text-brand-500">Section settings saved</span></>
          ) : (
            <><span className="w-2 h-2 rounded-full bg-brand-300 shrink-0 inline-block" /><span className="text-brand-400">You have not made any changes</span></>
          )}
        </div>
        <div className="flex gap-3">
          <button type="reset" form="about-section-settings" className="btn btn-secondary">Discard Changes</button>
          <button type="submit" form="about-section-settings" className="btn btn-primary" disabled={settingsPending}>
            {settingsPending
              ? <><i className="ph ph-spinner animate-spin" /> Saving...</>
              : <><i className="ph ph-floppy-disk" /> Save Section Settings</>}
          </button>
        </div>
      </div>
    </>
  );
}
