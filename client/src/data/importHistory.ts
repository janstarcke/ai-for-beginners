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
    title: "Manus Follow-up FAQ integriert",
    type: "extend",
    categories: ["Workflow", "Best Practice"],
    sources: [{ kind: "manual" }],
    notes:
      "Manus-FAQ-Inhalte aus dem Migrations-Backup eingearbeitet: EXTEND-Rewrite statt append, TL;DR-Rotation Hard-Cap-15, Dry-Run-Mode ab 5+ Skills.",
  },
  {
    commit: "bc470b2",
    title: "Initial Release (53 Skills)",
    type: "meta",
    notes:
      "Die Webseite ging live auf https://ai-for-beginners.starcke.io mit 53 kuratierten Skills in 4 Tiers — Migration weg von Manus abgeschlossen.",
  },
];
