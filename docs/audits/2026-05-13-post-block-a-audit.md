# Post-Block-A Audit — 2026-05-13

**Anlass:** Nach Block A (CodeBlock, Install-Modal, 18 installCommand-Befüllungen, CopyButton-Refactor) + Morgenarbeit (Hidden-Page, Skill-Iterationen, Cookies-Hotfix) wollte der Maintainer prüfen, ob neue Probleme eingebaut wurden.

**Methode:** 4 parallele read-only Audit-Spuren (Code-Quality, Security/Hygiene, Performance/Bundle, A11y/UX). Read-only — keine Modifikationen während des Audits.

**Bilanz:** 28 Findings = 7 HOCH + 10 MITTEL + 11 NIEDRIG.

**Kernbefunde:**
- Refactor war handwerklich sauber: kein Dead Code, keine non-null-assertions, keine vergessenen Imports, alle 18 `installCommand`-Strings frei von destruktiven Patterns.
- **Aber:** Externe-Tool-Referenzen im public Repo (verletzt explizite Zero-Tolerance-Policy aus memory), Keyboard-Inaccessibility der gesamten Skill-Liste, fehlende Security-Header in nginx, mehrere Light-Mode-Kontrastfehler (WCAG AA fail).

---

## HOCH (7 Findings)

### 1. Externe-Tool-Referenzen im public Repo

**Verletzt:** memory/feedback_no_manus_traces_in_public_repos.md (Zero-Tolerance-Policy)

**Stellen:**
- `client/src/data/importHistory.ts` — 5 Treffer in kuratierten Notes
- `client/src/data/gitHistory.generated.ts` — automatisch aus Commit-Subjects, regeneriert sich auf jeden Build
- `docs/specs/2026-05-13-block-a-codeblock-install-design.md` — 3 explizite Erwähnungen "Wettbewerbsanalyse von Drittquelle"
- Commit-Subjects (3): public-permanent
- Commit-Bodies (8): diverse

**Empfehlung:** Code + Spec-Doc + importHistory umformulieren ("externe Wettbewerbsanalyse", "Drittquelle-Backup"). Commit-Subjects sind public-permanent — entweder `git-filter-repo` (invasiv, rewrites history, alle Forks broken) oder als sunk cost akzeptieren.

**Entscheidung:** Sunk-Cost akzeptiert für Commit-History, Code + Doku werden bereinigt.

### 2. SkillCard ist keyboard-unzugänglich

**Datei:** `client/src/pages/Home.tsx:71-110` (SkillCard) + `:19-46` (TldrCard)

**Problem:** `<div className="cursor-pointer" onClick={...}>` ohne `role="button"` / `tabIndex={0}` / `onKeyDown`. **Keyboard-only- und Screen-Reader-User können die 63 Karten nicht expandieren** — die ganze App ist für sie read-only. Chevron-Icon ist nur dekorativ.

**Empfehlung:** Card mit `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter+Space → toggle), `aria-expanded={expanded}`, `aria-controls={…}`. Gleicher Fix für TldrCard.

### 3. CSP / HSTS / Permissions-Policy fehlen in nginx

**Datei:** `nginx.conf`

**Problem:** Kommentar gibt zu „kein CSP da inline-styles via shadcn/Tailwind möglich". X-Frame, nosniff, Referrer-Policy sind drin — aber kein CSP, kein HSTS, kein Permissions-Policy.

**Empfehlung:**
```nginx
add_header Content-Security-Policy "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

### 4. CodeBlock Light-Mode Kontrast-Fails

**Datei:** `client/src/components/CodeBlock.tsx:34, 73`

**Problem:** Comment-Token `#a89a8a` auf Sepia-BG = **2.42:1** (fail WCAG AA für Normal-Text). Filename-Label `text-[#3a2f28]/50` ≈ **2.80:1** (fail). Sehbehinderte / ältere User verlieren Kommentare und Filenames komplett.

**Empfehlung:** Comment auf `#7a6a5a` (4.59:1), Label-Opacity `/50` → `/75`.

### 5. Ghost-CopyButton Light-Mode Kontrast 3.22:1

