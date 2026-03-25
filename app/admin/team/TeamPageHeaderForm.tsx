"use client";

import { useActionState, useTransition } from "react";
import { saveTeamPageContent, type TeamPageContentState } from "@/lib/actions/settings";
import { useAdminLang } from "../AdminLangContext";

interface Props {
  titleEn: string;
  titleKa: string;
  descriptionEn: string;
  descriptionKa: string;
}

const initial: TeamPageContentState = {};

export default function TeamPageHeaderForm({ titleEn, titleKa, descriptionEn, descriptionKa }: Props) {
  const [state, formAction] = useActionState(saveTeamPageContent, initial);
  const [pending, startTransition] = useTransition();
  const lang = useAdminLang();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => { formAction(data); });
  }

  const L = lang === "en" ? "(EN)" : "(ქარ)";

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <i className="ph ph-text-h-one text-[18px] text-brand-400" />
          <span className="font-semibold text-[14px] text-brand-900">Page Header</span>
        </div>
        <div className="flex items-center gap-2">
          {state.success && (
            <span className="text-[11px] text-green-600 font-medium">Saved!</span>
          )}
          {state.error && (
            <span className="text-[11px] text-red-600 font-medium">{state.error}</span>
          )}
          <button
            form="team-header-form"
            type="submit"
            className="btn-save"
            disabled={pending}
            title="Save"
          >
            {pending ? <i className="ph ph-spinner animate-spin" /> : <i className="ph ph-floppy-disk" />}
          </button>
        </div>
      </div>
      <div className="card-body">
        <form id="team-header-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Always submit both languages */}
          <input type="hidden" name={lang === "en" ? "teamPageTitleKa" : "teamPageTitleEn"} value={lang === "en" ? titleKa : titleEn} />
          <input type="hidden" name={lang === "en" ? "teamPageDescriptionKa" : "teamPageDescriptionEn"} value={lang === "en" ? descriptionKa : descriptionEn} />

          <div>
            <label className="label-base">Heading {L}</label>
            <input
              type="text"
              name={lang === "en" ? "teamPageTitleEn" : "teamPageTitleKa"}
              className="input-base"
              defaultValue={lang === "en" ? titleEn : titleKa}
              placeholder="Our team."
              key={`title-${lang}`}
            />
          </div>
          <div>
            <label className="label-base">Description {L}</label>
            <textarea
              name={lang === "en" ? "teamPageDescriptionEn" : "teamPageDescriptionKa"}
              className="input-base"
              rows={3}
              defaultValue={lang === "en" ? descriptionEn : descriptionKa}
              placeholder="A short description shown below the heading…"
              key={`desc-${lang}`}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
