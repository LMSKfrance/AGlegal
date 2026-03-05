"use client";

import { useTransition, useState, useEffect } from "react";
import type { HomeSectionId } from "@/lib/home";
import { setHomeSectionVisible } from "@/lib/actions/home";

type Props = {
  sectionId: HomeSectionId;
  sectionLabel: string;
  visible: boolean;
};

export function HomeSectionVisibilityToggle({ sectionId, visible }: Props) {
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
          startTransition(() => setHomeSectionVisible(sectionId, next));
        }}
      />
      <span style={{ fontSize: 14, fontWeight: 500 }}>Show section</span>
    </label>
  );
}
