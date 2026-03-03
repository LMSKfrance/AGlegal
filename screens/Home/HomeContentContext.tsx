"use client";

import React, { createContext, useContext } from "react";
import type { HomeContent } from "@/lib/home";

const HomeContentContext = createContext<HomeContent | null>(null);

export function HomeContentProvider({
  value,
  children,
}: {
  value: HomeContent;
  children: React.ReactNode;
}) {
  return <HomeContentContext.Provider value={value}>{children}</HomeContentContext.Provider>;
}

export function useHomeContent() {
  const ctx = useContext(HomeContentContext);
  if (!ctx) {
    throw new Error("useHomeContent must be used within HomeContentProvider");
  }
  return ctx;
}

