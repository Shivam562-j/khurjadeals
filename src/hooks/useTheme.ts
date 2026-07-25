import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Determine initial theme on mount
    try {
      const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      const initialTheme = storedTheme || "dark";
      setTheme(initialTheme);
      
      if (initialTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch (e) {
      console.error("Failed to read theme from localStorage", e);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("theme", nextTheme);
      if (nextTheme === "light") {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
    } catch (e) {
      console.error("Failed to write theme to localStorage", e);
    }
  };

  return { theme, toggleTheme, isDark: theme === "dark", isLight: theme === "light" };
}
