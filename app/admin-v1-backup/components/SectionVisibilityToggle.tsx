"use client";

import { useTransition, useState, useEffect } from "react";
import type { AboutSectionId } from "@/lib/about";
import { setAboutSectionVisible } from "@/lib/actions/about";
import styles from "../admin.module.css";

type Props = {
  sectionId: AboutSectionId;
  sectionLabel: string;
  visible: boolean;
};

export function AboutSectionVisibilityToggle({ sectionId, visible, sectionLabel }: Props) {
  const [isPending, startTransition] = useTransition();
  const [checked, setChecked] = useState(visible);
  useEffect(() => setChecked(visible), [visible]);

  const inputId = `toggle-about-${sectionId}`;

  return (
    <label htmlFor={inputId} className={styles.toggleSwitch} title={`Toggle visibility of ${sectionLabel} section`}>
      <input
        id={inputId}
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        disabled={isPending}
        onChange={(e) => {
          const next = e.target.checked;
          setChecked(next);
          startTransition(() => setAboutSectionVisible(sectionId, next));
        }}
      />
      <span className={styles.toggleTrack} aria-hidden="true" />
      <span className={styles.toggleLabel}>
        {isPending ? "Saving…" : "Show section"}
      </span>
    </label>
  );
}
