"use client";

import { useLang } from "../LangContext";
import styles from "../admin.module.css";

type Props = {
  childrenEn: React.ReactNode;
  childrenKa: React.ReactNode;
};

/** EN/KA tabs synced to the global language context. Both panels stay in the DOM so form fields always submit. */
export function AdminLangTabs({ childrenEn, childrenKa }: Props) {
  const { lang, setLang } = useLang();

  return (
    <div className={styles.formTabsWrap}>
      <div className={styles.langTabList} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={lang === "en"}
          className={`${styles.langTabBtn} ${lang === "en" ? styles.langTabBtnActive : ""}`}
          onClick={() => setLang("en")}
        >
          <span className={`${styles.langTabFlag} ${styles.langTabFlagEn}`} />
          EN
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={lang === "ka"}
          className={`${styles.langTabBtn} ${lang === "ka" ? styles.langTabBtnActive : ""}`}
          onClick={() => setLang("ka")}
        >
          <span className={`${styles.langTabFlag} ${styles.langTabFlagKa}`} />
          KA
        </button>
      </div>
      <div
        className={`${styles.tabPanel} ${lang === "en" ? styles.active : ""}`}
        role="tabpanel"
      >
        {childrenEn}
      </div>
      <div
        className={`${styles.tabPanel} ${lang === "ka" ? styles.active : ""}`}
        role="tabpanel"
      >
        {childrenKa}
      </div>
    </div>
  );
}
