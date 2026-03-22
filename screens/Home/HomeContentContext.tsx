"use client";

import React, { createContext, useContext } from "react";
import type { HomeContent } from "@/lib/home";
import { useLanguage } from "@/contexts/LanguageContext";

export type HomeContentProviderValue = {
  contentEn: HomeContent;
  contentKa: HomeContent;
};

export const HomeContentContext = createContext<HomeContentProviderValue | null>(null);

export function HomeContentProvider({
  value,
  children,
}: {
  value: HomeContentProviderValue;
  children: React.ReactNode;
}) {
  return <HomeContentContext.Provider value={value}>{children}</HomeContentContext.Provider>;
}

export function useHomeContent(): HomeContent {
  const ctx = useContext(HomeContentContext);
  const { locale } = useLanguage();
  if (!ctx) {
    throw new Error("useHomeContent must be used within HomeContentProvider");
  }
  return locale === "ka" ? ctx.contentKa : ctx.contentEn;
}

export function useHomeContentMaybe(): HomeContent | null {
  const ctx = useContext(HomeContentContext);
  const { locale } = useLanguage();
  if (!ctx) return null;
  return locale === "ka" ? ctx.contentKa : ctx.contentEn;
}

