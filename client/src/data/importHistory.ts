/**
 * importHistory.ts — Curated metadata for the hidden /secret-import-history page.
 *
 * The `import-content` skill should append a new entry here on every run so the
 * timeline shows source URLs, channel names, and a human-readable summary
 * alongside the raw git commit. Join key is the commit's short hash.
 *
 * If an entry exists for a commit, the page renders the curated version. If
 * not, it falls back to the auto-generated git-log entry. So forgetting to
 * append here is non-fatal — you just lose the rich metadata.
 */

export type ImportType = "new" | "extend" | "refactor" | "meta";

export interface ImportSource {
  kind: "youtube" | "github" | "web" | "manual" | "docs";
  url?: string;
  channel?: string; // YouTube channel or site name
}

export interface ImportEntry {
  /** Short git hash (7 chars). Matches GitCommit.shortHash. */
  commit: string;
  /** Short, human-readable title. */
  title: string;
  /** What kind of change this was. */
  type: ImportType;
  /** Skills/Guide-categories touched (e.g. "Best Practice", "Plugin"). */
  categories?: string[];
  /** New skill IDs added in this commit. */
  newSkillIds?: number[];
  /** Existing skill IDs that were extended/refined. */
  extendedSkillIds?: number[];
  /** TL;DR slot rotation summary, if relevant. */
  tldrChange?: string;
  /** Source(s) the content came from. */
  sources?: ImportSource[];
  /** Free-form 1–2 sentence note. */
  notes?: string;
}

/**
 * Reverse-chronological order is enforced at render time by sorting on the
 * matching git-commit date, so insertion order here does not matter.
 */
