"use client";

import { createContext, useContext } from "react";

export const AdminLangContext = createContext<"en" | "ka">("en");

export function useAdminLang(): "en" | "ka" {
  return useContext(AdminLangContext);
}