**Datei:** `client/src/components/CopyButton.tsx:44`

**Problem:** `text-[#c4704b]` auf hellem BG = **3.22:1** (fail WCAG AA für Normal-Text). Affects: alle Light-Mode-User der FinancialAnalyst-Page (7 Aufruf-Stellen).

**Empfehlung:** Dunkleres Terracotta `#a85d3e` als Default — erreicht ~4.5:1.

### 6. CopyButton ohne aria-label + kein SR-Status-Announce

**Datei:** `client/src/components/CopyButton.tsx`

**Problem:** Nur `title=` (nicht universell SR-gelesen), kein `aria-label`. „Kopiert!"-Zustandswechsel ist silent für Screen-Reader.

**Empfehlung:** `aria-label` + visually-hidden `<span role="status" aria-live="polite">` für Status.

### 7. Kein Route-Code-Splitting → 250→100-130 KB gz möglich

**Datei:** `client/src/App.tsx`

**Problem:** Alle 6 Pages statisch importiert (Home/Guide/FinancialAnalyst/TokenSpar/ClaudeDesign/ImportHistory). Bundle: 810 KB raw / 250 KB gz. Vite warnt seit Block A wegen >500 KB Chunk. FinancialAnalyst (953 LOC) und TokenSpar (909 LOC) sind die Schwergewichte.

**Empfehlung:** `lazy()` für alle 6 Pages + `<Suspense fallback={...}>` um Router. Wouter unterstützt das nativ. Geschätzte Einsparung initial-Route: **~120 KB gz** (-50%).

---

## MITTEL (10 Findings)

| # | Bereich | Finding |
|---|---|---|
| 8 | Daten | `nextStep` ↔ `installCommand` Drift in 12 von 18 Skills. **#13 Prompt Master** (`mkdir -p ~/.claude/skills && git clone…` vs `git clone…` ohne mkdir) und **#36 CLAUDE.md Optimizer** (`https://github.com/…` vs `github.com/…` ohne Präfix) sind faktisch kaputt im nextStep. |
| 9 | Security | Dockerfile läuft nginx implizit als root, kein HEALTHCHECK, kein Digest-Pin (`node:22-slim` + `nginx:alpine` als floating tags). |
| 10 | Security | Hidden-Page `noindex` ist Best-Effort (useEffect-inject) — Crawler ohne JS-Execution sehen die Page als indexierbar. Lösung: `add_header X-Robots-Tag "noindex, nofollow, noarchive"` für `/secret-import-history` in nginx + ggf. `robots.txt`. |
| 11 | A11y | Reduced-Motion wird nirgends respektiert (Framer-Motion ohne `useReducedMotion()` / `<MotionConfig reducedMotion="user">`). Affects: Vestibular-Disorder-User. |
| 12 | A11y | Install/CopyButton Touch-Targets ~24-32px. WCAG AA-Schwelle 24×24, AAA 44×44. |
| 13 | A11y | InstallCommandModal-Trigger ohne `aria-haspopup="dialog"` / `aria-expanded`. SR-User wissen nicht dass ein Dialog folgt. |
| 14 | A11y | Tier-Border-Farbe (`border-l-terracotta/sage/espresso`) ist einziger Tier-Indikator. Color-blind (Deutan/Protan): terracotta vs sage schwer trennbar. Lösung: Tier-Badge mit Text. |
| 15 | Code | Hex-Hardcode `#c4704b`/`#a85d3e` in CopyButton-Ghost-Variant statt `var(--color-terracotta)`. Bei Theme-Refactor laufen die auseinander. |
| 16 | Performance | framer-motion ubiquitär (8 Importe, ~80 KB gz). Mittelfristig durch CSS-Transitions ersetzbar (80% nur fade-in-on-scroll). Bei Code-Splitting (Finding 7) verteilt sich der Cost automatisch. |
| 17 | Performance | Kein `React.memo` auf SkillCard. Bei jedem Search-Tastendruck rendern alle 63 Cards neu. |

---

## NIEDRIG (11 Findings)

