"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "en" | "ka";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue>({ lang: "en", setLang: () => {} });

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("admin_lang") as Lang | null;
      if (stored === "en" || stored === "ka") setLangState(stored);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try { localStorage.setItem("admin_lang", l); } catch {}
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
