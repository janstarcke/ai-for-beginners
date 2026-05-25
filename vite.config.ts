import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Build-Zeitstempel als Compile-Time-Konstante. Wird bei jedem Build neu
// gesetzt — und da Coolify auf jeden Push nach main automatisch deployt
// (= neuer Docker-Build), bildet das Datum verlässlich das letzte
// Live-Update der Seite ab. Kein .git im Docker-Build nötig.
const BUILD_DATE = new Date().toISOString();

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