export const importHistory: ImportEntry[] = [
  {
    commit: "4ddeb99",
    title: "Sprint K: Docker-Base-Image-Digests gepinnt (Audit #9 partial)",
    type: "refactor",
    categories: ["Security"],
    sources: [
      {
        kind: "manual",
        channel: "Audit-Followup (Post-Block-A 2026-05-13)",
      },
    ],
    notes:
      "node:22-slim und nginx:alpine waren floating tags — supply-chain-Risk durch Tag-Replacement-Attacks. Beide auf den heutigen Multi-Arch-Manifest-Digest gepinnt. Refresh-Procedure als Dockerfile-Comment dokumentiert (Docker-Hub-API + jq). Pflege monatlich oder bei jedem Coolify-Redeploy.",
  },
  {
    commit: "3c37823",
    title: "Sprint J: 39 dead shadcn-Components + 26 Packages weg (Audit #24)",
    type: "refactor",
    categories: ["Hygiene", "Build"],
    sources: [
      {
        kind: "manual",
        channel: "Audit-Followup (Post-Block-A 2026-05-13)",
      },
    ],
    notes:
      "Audit hatte 28 ungenutzte ui/-Components flagged. Grep zeigte: nur 14 von 53 sind tatsächlich importiert (button/card/checkbox/command/dialog/input/label/separator/sheet/skeleton/sonner/textarea/toggle/tooltip). Rest weg — plus 19 @radix-ui-Pakete + recharts + react-day-picker + embla-carousel-react + react-hook-form + react-resizable-panels + vaul + input-otp. Build-Zeit 4.78s → 2.43s (-49%), Bundle identisch (war schon tree-shaked), Lockfile -1314 Zeilen.",
  },
  {
    commit: "ca11929",
    title: "Slash-Commands /goal + /dream + Daily-Pipeline (SKAILE)",
    type: "new",
    categories: ["Workflow", "Best Practice"],
    newSkillIds: [65, 66, 67],
    extendedSkillIds: [11],
    sources: [
      {
        kind: "web",
        channel: "SKAILE / Sebastian Kauffmann",
        url: "https://goal.skaile.de/",
      },
    ],
    notes:
      "3 neue Skills aus dem Slash-Commands-Katalog: #65 /goal (Workflow Tier 1, autonom bis Ziel), #66 /dream (Best Practice Tier 1, Memory-Hygiene), #67 Daily-Pipeline (Workflow Tier 2 — Meta-Workflow /clear→/plan→/goal→/simplify→/handoff). #11 Power-Slash-Commands extended (/simplify-Bundle konkretisiert: 3-4 Agents, 4 Fokus-Bereiche, 3-8 Findings/Run). 8 Duplikate übersprungen, 3 Light-Mentions geskippt (/rewind /context /security-review). Wieder Catalog vom import-content-Skill vergessen — Step 7b ist die zweite Lücke heute (siehe Reflex #15 im aktuellen Session-Handoff).",
  },
  {
    commit: "2101de3",
    title: "Session-Handoff Skill (SKAILE Community)",
    type: "new",
    categories: ["Skill"],
    newSkillIds: [64],
    sources: [
      {
        kind: "web",
        channel: "SKAILE / Sebastian Kauffmann",
        url: "https://session.skaile.de/",
      },
    ],
    notes:
      "Skill #64 (Tier 2, Skill-Kategorie). 342-Zeilen-SKILL.md unter ~/.claude/skills/session-handoff/ schreibt am Ende einer Session ein strukturiertes Handoff-Dokument (TL;DR + adaptive Sektionen je Session-Typ + priorisiertes Pending + Copy-Paste-Quickstart + MEMORY.md-Index-Update). installCommand legt nur den Skelett-Ordner an — der 342-Zeilen-Body muss manuell aus der Copy-Box auf session.skaile.de in die SKILL.md gepasted werden. Erste Nutzung der neuen installCommand/installNote-Felder im Auto-Import. TL;DR-Rotation bewusst übersprungen (Cap 15 erreicht + Setup nicht 60-Sek-tauglich).",
  },
  {
    commit: "ce60fc7",
    title: "Sprint I: 5 NIEDRIG-Polish-Items (#19/#20/#21/#22/#23)",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Frühstücks-Polish-Sprint. Inline-Code-Rendering in installNote (Backticks → <code>), doppelter Install-Guard konsolidiert via single source-of-truth, Kimi-Key Shell-History-Warnung ergänzt, Slash- vs Shell-Command Auto-Detection im Modal (MessageSquare vs Terminal-Icon), CodeBlock <pre> mit tabIndex+role=region für Keyboard-Scroll. Finding #26 (HTML-Cache-Control) bewusst akzeptiert as-is wegen nginx-Inheritance-Quirk (würde CSP/HSTS auf /index.html brechen).",
  },
  {
    commit: "39ae602",
    title: "Sprint H: PageSpeed-Quick-Wins (Mobile +4, A11y +5, SEO +8)",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "PSI-Baseline 77/81/100/92 → 81/86/100/100 (Mobile). viewport maximum-scale=1 entfernt (A11y), Open-Graph+Twitter+canonical (SEO), 4 Hero-Images via Pillow auf 1280px width re-encoded (-324 KB / -43%), preload-hint für LCP, loading=lazy für below-fold. SEO + Best Practices jetzt perfekt 100/100.",
  },
  {
    commit: "eb94fca",
    title: "Sprint G: Dockerfile-Haertung (HEALTHCHECK + Labels)",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Audit Item #9 teilerledigt: HEALTHCHECK alle 30s via wget-Spider, OCI-Labels fuer Maintainability. nginx-unprivileged-Migration + Digest-Pins als Followup im Dockerfile-Footer dokumentiert (bedingen Coolify-Side-Changes).",
  },
  {
    commit: "86f674d",
    title: "Sprint F: Tier-Badge fuer Color-blind",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Audit Item #14: Tier-Information war vorher nur als Border-Farbe codiert (color-only-information). Jetzt explizites 'Tier 1/2/3/4' Text-Badge zwischen Checkbox und Category-Badge plus farbliche Codierung als redundancy.",
  },
  {
    commit: "534f0ba",
    title: "Sprint E: CSS-Variablen + Touch-Targets",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Audit #12 + #15: Hex-Hardcode (#a85d3e/etc.) durch 4 neue CSS-Vars (--color-terracotta-deep/-hover/-bright/-bright-hover) ersetzt. CopyButton Touch-Target ≥36px (Kompromiss zwischen WCAG AA-Min 24px und AAA-Empfehlung 44px), Ghost-Variant bleibt schmal.",
  },
  {
    commit: "8112e30",
    title: "Fix nextStep-Drift in #13 + #36 (Audit #8)",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Beide Skills hatten faktisch kaputte nextStep-Befehle: #13 ohne mkdir -p, #36 ohne https://-Praefix. Audit-Finding #8 (Daten-Drift) loeste das Symptom, jetzt sind nextStep + installCommand identisch und beide funktional.",
  },
  {
    commit: "392a05f",
    title: "Sprint C: nginx CSP/HSTS + Route-Code-Splitting + memo",
    type: "refactor",
    categories: ["Best Practice"],
    sources: [{ kind: "manual" }],
    notes:
      "Drei groessere Audit-Items: vollstaendige Security-Headers in nginx (CSP, HSTS, Permissions-Policy), Route-Code-Splitting via React.lazy/Suspense (Initial-Bundle 250 -> 183 KB gz, -27%), React.memo auf SkillCard. Hidden-Page jetzt server-seitig X-Robots-Tag noindex.",
  },
  {
    commit: "bce4bf1",
    title: "Sprint B: A11y-Fundament (Keyboard + ARIA + Reduced-Motion)",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "SkillCard + TldrCard keyboard-accessible (role=button, tabIndex, Enter/Space-Handler, aria-expanded/controls, focus-visible). CopyButton mit aria-label + visually-hidden live-region fuer Screen-Reader. MotionConfig reducedMotion=user. Install-Trigger mit aria-haspopup=dialog.",
  },
  {
    commit: "5455ee1",
    title: "Sprint A: externe-Tool-Refs raus + WCAG-AA Kontrast",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Schadensbegrenzung aus Post-Block-A-Audit: externe Tool-Referenzen aus Code/Spec/importHistory entfernt (5 Stellen + 3 Spec-Stellen). Light-Mode CodeBlock-Comments von 2.42:1 auf 4.59:1 (#7a6a5a), Filename-Label /50 -> /75, Ghost-CopyButton von 3.22:1 auf ~4.5:1 (#a85d3e).",
  },
  {
    commit: "ac531ee",
    title: "Post-Block-A Audit: 28 Findings (4-Spuren-Review)",
    type: "meta",
    sources: [{ kind: "manual" }],
    notes:
      "Read-only Audit nach Block A + Morgenarbeit. 4 parallele Spuren (Code-Quality, Security, Performance, A11y). Bilanz: 7 HOCH, 10 MITTEL, 11 NIEDRIG. Doc unter docs/audits/2026-05-13-post-block-a-audit.md.",
  },
  {
    commit: "1533238",
    title: "Refactor: 4 CopyButton-Duplikate konsolidiert + variant=ghost",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Cleanup nach Block A: ClaudeDesign/TokenSpar/Guide/FinancialAnalyst hatten je eine eigene CopyButton-Funktion (Code-Smell aus dem ursprünglichen Migrations-Backup). Globale Komponente um variant + cn()/twMerge erweitert. -68 LOC Duplikat-Code, terracotta-Look in FinancialAnalyst erhalten.",
  },
  {
    commit: "acc87c3",
    title: "12 weitere Install-Buttons befüllt (18/63 Skills)",
    type: "extend",
    sources: [{ kind: "manual" }],
    notes:
      "Pflege-Sweep nach Block A: Skills #3/#10/#13/#21/#22/#28/#35/#36/#38/#40/#51/#53 mit installCommand + installNote ergänzt. Alle Befehle idempotent (mkdir/git clone/plugin install/npx/export). Skill #36-URL gefixt (https-Präfix).",
  },
  {
    commit: "7f24d51",
    title: "Dark-Mode-Kontrast-Fix für CodeBlock",
    type: "refactor",
    sources: [{ kind: "manual" }],
    notes:
      "Hotfix nach erstem Block-A-Live-Deploy: Sepia-Token-Farben (#3a2f28) waren auf dunklem Espresso-BG unlesbar. Lösung: zwei separate PrismTheme-Objekte (Light: Sepia-on-Cream, Dark: Cream-on-Espresso), useTheme() schaltet um.",
  },
  {
    commit: "d2f2021",
    title: "Block A: CodeBlock + Install-Buttons (externe Roadmap)",
    type: "new",
    categories: ["Setup", "Best Practice"],
    sources: [{ kind: "manual" }],
    notes:
      "Externe Wettbewerbsanalyse Mai 2026 schlug 6 Features vor — nach Realitätsabgleich blieben 2 echte Lücken übrig (Newsletter/Upvoting/Submit/SEO bewusst verworfen). CodeBlock mit prism-react-renderer + Install-Modal für 6 Skills (#6/#7/#23/#43/#56/#62). Build +10 KB gz.",
  },
  {
    commit: "6a7494d",
    title: "AI Finance Team — WHY-first Rewrite",
    type: "refactor",
    categories: ["Financial Analyst"],
    extendedSkillIds: [47],
    sources: [
      {
        kind: "youtube",
        channel: "AI Finance Team",
        url: "https://www.youtube.com/@aifinanceteam",
      },
    ],
    notes:
      "Run 4: 100% Duplicate von Skill #47 erkannt (Ambiguity Gate A). User-Override → EXTEND mit WHY-first Re-Write, Pipeline-Präzision, workflow.md im nextStep.",
  },
  {
    commit: "a52d2b4",
    title: "Layered Analysis Prompt (5 Schichten)",
    type: "new",
    categories: ["Best Practice"],
    newSkillIds: [59],
    sources: [
      {
        kind: "youtube",
        channel: "AI Finance Team",
      },
    ],
    notes:
      "Run 3: Skill maß Finance-Bias (9/58 ≈ 15 %) und wählte trotz Finance-naher Quelle bewusst Kategorie „Best Practice“ → Anti-Bias-Selbstkorrektur. Prompt-Injection im WebSearch-Output korrekt ignoriert.",
  },
  {
    commit: "89393da",
    title: "Personal-Finance-Stack + Claude als Financial Advisor",
    type: "new",
    categories: ["Workflow", "Best Practice"],
    newSkillIds: [57, 58],
    sources: [{ kind: "youtube" }],
    notes:
      "Doppel-Skill: #57 Personal-Finance-Stack (Tier 3), #58 Claude als Personal Financial Advisor (Tier 1, mit warning-Feld).",
  },
  {
    commit: "fa49087",
    title: "Equity Research Plugin + Agent-Liste vervollständigt",
    type: "new",
    categories: ["Financial Analyst", "Plugin"],
    newSkillIds: [56],
    extendedSkillIds: [43],
    sources: [
      {
        kind: "github",
        url: "https://github.com/anthropics/financial-services",
      },
    ],
    notes:
      "Run 1: Neuer Skill #56 (Equity Research Plugin) + EXTEND von #43 mit kompletter 10-Agent-Liste. Plugin-Pfad korrigiert: anthropicis/claude-for-financial-services → anthropics/financial-services.",
  },
  {
    commit: "2aac0f6",
    title: "Claude Managed Agents (CMA) — Intro",
    type: "new",
    categories: ["Workflow"],
    newSkillIds: [55],
    notes: "Skill #55: Hosted-Agent-Setup, parallele Background-Tasks ohne lokale CLI.",
  },
  {
    commit: "6b4d976",
    title: "Agent View — Background-Sessions parallel",
    type: "new",
    categories: ["Workflow"],
    newSkillIds: [54],
    notes:
      "Erster Real-World-Run des import-content-Skills: Agent View für parallele Background-Sessions in Claude Code.",
  },
  {
    commit: "95eeaf3",
    title: "Drittquelle Follow-up FAQ integriert",
    type: "extend",
    categories: ["Workflow", "Best Practice"],
    sources: [{ kind: "manual" }],
    notes:
      "FAQ-Inhalte aus dem Migrations-Backup eingearbeitet: EXTEND-Rewrite statt append, TL;DR-Rotation Hard-Cap-15, Dry-Run-Mode ab 5+ Skills.",
  },
  {
    commit: "bc470b2",
    title: "Initial Release (53 Skills)",
    type: "meta",
    notes:
      "Die Webseite ging live auf https://ai-for-beginners.starcke.io mit 53 kuratierten Skills in 4 Tiers — Migration vom alten Stack abgeschlossen.",
  },
  {
    commit: "0b409d4",
    title: "Claude Code Beginner-Tutorial — 4 Tipps",
    type: "new",
    categories: ["Kosten-Hack", "Best Practice", "Setup", "Skill"],
    newSkillIds: [60, 61, 62, 63],
    sources: [
      {
        kind: "youtube",
        channel: "Zinho Automates",
        url: "https://www.youtube.com/@ZinhoAutomates",
      },
    ],
    notes:
      "Erster Run mit Cookie-Auth-Fix (--cookies-from-browser chrome) nach Bot-Block. 4 Tier-1-Skills aus 19-Min-Beginner-Tutorial: /effort, 5-Punkt-Spec, /init+globale CLAUDE.md, Screenshot-Paste. Kategorie-Balance gut gestreut (alle <15%). Kein TL;DR-Eintrag (Default-konservativ, /effort konzeptionell überlappend mit #50 ultrathink + #43 Cost-Stack).",
  },
];
