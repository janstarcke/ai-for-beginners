/**
 * LastUpdated — kleines Badge unten rechts unter dem ThemeToggle, zeigt das
 * Datum des letzten Site-Updates. Quelle ist `__BUILD_DATE__` aus
 * vite.config.ts → wird bei jedem Coolify-Deploy (= jeder gepushte Commit
 * nach main) automatisch neu gesetzt. Keine Pflege nötig.
 */
export function LastUpdated() {
  // Lokalisierte deutsche Darstellung (z.B. "25.05.2026"). `__BUILD_DATE__`
  // ist ISO-8601 UTC; toLocaleDateString rendert in der Timezone des Users.
  const formatted = new Date(__BUILD_DATE__).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Volles ISO im title für Hover-Detail (inkl. Uhrzeit).
  const iso = __BUILD_DATE__;

  return (
    <div
      className="fixed top-16 right-4 z-40 px-3 py-1 rounded-full bg-card/80 backdrop-blur border border-border shadow-sm text-[10px] font-medium text-muted-foreground select-none pointer-events-auto"
      title={`Letztes Update: ${iso}`}
      aria-label={`Letztes Update am ${formatted}`}
    >
      <span className="hidden sm:inline">Letztes Update: </span>
      <time dateTime={iso}>{formatted}</time>
    </div>
  );
}