| # | Bereich | Finding |
|---|---|---|
| 18 | Code | `CodeBlock.tsx` hat 16 Hex-Werte inline statt CSS-Variablen. Bewusste Entscheidung laut Header-Comment, aber zementiert Token-Palette außerhalb von `index.css`. |
| 19 | Code | Doppelter Install-Guard (`Home.tsx:145 + 164`): Button und Modal-Wrapper prüfen beide `skill.installCommand`. Falls einer wegfällt würde `command=""` durchschlagen. |
| 20 | UX | `installNote` enthält Markdown-Backticks, die als Literal-Backticks gerendert werden. Lösung: Backticks raus oder Inline-Code-Regex-Behandlung. |
| 21 | Security | Kimi #16 installCommand exportet API-Key inline → landet in `~/.zsh_history`. Note ergänzen: „lieber in `~/.zshrc` oder `.envrc`". |
| 22 | UX | `claude plugin` (Shell) vs `/plugin` (Slash) Drift in installCommand-Strings. User ohne Kontext könnte Slash-Form ins Terminal kopieren. |
| 23 | A11y | CodeBlock-`<pre>` ohne `tabIndex={0}` + `role="region"` trotz `overflow-x-auto`. Keyboard-User kann nicht horizontal scrollen. |
| 24 | Performance | Dead UI-Components in `client/src/components/ui/` (recharts, react-day-picker, embla-carousel, vaul, input-otp, react-resizable-panels). Kein Bundle-Impact (tree-shaked), aber 11 MB node_modules + 18 Radix-Pakete vermutlich ungenutzt. |
| 25 | Performance | Bilder ohne `loading="lazy"`: `workflow-illustration.webp` (308 KB) und `claude-design-hero.webp` (77 KB) liegen unter dem Fold. |
| 26 | Performance | HTML hat keinen `Cache-Control`-Header. Browser entscheidet konservativ. Empfehlung: `no-cache` (= must-revalidate, schneller). |
| 27 | Performance | Brotli statt gzip wäre ~15% besser (250 KB gz → ~215 KB br). nginx:alpine hat das Brotli-Modul nicht standardmäßig. |
| 28 | Performance | CSS 22 KB gz ist akzeptabel für Tailwind v4 mit 51 ui/-Components, custom Theme und tw-animate. Wenn Dead-Components gelöscht werden (#24), reduziert sich das automatisch. |

---

## Aktionsplan in 3 Sprints

**Sprint A — Schadensbegrenzung** (~45 min, Findings #1+#4+#5)
- Externe-Tool-Referenzen aus Code + Spec + importHistory raus
- 3 Light-Mode-Kontrast-Fixes

**Sprint B — A11y-Fundament** (~60 min, Findings #2+#6+#11+#13)
- SkillCard + TldrCard keyboard-accessible
- CopyButton aria-label + live-region
- `<MotionConfig reducedMotion="user">` in App.tsx
- Install-Trigger aria-haspopup

**Sprint C — Security + Performance** (~45 min, Findings #3+#7+#17)
- nginx CSP + HSTS + Permissions-Policy + X-Robots-Tag für hidden page
- Route-Code-Splitting via `lazy/Suspense`
- React.memo auf SkillCard

**Bonus** (~10 min, Finding #8)
- nextStep-Fixes für #13 + #36 (faktisch kaputt)

**Bewusst vertagt** (MITTEL/NIEDRIG, Polish-Charakter): #9 (nginx-user), #10 (via Sprint C teilgelöst), #12 (Touch-Targets), #14 (Tier-Badge), #15 (CSS-Var statt Hex), #16 (Framer-Replacement), #18-#28 (alle NIEDRIG).

## Update 2026-05-14 — Sprint E/F/G/H/I/J/K (+ PR #2 für #9-Rest)

**Sprint E (`534f0ba`):** #15 CSS-Variablen + #12 Touch-Targets erledigt
**Sprint F (`86f674d`):** #14 Tier-Badge mit Text-Label erledigt
**Sprint G (`eb94fca`):** #9 teilerledigt (HEALTHCHECK + OCI-Labels; nginx-unprivileged + Digest-Pin als Followup im Dockerfile-Footer)
**Sprint H (`39ae602`):** PSI-Quick-Wins (viewport-Fix + SEO-Meta + Image-Re-Encode -43%) — nicht im Audit-Backlog aber durch PSI-Run getriggert
**Sprint I (`ce60fc7`):** #19 + #20 + #21 + #22 + #23 erledigt
**Sprint J (`3c37823`):** **#24 erledigt** — 39 dead ui/-Components + 26 Packages physisch entfernt. Build 4.78s → 2.43s (-49%), Bundle identisch (war schon tree-shaked).
**Sprint K (`4ddeb99`):** **#9 partial** — Digest-Pin für `node:22-slim` + `nginx:alpine`. Refresh-Procedure als Dockerfile-Comment dokumentiert.
**PR #2 (separate branch `chore/nginx-unprivileged`):** **#9 final-Rest** — `nginxinc/nginx-unprivileged:alpine`, listen 8080, EXPOSE 8080. Wartet auf User-Coolify-Port-Switch als Pre-Step.

**Akzeptiert as-is** (nicht fixable ohne neue Probleme):
- **#26 HTML Cache-Control** — `location = /index.html { add_header Cache-Control ... }` würde die nginx-Inheritance brechen und CSP/HSTS für /index.html verlieren (A+ Score weg). Browser-Default-Conditional-GET via ETag ist akzeptabel.
- **#27 Brotli statt gzip** — nginx:alpine hat das Brotli-Modul nicht standard. Alternativen: (a) Custom-Build nginx + brotli-source (heavy, eigenes Image pflegen), (b) Third-Party-Image z.B. `fholzer/nginx-brotli` (supply-chain-Risk, kein offizielles Image), (c) Cloudflare-Edge-Brotli (Cloudflare macht das eh schon für uns auf dem Weg zum Client). Vor allem (c) macht das hier vollkommen obsolet — gzip vom Origin → CF re-komprimiert mit Brotli zum Browser. **Accept-as-is.**
- **#16 Framer-motion-Replacement** — 80 KB gz, 8 Importe. CSS-Transitions würden 80% der Use-Cases abdecken (fade-in-on-scroll), aber `useScroll`/`useTransform`/`MotionConfig`-APIs sind tief integriert. Geschätzter Aufwand: 2h Engineering + 30min visuelles Polishing. **Risk-Item — eigene Session.** Recon-Notes:
  - Use-Sites (8): `Home.tsx` (Tier-Animations + Stagger), `Guide.tsx` (Scroll-Progress), `FinancialAnalyst.tsx` (Step-Reveal), `TokenSpar.tsx` (TabSwitching), `ClaudeDesign.tsx`, `ImportHistory.tsx`, `App.tsx` (MotionConfig), `InstallCommandModal.tsx`
  - APIs die ersetzt werden müssen: `motion.div` → `<div className="animate-...">`, `AnimatePresence` → `transition-opacity` mit `:not(.exiting)`, `useScroll` → `IntersectionObserver`, `MotionConfig reducedMotion="user"` → CSS `@media (prefers-reduced-motion: reduce)`.
  - Tailwind v4 `tw-animate-css` Plugin ist schon installiert — könnte 50% direkt ersetzen.

## Update 2026-05-15 — PR #4/#5/#6/#7 + Lighthouse-Re-Run

**PR #4 (`07655df`):** 5 Major-Bumps (TS 6, Vite 8, lucide v1, plugin-react 6, @types/node 25) — Code-Migrationen: baseUrl raus, Brand-Icons Inline-SVG.
**PR #5 (`8ca3ee8`):** **#16 erledigt** — framer-motion komplett raus, ~150 Sites auf `AnimatedReveal`/`CollapseReveal` (tw-animate-css + CSS-grid-collapse). Bundle −40.6 KB gz (−22%).
**PR #6 (`38c9f4e`):** Lighthouse-Re-Run nach #16 — fand 1 **Regression** + 4 pre-existing A11y-Findings:
  - **Regression**: `CollapseReveal` `aria-hidden` auf DOM-gemountetem Content (grid-collapse unmountet nicht wie Framers AnimatePresence) → WCAG `aria-hidden-focus`. Fix: `inert` statt `aria-hidden`.
  - **button-name**: `ProgressCheckbox` `ariaLabel`-Prop (Home+Guide kontextuell).
  - **target-size**: Checkbox 16px → `size-6` (24px). `::before`-Trick wirkungslos (axe misst boundingRect).
  - **landmark-one-main**: `<main>` zentral in App.tsx um Router.
  - **color-contrast (CTAs)**: neues `--color-sage-deep`, 9 Home solid+white Stellen auf `-deep`.
  - Production-Lighthouse: A11y **100**, BP 100, SEO 100. (Perf-Score Lab-Varianz, Bundle-Reduktion real.)
**PR #7 (`import-content` Skill):** Completion-Gate gegen Reflex #15 (Catalog-Commit-Skipping).

### Finding #29 — color-contrast (zweigeteilt)

**#29a — Opacity-Grays + muted-token: ✅ ERLEDIGT (PR #9, `fix/a11y-29…`).**
`text-[#3a2f28]/NN` + `dark:text-foreground/NN` (123 Ersetzungen): /40,/50→/70, /60,/65→/75 (axe-kalibrierte CR-Matrix, Light-Mode-Bottleneck, Text nie heller). `--muted-foreground` Light oklch 0.50→0.46 (war CR 4.28 auf bg-secondary). +2 Chevron-Buttons `aria-label`/`aria-expanded` (button-name). Strategie: Opacity-Bump statt Token-Hierarchie (90% Wert/20% Risiko, deterministisch).

**#29b — Hardcode-brand-color-Familie: 🔲 VERTAGT (eigener Token-Pass).**
Multi-Page-Lighthouse zeigte weitere kontextabhängige Hardcode-Contrast-Fails:
- `bg-[#c4704b]` + white text → CR 3.64 (Number-Badges/CTAs; sollten `var(--color-terracotta-deep)` wie Home nach PR #6)
- `text-[#c4704b]` (48×) / `text-[#7a9b6d]` (9×) auf hellen bgs → CR 3.1–3.4
- `text-white/40` auf espresso-Codeblock-bg (FA)
- terracotta-deep (#a5492b) auf #29211c (CopyButton im Codeblock) → CR 2.7
- `label` token-spar Form-Element (separates A11y-Audit, kein contrast)

Braucht semantische Token-Konsolidierung pro bg-Kontext (Text-auf-hell ≠ Badge-auf-tint ≠ auf-dunkel) + Light/Dark visuelle Verifikation jeder Stelle. Verwandt mit accepted-as-is **#18**. Kein mechanischer Bulk-Fix.

**Endstand 2026-05-15:** **7/7 HOCH + 10/10 MITTEL + 7/11 NIEDRIG erledigt** (= 24/28 = 86%; #16 via PR #5, #9-Rest via PR #2, #29a via PR #9).
Vertagt: **#29b** (Hardcode-brand-color-Familie, eigener Token-Pass).
Accept-as-is: #18, #25, #26, #27, #28, #9-Subitem 3 (Builder-USER node).

---

**Endstand 2026-05-14 Abend (historisch):** 7/7 HOCH + 9/10 MITTEL + 6/11 NIEDRIG (= 22/28 = 79%).

## Was gut war

- Refactor handwerklich sauber: kein Dead Code, keine non-null-assertions, keine vergessenen Imports
- Alle 18 `installCommand`-Strings frei von `rm`/`sudo`/`curl|sh`/http
- XSS-Surface clean (keine unsafe-HTML-Rendering-APIs in Render-Pfad)
- `.gitignore` clean, keine getrackten secrets
- **Dark-Mode-Kontrast ≥5.6:1** (Hotfix von gestern war ein voller A11y-Win)
- Radix-Dialog mit `open={false}` mountet keinen Portal-Tree → 18 Modals = 0 DOM-Kost
- `build-git-history.mjs` nutzt `execFileSync` (kein Shell-Injection)
