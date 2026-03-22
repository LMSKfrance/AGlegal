"use client";

import { useTransition, useState } from "react";
import { setHomeSectionVisible } from "@/lib/actions/home";
import type { HomeSectionId, HomeSectionVisibility } from "@/lib/home";

const SECTION_LABELS: Record<HomeSectionId, { label: string; icon: string }> = {
  hero:     { label: "Hero Banner",        icon: "ph-monitor" },
  about:    { label: "Who We Are",         icon: "ph-users-three" },
  services: { label: "Our Services",       icon: "ph-briefcase" },
  benefits: { label: "Why Work With Us",   icon: "ph-star" },
  process:  { label: "How We Work",        icon: "ph-arrows-clockwise" },
  team:     { label: "Meet the Team",      icon: "ph-users" },
  news:     { label: "Latest News",        icon: "ph-newspaper" },
  cta:      { label: "Call to Action",     icon: "ph-megaphone" },
};

export default function HomeSectionsVisibility({
  visibility,
}: {
  visibility: HomeSectionVisibility;
}) {
  const [pending, startTransition] = useTransition();
  const [localVis, setLocalVis] = useState<HomeSectionVisibility>({ ...visibility });

  function toggle(id: HomeSectionId) {
    const next = !localVis[id];
    setLocalVis((v) => ({ ...v, [id]: next }));
    startTransition(async () => {
      await setHomeSectionVisible(id, next);
    });
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold text-brand-900 flex items-center gap-2 text-[15px]">
          <i className="ph ph-eye text-primary-600" /> Section Visibility
        </h2>
        {pending && <span className="text-[11px] text-brand-400">Saving…</span>}
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x-0">
          {(Object.keys(SECTION_LABELS) as HomeSectionId[]).map((id) => {
            const { label, icon } = SECTION_LABELS[id];
            const on = localVis[id];
            return (
              <div
                key={id}
                className="flex items-center justify-between px-5 py-4 hover:bg-brand-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className={`ph ${icon} text-[18px] text-brand-500`} />
                  <span className="text-[14px] font-medium text-brand-900">{label}</span>
                </div>
                <label className="toggle-switch shrink-0">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(id)}
                    disabled={pending}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
