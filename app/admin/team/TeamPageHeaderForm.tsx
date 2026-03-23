"use client";

import { useActionState, useTransition } from "react";
import { saveTeamPageContent, type TeamPageContentState } from "@/lib/actions/settings";

interface Props {
  defaultTitle: string;
  defaultDescription: string;
}

const initial: TeamPageContentState = {};

export default function TeamPageHeaderForm({ defaultTitle, defaultDescription }: Props) {
  const [state, formAction] = useActionState(saveTeamPageContent, initial);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => { formAction(data); });
  }

  return (
    <div className="card mb-6">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <i className="ph ph-text-h-one text-[18px] text-brand-400" />
          <span className="font-semibold text-[14px] text-brand-900">Page Header</span>
        </div>
      </div>
      <div className="card-body">
        <p className="text-[13px] text-brand-500 mb-4">
          Edit the heading and description shown at the top of the public Team page.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-base">Heading</label>
            <input
              type="text"
              name="teamPageTitle"
              className="input-base"
              defaultValue={defaultTitle}
              placeholder="Our team."
            />
          </div>
          <div>
            <label className="label-base">Description</label>
            <textarea
              name="teamPageDescription"
              className="input-base"
              rows={3}
              defaultValue={defaultDescription}
              placeholder="A short description shown below the heading…"
            />
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </button>
            {state.success && (
              <span className="text-[13px] text-green-600 flex items-center gap-1">
                <i className="ph ph-check-circle text-[16px]" /> Saved
              </span>
            )}
            {state.error && (
              <span className="text-[13px] text-red-600">{state.error}</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
