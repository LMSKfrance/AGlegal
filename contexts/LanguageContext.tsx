"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import mockEn from "@/constants/mock";
import mockKa from "@/constants/mock-ka";

export type Locale = "en" | "ka";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof mockEn;
  isGeorgian: boolean;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "ag-legal-locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "ka") {
      setLocaleState(stored);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale === "ka" ? "ka" : "en";
      document.documentElement.classList.toggle("locale-ka", newLocale === "ka");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale === "ka" ? "ka" : "en";
      document.documentElement.classList.toggle("locale-ka", locale === "ka");
    }
  }, [locale, mounted]);

  const t = locale === "ka" ? mockKa : mockEn;
  const isGeorgian = locale === "ka";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isGeorgian }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
