"use client";

import { useTransition, useState, useEffect } from "react";
import type { AboutSectionId } from "@/lib/about";
import { setAboutSectionVisible } from "@/lib/actions/about";

type Props = {
  sectionId: AboutSectionId;
  sectionLabel: string;
  visible: boolean;
};

export function AboutSectionVisibilityToggle({ sectionId, visible }: Props) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(visible);
  useEffect(() => setChecked(visible), [visible]);

  return (
    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
      <input
        type="checkbox"
        checked={checked}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.checked;
          setChecked(next);
          startTransition(() => setAboutSectionVisible(sectionId, next));
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 500 }}>Show section</span>
    </label>
  );
}
