type Theme = "light" | "dark";
const KEY = "theme";

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(KEY) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
}

export function applyInitialTheme() {
  applyTheme(getInitialTheme());
}
