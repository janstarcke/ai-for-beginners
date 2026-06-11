import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { skills } from "./client/src/data/skills";

// Build-Zeitstempel als Compile-Time-Konstante. Wird bei jedem Build neu
// gesetzt — und da Coolify auf jeden Push nach main automatisch deployt
// (= neuer Docker-Build), bildet das Datum verlässlich das letzte
// Live-Update der Seite ab. Kein .git im Docker-Build nötig.
const BUILD_DATE = new Date().toISOString();

// Zählt die Skills für die Zahl in index.html (description / og:description /
// twitter:description), damit Katalog und LinkedIn-Share-Card nie auseinander
// driften (peinliche Outdated-Previews, siehe PR #29). AFB-9: importiert die
// echte `skills`-Liste statt `id: N,`-Zeilen per Regex zu zählen — robust gegen
// Over-Count durch künftige `id:`-Felder in anderen Strukturen.
function countSkills(): number {
  const count = skills.length;
  if (count < 10) {
    // Sanity-Check: lieber Build abbrechen als mit absurder Zahl deployen.
    throw new Error(
      `[skill-count-html] Plausibilitätsfehler: nur ${count} Skills im importierten ` +
        `Katalog — skills.ts radikal umstrukturiert?`,
    );
  }
  return count;
}

function skillCountHtmlPlugin(): Plugin {
  return {
    name: "skill-count-html",
    transformIndexHtml(html) {
      return html.replace(/__SKILL_COUNT__/g, String(countSkills()));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), skillCountHtmlPlugin()],
  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});
