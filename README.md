# AI for Beginners — Claude Code Wissensdatenbank

Eine interaktive Wissensdatenbank, die alle wichtigen Skills, Workflows und Token-Spar-Tricks rund um **Claude Code** und **Vibe Coding** zusammenfasst — kuratiert auf 4 Schwierigkeitsstufen, mit Progress-Tracking, Volltextsuche und Markdown-Export.

**Live:** https://ai-for-beginners.starcke.io

## Stack

- **Vite 7** + **React 19** + **TypeScript 5.6**
- **Tailwind CSS 4** (CSS-first config via `@theme {}`) + **shadcn/ui** (New York Style)
- **Wouter** für Client-Routing
- **Framer Motion** für Animationen
- **Hosting:** Coolify (Static) auf Hetzner CX33

Komplett **statisches Frontend** — kein Backend, keine DB. Progress wird in `localStorage` gespeichert.

## Quick Start

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Production-Build nach ./dist/
pnpm preview      # Local production preview
pnpm check        # TypeScript-Check
```

Voraussetzungen: **Node 22+**, **pnpm 10+**.

## Projektstruktur

```
client/
├── index.html                 # HTML-Entry mit Google Fonts
├── public/
│   └── images/                # Hero-Banner & Page-Hero-Bilder (.webp)
└── src/
    ├── App.tsx                # Router (Wouter) + Layout-Provider
    ├── main.tsx               # React-Entry
    ├── index.css              # Design-Tokens (OKLCH), Fonts, Theme-Variablen
    ├── pages/                 # 5 Seiten: Home, Guide, ClaudeDesign, FinancialAnalyst, TokenSpar
    ├── components/
    │   ├── ui/                # shadcn-Komponenten (kopiert, keine npm-Dep)
    │   └── …                  # ProgressBar, GlobalSearch (Cmd+K), ExportButton, etc.
    ├── data/                  # Skills, Guide-Steps, Courses — siehe CONTRIBUTING.md
    ├── hooks/                 # useProgress, useMobile, …
    ├── contexts/              # ThemeContext (dark/light)
    └── lib/                   # cn()-Helper
```

## Features

- **Progress-Tracking** — Jede Skill/Step hat eine Checkbox; State in `localStorage` (Key: `ai-for-beginners-progress`)
- **Cmd+K Global Search** — durchsucht alle Skills, Guide-Steps und Pages
- **Markdown-Export** — generiert eine Checkliste aller Skills als `.md`-Download
- **Token-Spar-Rechner** — Live-Berechnung für Opus/Sonnet/Haiku/Kimi K2.6
- **Dark Mode** — Toggle persistiert in `localStorage`

## Weiterentwicklung

Neue Skills, Guide-Steps oder ganze Seiten hinzufügen → siehe **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Deployment

Auto-Deploy auf `main`-Push via Coolify-GitHub-App.
- Build Command: `pnpm install --frozen-lockfile && pnpm build`
- Publish Directory: `dist`
- SPA-Fallback: aktiviert

Manuelle Schritte für ein neues Deployment siehe `~/.claude/projects/-Users-jansta/memory/infrastructure_hetzner_coolify_handbook.md`.

## Lizenz

MIT
