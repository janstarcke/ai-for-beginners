import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import fs from "node:fs";

// Build-Zeitstempel als Compile-Time-Konstante. Wird bei jedem Build neu
// gesetzt — und da Coolify auf jeden Push nach main automatisch deployt
// (= neuer Docker-Build), bildet das Datum verlässlich das letzte
// Live-Update der Seite ab. Kein .git im Docker-Build nötig.
const BUILD_DATE = new Date().toISOString();

// Liest skills.ts und zählt `id: N,`-Einträge, damit die Skill-Zahl in
// index.html (description / og:description / twitter:description) nie
// wieder per Hand nachgezogen werden muss. Drift zwischen Katalog und
// LinkedIn-Share-Card war historisch eine wiederkehrende Quelle peinlicher
// Outdated-Previews (siehe PR #29).
function countSkills(): number {
  const file = path.resolve(import.meta.dirname, "client/src/data/skills.ts");
  const content = fs.readFileSync(file, "utf-8");
  const matches = content.match(/^\s*id:\s*\d+,/gm);
  const count = matches?.length ?? 0;
  if (count < 10) {
    // Sanity-Check: lieber Build abbrechen als mit absurder Zahl deployen.
    throw new Error(
      `[skill-count-html] Plausibilitätsfehler: nur ${count} Skills erkannt in ${file}. ` +
        `Regex-Match defekt oder skills.ts radikal umstrukturiert?`,
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
