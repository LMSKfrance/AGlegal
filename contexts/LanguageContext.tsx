"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Locale is derived purely from the URL — no localStorage, no useState
  const locale: Locale = pathname.startsWith("/ka") ? "ka" : "en";

  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale) return;
      if (newLocale === "ka") {
        router.push("/ka" + (pathname === "/" ? "" : pathname));
      } else {
        // Strip /ka prefix
        const path = pathname.startsWith("/ka/")
          ? pathname.slice(3)
          : pathname === "/ka"
          ? "/"
          : pathname;
        router.push(path || "/");
      }
    },
    [locale, router, pathname]
  );

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
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
