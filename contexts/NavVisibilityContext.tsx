"use client";

import React, { createContext, useContext } from "react";

type NavVisibilityContextType = {
  hiddenNavIds: number[];
};

const NavVisibilityContext = createContext<NavVisibilityContextType>({ hiddenNavIds: [] });

export function NavVisibilityProvider({
  hiddenNavIds,
  children,
}: {
  hiddenNavIds: number[];
  children: React.ReactNode;
}) {
  return (
    <NavVisibilityContext.Provider value={{ hiddenNavIds }}>
      {children}
    </NavVisibilityContext.Provider>
  );
}

export function useNavVisibility() {
  return useContext(NavVisibilityContext);
}
