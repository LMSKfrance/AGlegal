"use client";

import { useState } from "react";
import Tab from "@/design-system/components/Tab";
import styles from "../admin.module.css";

type Props = {
  childrenEn: React.ReactNode;
  childrenKa: React.ReactNode;
};

/** EN/KA tabs that keep both panels in the DOM so form fields submit correctly. */
export function AdminLangTabs({ childrenEn, childrenKa }: Props) {
  const [active, setActive] = useState<"en" | "ka">("en");
  return (
    <div className={styles.formTabsWrap}>
      <div role="tablist" style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        <Tab
          label="EN"
          active={active === "en"}
          onClick={() => setActive("en")}
        />
        <Tab
          label="KA"
          active={active === "ka"}
          onClick={() => setActive("ka")}
        />
      </div>
      <div className={`${styles.tabPanel} ${active === "en" ? styles.active : ""}`} role="tabpanel">
        {childrenEn}
      </div>
      <div className={`${styles.tabPanel} ${active === "ka" ? styles.active : ""}`} role="tabpanel">
        {childrenKa}
      </div>
    </div>
  );
}
