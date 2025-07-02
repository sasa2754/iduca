"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

type ThemeModeContextType = {
  mode: "light" | "dark";
  toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) throw new Error("useThemeMode must be used within ThemeModeProvider");
  return context;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  // Detecta o sistema e atualiza ao vivo
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setMode(mediaQuery.matches ? "dark" : "light");

    const handler = (event: MediaQueryListEvent) => {
      setMode(event.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <AppRouterCacheProvider>
      <ThemeModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </ThemeModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
