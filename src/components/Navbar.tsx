import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme } from "../theme";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const linkBase = "px-3 py-2 rounded-xl text-sm font-medium transition-colors";
  const linkActive =
    "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100";
  const linkIdle =
    "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60";

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-zinc-200/60 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-12">
        <div className="flex items-center gap-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <img
            src={theme === "dark" ? "/logo1_light.png" : "/logo1_dark.png"}
            alt="Logo"
            className="h-8 w-8"
          />
          {"<CD / M >"} Dijkstra
        </div>

        <nav className="flex items-center gap-4">
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Basic
          </NavLink>

          <NavLink
            to="/interactive"
            className={({ isActive }: { isActive: boolean }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            Interactive
          </NavLink>
        </nav>

        <div className="ml-auto">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl px-3 py-2 border border-zinc-300/60 dark:border-zinc-700/60 text-zinc-800 dark:text-zinc-100 cursor-pointer"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </header>
  );
}
