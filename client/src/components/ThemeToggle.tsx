import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * ThemeToggle — Sun/Moon Icon-Swap. Vorher mit Framer-Motion-AnimatePresence,
 * jetzt mit reinem CSS (Audit-Item #16 Migration): beide Icons sind permanent
 * gemountet und werden via opacity+rotate Transitionen ein-/ausgeblendet.
 *
 * `motion-reduce:transition-none` deaktiviert die Animation für User mit
 * prefers-reduced-motion.
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label={isLight ? "Dark Mode aktivieren" : "Light Mode aktivieren"}
      title={isLight ? "Dark Mode aktivieren" : "Light Mode aktivieren"}
    >
      {/* Icon-Container: feste 16×16 Box, beide Icons stacked + cross-fade via CSS. */}
      <span className="relative inline-block w-4 h-4">
        <Moon
          className={`absolute inset-0 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-200 motion-reduce:transition-none ${
            isLight ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
          }`}
          aria-hidden={!isLight}
        />
        <Sun
          className={`absolute inset-0 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all duration-200 motion-reduce:transition-none ${
            isLight ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
          }`}
          aria-hidden={isLight}
        />
      </span>
      <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
        {isLight ? "Nachtmodus" : "Tagmodus"}
      </span>
    </button>
  );
}
