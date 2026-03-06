"use client";

import { useState } from "react";
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
      <div className={styles.langTabList} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={active === "en"}
          className={`${styles.langTabBtn} ${active === "en" ? styles.langTabBtnActive : ""}`}
          onClick={() => setActive("en")}
        >
          <span className={`${styles.langTabFlag} ${styles.langTabFlagEn}`} />
          EN
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "ka"}
          className={`${styles.langTabBtn} ${active === "ka" ? styles.langTabBtnActive : ""}`}
          onClick={() => setActive("ka")}
        >
          <span className={`${styles.langTabFlag} ${styles.langTabFlagKa}`} />
          KA
        </button>
      </div>
      <div
        className={`${styles.tabPanel} ${active === "en" ? styles.active : ""}`}
        role="tabpanel"
      >
        {childrenEn}
      </div>
      <div
        className={`${styles.tabPanel} ${active === "ka" ? styles.active : ""}`}
        role="tabpanel"
      >
        {childrenKa}
      </div>
    </div>
  );
}
