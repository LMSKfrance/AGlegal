"use client";

import React, { createContext, useContext } from "react";
import type { AboutSectionSettings } from "@/lib/about";
import type { TeamMember } from "@/lib/team";
import type { Page } from "@/lib/db/schema";

export type AboutContentValue = {
  page: Page | null;
  sections: AboutSectionSettings;
  teamMembers: TeamMember[];
};

export const AboutContentContext = createContext<AboutContentValue | null>(null);

export function AboutContentProvider({
  value,
  children,
}: {
  value: AboutContentValue;
  children: React.ReactNode;
}) {
  return (
    <AboutContentContext.Provider value={value}>
      {children}
    </AboutContentContext.Provider>
  );
}

export function useAboutContent(): AboutContentValue {
  const ctx = useContext(AboutContentContext);
  if (!ctx) throw new Error("useAboutContent must be used within AboutContentProvider");
  return ctx;
}
