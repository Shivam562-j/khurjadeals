"use client";

import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ThemeInitializer() {
  useIsomorphicLayoutEffect(() => {
    try {
      const storedTheme = localStorage.getItem("theme") || "dark";
      if (storedTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch {
      // Silently catch localStorage permission issues
    }
  }, []);

  return null;
}
