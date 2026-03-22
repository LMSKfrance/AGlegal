"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AboutSectionSettings } from "@/lib/about";
import { useAdminLang } from "../AdminLangContext";

type FormState = { success?: boolean; error?: string };

type Props = {
  settings: AboutSectionSettings;
  saveAction: (_prev: FormState, formData: FormData) => Promise<FormState>;
};

const INITIAL: FormState = {};

export default function AboutForm({ settings, saveAction }: Props) {
  const [state, formAction, pending] = useActionState(saveAction, INITIAL);
  const lang = useAdminLang();

  function field(enKey: keyof AboutSectionSettings, kaKey: keyof AboutSectionSettings) {
    return lang === "en" ? (settings[enKey] as string) ?? "" : (settings[kaKey] as string) ?? "";
  }

  function hiddenFields(enName: string, kaName: string, enKey: keyof AboutSectionSettings, kaKey: keyof AboutSectionSettings) {
    if (lang === "en") {
      return <input type="hidden" name={kaName} value={(settings[kaKey] as string) ?? ""} />;
    }
    return <input type="hidden" name={enName} value={(settings[enKey] as string) ?? ""} />;
  }

  return (
    <>
      <div className="pb-6 pt-8 border-b border-brand-200 px-8">
        <h1 className="text-[28px] font-bold text-brand-900 tracking-tight">About Firm Settings</h1>
        <p className="text-brand-500 mt-2">Manage content for the About Us page sections.</p>
      </div>

      <form action={formAction}>
        <div className="page-content space-y-6 pb-40 max-w-4xl mx-auto ml-0 pt-6">
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{state.error}</div>
          )}
          {state.success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">About settings saved successfully.</div>
          )}

          {/* Hero content note */}
          <div className="card p-6 flex justify-between items-center bg-brand-50 border border-brand-200">
            <div>
              <div className="font-semibold text-[14px] text-brand-900">Hero Content is managed in Pages</div>
              <div className="text-[13px] text-brand-500 mt-1">Edit the main intro text via Pages &gt; About Us.</div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/admin/pages" className="btn btn-secondary h-9 px-4 text-[13px]">Go to Pages</Link>
            </div>
          </div>

          {/* Key Numbers */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 text-[15px]">Key Numbers Section</h2>
              <label className="toggle-switch"><input type="checkbox" defaultChecked={settings.sectionVisibility.numbers} /><span className="toggle-slider" /></label>
            </div>
            <div className="card-body space-y-5">
              <div>
                <label className="label-base">Section Title {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <input
                  type="text"
                  name={lang === "en" ? "numbersTitleEn" : "numbersTitleKa"}
                  className="input-base"
                  placeholder="Our Impact in Numbers"
                  defaultValue={field("numbersTitleEn", "numbersTitleKa")}
                />
                {hiddenFields("numbersTitleEn", "numbersTitleKa", "numbersTitleEn", "numbersTitleKa")}
              </div>
              <div>
                <label className="label-base">Section Description {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <textarea
                  name={lang === "en" ? "numbersDescriptionEn" : "numbersDescriptionKa"}
                  className="input-base"
                  rows={2}
                  defaultValue={field("numbersDescriptionEn", "numbersDescriptionKa")}
                />
                {hiddenFields("numbersDescriptionEn", "numbersDescriptionKa", "numbersDescriptionEn", "numbersDescriptionKa")}
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 text-[15px]">Our Mission Section</h2>
              <label className="toggle-switch"><input type="checkbox" defaultChecked={settings.sectionVisibility.mission} /><span className="toggle-slider" /></label>
            </div>
            <div className="card-body space-y-5">
              <div>
                <label className="label-base">Title {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <input
                  type="text"
                  name={lang === "en" ? "missionTitleEn" : "missionTitleKa"}
                  className="input-base"
                  placeholder="Driven by Excellence"
                  defaultValue={field("missionTitleEn", "missionTitleKa")}
                />
                {hiddenFields("missionTitleEn", "missionTitleKa", "missionTitleEn", "missionTitleKa")}
              </div>
              <div>
                <label className="label-base">Description {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <textarea
                  name={lang === "en" ? "missionDescriptionEn" : "missionDescriptionKa"}
                  className="input-base"
                  rows={2}
                  defaultValue={field("missionDescriptionEn", "missionDescriptionKa")}
                />
                {hiddenFields("missionDescriptionEn", "missionDescriptionKa", "missionDescriptionEn", "missionDescriptionKa")}
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 text-[15px]">Core Features Section</h2>
              <label className="toggle-switch"><input type="checkbox" defaultChecked={settings.sectionVisibility.features} /><span className="toggle-slider" /></label>
            </div>
            <div className="card-body">
              <div>
                <label className="label-base">Title {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <input
                  type="text"
                  name={lang === "en" ? "featuresTitleEn" : "featuresTitleKa"}
                  className="input-base"
                  placeholder="What Sets Us Apart"
                  defaultValue={field("featuresTitleEn", "featuresTitleKa")}
                />
                {hiddenFields("featuresTitleEn", "featuresTitleKa", "featuresTitleEn", "featuresTitleKa")}
              </div>
            </div>
          </div>

          {/* Our Philosophy */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-brand-900 text-[15px]">Our Philosophy Section</h2>
              <label className="toggle-switch"><input type="checkbox" defaultChecked={settings.sectionVisibility.philosophy} /><span className="toggle-slider" /></label>
            </div>
            <div className="card-body space-y-5">
              <div>
                <label className="label-base">Title {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <input
                  type="text"
                  name={lang === "en" ? "philosophyTitleEn" : "philosophyTitleKa"}
                  className="input-base"
                  placeholder="A Client-First Approach"
                  defaultValue={field("philosophyTitleEn", "philosophyTitleKa")}
                />
                {hiddenFields("philosophyTitleEn", "philosophyTitleKa", "philosophyTitleEn", "philosophyTitleKa")}
              </div>
              <div>
                <label className="label-base">Description {lang === "en" ? "(En)" : "(ქარ)"}</label>
                <textarea
                  name={lang === "en" ? "philosophyDescriptionEn" : "philosophyDescriptionKa"}
                  className="input-base"
                  rows={2}
                  defaultValue={field("philosophyDescriptionEn", "philosophyDescriptionKa")}
                />
                {hiddenFields("philosophyDescriptionEn", "philosophyDescriptionKa", "philosophyDescriptionEn", "philosophyDescriptionKa")}
              </div>
            </div>
          </div>

          {/* FAQ Visibility */}
          <div className="card p-6 flex justify-between items-center">
            <div className="font-semibold text-[15px] text-brand-900">FAQ Section Visibility</div>
            <label className="toggle-switch"><input type="checkbox" defaultChecked={settings.sectionVisibility.faq} /><span className="toggle-slider" /></label>
          </div>
        </div>

        <div className="action-bar">
          <div />
          <div className="flex gap-3">
            <button type="reset" className="btn btn-secondary">Discard Changes</button>
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? <><i key="spinner" className="ph ph-spinner animate-spin" /> Saving...</> : <><i key="save" className="ph ph-floppy-disk" /> Save About Settings</>}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
