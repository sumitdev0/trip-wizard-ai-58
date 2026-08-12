import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, hydrated, cycleTheme } = useTheme();

  const label =
    theme === "light" ? "Light mode" : theme === "dark" ? "Dark mode" : "System theme";
  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`${label} — click to switch`}
      aria-label={`Theme: ${label}. Click to switch theme.`}
      className="relative ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {hydrated ? (
        <Icon key={theme} className="h-4 w-4 theme-icon-in" aria-hidden="true" />
      ) : (
        <span className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
