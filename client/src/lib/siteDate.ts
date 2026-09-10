/**
 * Zentrale Datumsangabe der Seite.
 *
 * Einzige Quelle ist `__BUILD_DATE__` aus vite.config.ts — exakt dasselbe
 * Datum, das auch das LastUpdated-Badge oben rechts anzeigt. Vorher stand in
 * den Footern ein handgepflegtes "Stand: Mai 2026", das zwangsläufig hinter
 * dem automatischen Badge zurückblieb. Ein Deploy aktualisiert jetzt beide
 * Angaben gemeinsam, ein Auseinanderlaufen ist strukturell ausgeschlossen.
 */
export const siteStand = new Date(__BUILD_DATE__).toLocaleDateString("de-DE", {
  month: "long",
  year: "numeric",
});
