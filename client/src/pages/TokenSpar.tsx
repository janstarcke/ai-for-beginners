import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { CodeBlock } from "@/components/CodeBlock";
import {
  ArrowLeft,
  Coins,
  Calculator,
  Zap,
  TrendingDown,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Terminal,
  Settings,
  Layers,
  ArrowRight,
  CheckCircle2,
  Circle,
  RotateCcw,
  ClipboardList,
} from "lucide-react";

/*
 * Design: Warm Craft — Playfair Display + DM Sans
 * Terracotta accents, cream backgrounds, espresso code blocks
 * Page: Token-Spar Guide — Kosten senken & Limits umgehen
 */

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface TokenTrick {
  id: number;
  name: string;
  category: "slash-command" | "konfiguration" | "plugin" | "workflow" | "modell";
  impact: "hoch" | "mittel" | "sehr hoch";
  setupTime: string;
  savings: string;
  description: string;
  command?: string;
  warning?: string;
}

const tokenTricks: TokenTrick[] = [
  {
    id: 1,
    name: "opusplan — Opus planen, Sonnet coden",
    category: "slash-command",
    impact: "hoch",
    setupTime: "5 Sekunden",
    savings: "~60% weniger Kosten",
    description: "Opus 4.7 fürs Planen, Sonnet 4.6 fürs Coden. Opus verbrennt Tokens wie verrückt — Sonnet reicht für 95% der Aufgaben.",
    command: "/opusplan",
  },
  {
    id: 2,
    name: "/compact — Chats komprimieren",
    category: "slash-command",
    impact: "hoch",
    setupTime: "1 Sekunde",
    savings: "~70% Context-Reduktion",
    description: "Sobald die Konversation lang wird, zieht jeder neue Prompt den ganzen Verlauf mit. /compact packt alles in eine kurze Zusammenfassung.",
    command: "/compact",
  },
  {
    id: 3,
    name: "ultrathink — Deep Reasoning vor dem Coden",
    category: "slash-command",
    impact: "mittel",
    setupTime: "1 Sekunde",
    savings: "~30% weniger Retries",
    description: "Magic Word das Claude zwingt, erst die komplette Lösung durchzudenken. Weniger Fehler = weniger Retries = weniger Tokens.",
    command: "ultrathink [dein prompt]",
  },
  {
    id: 4,
    name: "/clear — Sauberer Reset",
    category: "slash-command",
    impact: "hoch",
    setupTime: "1 Sekunde",
    savings: "100% alter Context weg",
    description: "Jeder neue Task verdient einen sauberen Context. Alter Chat wird bei jeder Nachricht mitgeladen und frisst Tokens für nichts.",
    command: "/clear",
  },
  {
    id: 5,
    name: "Plan Mode — Erst planen, dann coden",
    category: "slash-command",
    impact: "mittel",
    setupTime: "1 Sekunde",
    savings: "~40% weniger Trial-and-Error",
    description: "Claude schreibt erst einen Plan, du reviewst und kürzt, dann wird gecodet. Verhindert das größte Token-Loch: Trial-and-Error.",
    command: "Shift+Tab (2x)",
  },
  {
    id: 6,
    name: "CLAUDE.md kürzen (max 80 Zeilen)",
    category: "konfiguration",
    impact: "hoch",
    setupTime: "5 Minuten",
    savings: "Bis zu 5.000 Tokens/Nachricht",
    description: "Die CLAUDE.md wird bei JEDER Nachricht mitgeladen. 1000 Zeilen = konstanter Token-Verbrauch. Maximal 80 Zeilen, Rest in Sub-Dateien auslagern.",
  },
  {
    id: 7,
    name: "User-Memory aufräumen",
    category: "konfiguration",
    impact: "mittel",
    setupTime: "3 Minuten",
    savings: "~2.000 Tokens/Nachricht",
    description: "Globale User-Memory wird in JEDEM Projekt geladen. Wenn die voll ist, wird jeder Chat unnötig belastet.",
    command: "/memory",
  },
  {
    id: 8,
    name: "Ungenutzte MCPs disconnecten",
    category: "konfiguration",
    impact: "hoch",
    setupTime: "1 Minute",
    savings: "Bis zu 18.000 Tokens/Server",
    description: "Jeder verbundene MCP-Server lädt Tool-Definitionen bei JEDER Nachricht — bis zu 18.000 Tokens pro Server, auch wenn du ihn nicht nutzt.",
  },
  {
    id: 9,
    name: "Thinking-Budget senken",
    category: "konfiguration",
    impact: "hoch",
    setupTime: "2 Minuten",
    savings: "~70% Thinking-Tokens",
    description: "MAX_THINKING_TOKENS auf 10.000 senken. Standard ist viel höher und verschwendet bei einfachen Tasks massiv Tokens.",
    command: "MAX_THINKING_TOKENS: 10000",
  },
  {
    id: 10,
    name: "Caveman — Höhlenmensch-Stil",
    category: "plugin",
    impact: "mittel",
    setupTime: "1 Minute",
    savings: "65-75% Output-Tokens",
    description: "Claude antwortet ohne Höflichkeiten und lange Erklärungen. Real über eine Session: ~25% weniger Tokens gesamt.",
    command: "curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash",
  },
  {
    id: 11,
    name: "claude-mem — Persistent Memory",
    category: "plugin",
    impact: "mittel",
    setupTime: "2 Minuten",
    savings: "Keine Kontext-Rebuilds",
    description: "Claude erinnert sich über Sessions hinweg. Keine 'erklär nochmal was wir letztens gemacht haben'-Rebuilds mehr.",
    command: "npx claude-mem install",
  },
  {
    id: 12,
    name: "PDFs zu Markdown (MarkItDown)",
    category: "workflow",
    impact: "mittel",
    setupTime: "30 Sekunden",
    savings: "10-20x token-effizienter",
    description: "PDFs sind extrem token-hungrig. Markdown ist 10-20x effizienter bei gleichem Inhalt. Microsoft MarkItDown konvertiert in einer Sekunde.",
    command: "uvx markitdown deine-datei.pdf > deine-datei.md",
  },
  {
    id: 13,
    name: "Kimi K2.6 — 5x günstigeres Modell",
    category: "modell",
    impact: "sehr hoch",
    setupTime: "5 Minuten",
    savings: "5x Input, 6x Output günstiger",
    description: "Moonshot AI: $0.60/M Input, $2.50/M Output vs. Sonnet $3.00/M Input, $15.00/M Output. Vergleichbare Coding-Performance.",
    command: "export ANTHROPIC_BASE_URL=\"https://api.atlascloud.ai\"\nexport ANTHROPIC_MODEL=\"moonshot/kimi-k2.6\"",
    warning: "Alternatives Modell, nicht Anthropic. Bei komplexen Architekturfragen schwächer.",
  },
];

interface ModelPricing {
  name: string;
  inputPrice: number; // $ per 1M tokens
  outputPrice: number; // $ per 1M tokens
  thinkingPrice: number; // $ per 1M tokens (if applicable)
  speed: string;
  quality: string;
  bestFor: string;
}

const modelPricing: ModelPricing[] = [
  {
    name: "Claude Opus 4.7",
    inputPrice: 15.0,
    outputPrice: 75.0,
    thinkingPrice: 75.0,
    speed: "Langsam",
    quality: "Höchste",
    bestFor: "Architektur, komplexe Planung",
  },
  {
    name: "Claude Sonnet 4.6",
    inputPrice: 3.0,
    outputPrice: 15.0,
    thinkingPrice: 15.0,
    speed: "Schnell",
    quality: "Sehr hoch",
    bestFor: "95% aller Coding-Tasks",
  },
  {
    name: "Claude Haiku 3.5",
    inputPrice: 0.8,
    outputPrice: 4.0,
    thinkingPrice: 4.0,
    speed: "Sehr schnell",
    quality: "Gut",
    bestFor: "Sub-Agents, einfache Tasks",
  },
  {
    name: "Kimi K2.6 (Moonshot)",
    inputPrice: 0.6,
    outputPrice: 2.5,
    thinkingPrice: 2.5,
    speed: "Schnell",
    quality: "Hoch",
    bestFor: "Lange Sessions, Kosten-sensitiv",
  },
];

/* ------------------------------------------------------------------ */
/*  Mein Setup Checklist Data                                          */
/* ------------------------------------------------------------------ */

interface SetupItem {
  id: string;
  name: string;
  category: "slash-command" | "konfiguration" | "plugin" | "workflow" | "modell";
  difficulty: "einfach" | "mittel" | "fortgeschritten";
  description: string;
}

const setupItems: SetupItem[] = [
  { id: "setup-opusplan", name: "/opusplan aktivieren", category: "slash-command", difficulty: "einfach", description: "Opus plant, Sonnet codet" },
  { id: "setup-compact", name: "/compact bei langen Chats nutzen", category: "slash-command", difficulty: "einfach", description: "Context komprimieren ab 60%" },
  { id: "setup-clear", name: "/clear zwischen Tasks", category: "slash-command", difficulty: "einfach", description: "Sauberer Reset für jeden neuen Task" },
  { id: "setup-planmode", name: "Plan Mode (Shift+Tab)", category: "slash-command", difficulty: "einfach", description: "Erst planen, dann coden" },
  { id: "setup-ultrathink", name: "ultrathink nutzen", category: "slash-command", difficulty: "einfach", description: "Deep Reasoning vor komplexen Tasks" },
  { id: "setup-claudemd", name: "CLAUDE.md auf max 80 Zeilen kürzen", category: "konfiguration", difficulty: "mittel", description: "Rest in Sub-Dateien auslagern" },
  { id: "setup-memory", name: "User-Memory aufräumen", category: "konfiguration", difficulty: "mittel", description: "Globale Memory schlank halten" },
  { id: "setup-mcps", name: "Ungenutzte MCPs disconnecten", category: "konfiguration", difficulty: "mittel", description: "Bis zu 18k Tokens pro Server sparen" },
  { id: "setup-thinking", name: "MAX_THINKING_TOKENS: 10000", category: "konfiguration", difficulty: "mittel", description: "In ~/.claude/settings.json setzen" },
  { id: "setup-caveman", name: "Caveman installieren", category: "plugin", difficulty: "mittel", description: "65-75% weniger Output-Tokens" },
  { id: "setup-claudemem", name: "claude-mem installieren", category: "plugin", difficulty: "mittel", description: "Persistent Memory über Sessions" },
  { id: "setup-markitdown", name: "MarkItDown für PDFs nutzen", category: "workflow", difficulty: "einfach", description: "10-20x token-effizienter als PDF" },
  { id: "setup-kimi", name: "Kimi K2.6 einrichten", category: "modell", difficulty: "fortgeschritten", description: "5x günstiger für lange Sessions" },
];

const SETUP_STORAGE_KEY = "token-spar-mein-setup";

function useSetupChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(SETUP_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const reset = useCallback(() => {
    setChecked({});
  }, []);

  const completedCount = Object.values(checked).filter(Boolean).length;

  return { checked, toggle, reset, completedCount };
}

/* CopyButton wurde nach client/src/components/CopyButton.tsx ausgelagert;
 * lokale Aufrufe sind durch CodeBlock ersetzt worden (siehe Block A). */

function TrickCard({ trick }: { trick: TokenTrick }) {
  const [expanded, setExpanded] = useState(false);

  const impactColor =
    trick.impact === "sehr hoch"
      ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
      : trick.impact === "hoch"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
      : "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300";

  const categoryIcon =
    trick.category === "slash-command" ? <Terminal className="w-4 h-4" /> :
    trick.category === "konfiguration" ? <Settings className="w-4 h-4" /> :
    trick.category === "plugin" ? <Layers className="w-4 h-4" /> :
    trick.category === "workflow" ? <Zap className="w-4 h-4" /> :
    <Sparkles className="w-4 h-4" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: trick.id * 0.04 }}
      className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] shrink-0 mt-0.5">
          {categoryIcon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm">{trick.name}</h3>
            <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${impactColor}`}>
              {trick.impact}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{trick.setupTime}</span>
            <span className="font-medium text-[var(--color-sage)] dark:text-green-400">{trick.savings}</span>
          </div>
        </div>
        <span className="text-muted-foreground shrink-0 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-4 pb-4 space-y-3"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">{trick.description}</p>
          {trick.command && (
            <CodeBlock code={trick.command} language="bash" filename="Trick" />
          )}
          {trick.warning && (
            <div className="flex items-start gap-2 p-2.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">{trick.warning}</p>
            </div>
          )}

        </motion.div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function TokenSpar() {
  const [sessionTokens, setSessionTokens] = useState(500000);
  const [sessionsPerDay, setSessionsPerDay] = useState(3);
  const [selectedModel, setSelectedModel] = useState("Claude Sonnet 4.6");
  const [outputRatio, setOutputRatio] = useState(0.3); // 30% output tokens
  const { checked: setupChecked, toggle: setupToggle, reset: setupReset, completedCount: setupCompleted } = useSetupChecklist();

  const selectedModelData = useMemo(
    () => modelPricing.find((m) => m.name === selectedModel) || modelPricing[1],
    [selectedModel]
  );

  const costCalculation = useMemo(() => {
    const inputTokens = sessionTokens * (1 - outputRatio);
    const outputTokens = sessionTokens * outputRatio;

    return modelPricing.map((model) => {
      const dailyCost =
        ((inputTokens / 1_000_000) * model.inputPrice +
          (outputTokens / 1_000_000) * model.outputPrice) *
        sessionsPerDay;
      const monthlyCost = dailyCost * 22; // work days
      return {
        ...model,
        dailyCost,
        monthlyCost,
      };
    });
  }, [sessionTokens, sessionsPerDay, outputRatio]);

  const categories = [
    { key: "slash-command", label: "Slash Commands", count: tokenTricks.filter(t => t.category === "slash-command").length },
    { key: "konfiguration", label: "Konfiguration", count: tokenTricks.filter(t => t.category === "konfiguration").length },
    { key: "plugin", label: "Plugins", count: tokenTricks.filter(t => t.category === "plugin").length },
    { key: "workflow", label: "Workflow", count: tokenTricks.filter(t => t.category === "workflow").length },
    { key: "modell", label: "Modell-Wechsel", count: tokenTricks.filter(t => t.category === "modell").length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-terracotta)]/5 via-background to-[var(--color-sage)]/5" />
        <div className="relative container py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-terracotta)]/10 flex items-center justify-center">
                <Coins className="w-5 h-5 text-[var(--color-terracotta)]" />
              </div>
              <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-terracotta)]">
                Token-Optimierung & Kosten senken
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-3xl font-[var(--font-display)]">
              Token-Spar Guide
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Alle Tricks, Konfigurationen und Modell-Alternativen um Claude Code Limits zu umgehen
              und Kosten um bis zu 80% zu senken.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
                <TrendingDown className="w-4 h-4 text-[var(--color-sage)]" />
                <span className="text-foreground font-medium">Bis zu 80% Kosten-Reduktion</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-foreground font-medium">5 Slash Commands</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
                <Calculator className="w-4 h-4 text-[var(--color-terracotta)]" />
                <span className="text-foreground font-medium">Interaktiver Kosten-Rechner</span>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Cost Calculator Section */}
      <section className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-5 h-5 text-[var(--color-terracotta)]" />
            <h2 className="text-2xl font-bold text-foreground font-[var(--font-display)]">
              Kosten-Rechner
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
            {/* Input Panel */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-5">
              <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Deine Nutzung</h3>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Tokens pro Session: <span className="text-foreground font-bold">{(sessionTokens / 1000).toFixed(0)}k</span>
                </label>
                <input
                  type="range"
                  min={50000}
                  max={2000000}
                  step={50000}
                  value={sessionTokens}
                  onChange={(e) => setSessionTokens(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-[var(--color-terracotta)]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>50k</span>
                  <span>2M</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Sessions pro Tag: <span className="text-foreground font-bold">{sessionsPerDay}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={sessionsPerDay}
                  onChange={(e) => setSessionsPerDay(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-[var(--color-terracotta)]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>1</span>
                  <span>20</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">
                  Output-Anteil: <span className="text-foreground font-bold">{(outputRatio * 100).toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={0.7}
                  step={0.05}
                  value={outputRatio}
                  onChange={(e) => setOutputRatio(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer accent-[var(--color-terracotta)]"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>10% Output</span>
                  <span>70% Output</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground">
                  Berechnung: (Input-Tokens × Input-Preis + Output-Tokens × Output-Preis) × Sessions × 22 Arbeitstage
                </p>
              </div>
            </div>

            {/* Results Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left p-3 font-semibold text-foreground">Modell</th>
                      <th className="text-right p-3 font-semibold text-foreground">Input $/M</th>
                      <th className="text-right p-3 font-semibold text-foreground">Output $/M</th>
                      <th className="text-right p-3 font-semibold text-foreground">Täglich</th>
                      <th className="text-right p-3 font-semibold text-foreground">Monatlich</th>
                      <th className="text-left p-3 font-semibold text-foreground">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costCalculation.map((model, i) => (
                      <tr
                        key={model.name}
                        className={`border-b border-border last:border-0 transition-colors ${
                          model.name === selectedModel
                            ? "bg-[var(--color-terracotta)]/5"
                            : "hover:bg-secondary/30"
                        }`}
                      >
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedModel(model.name)}
                            className="font-medium text-foreground hover:text-[var(--color-terracotta)] transition-colors text-left"
                          >
                            {model.name}
                          </button>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{model.speed} · {model.quality}</div>
                        </td>
                        <td className="p-3 text-right font-mono text-xs text-muted-foreground">
                          ${model.inputPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono text-xs text-muted-foreground">
                          ${model.outputPrice.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-mono text-xs font-medium text-foreground">
                          ${model.dailyCost.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          <span className={`font-mono text-xs font-bold ${
                            i === 0 ? "text-red-600 dark:text-red-400" :
                            i === costCalculation.length - 1 ? "text-green-600 dark:text-green-400" :
                            "text-foreground"
                          }`}>
                            ${model.monthlyCost.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{model.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Savings Summary */}
              <div className="p-4 bg-[var(--color-sage)]/10 dark:bg-green-950/20 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-[var(--color-sage)] dark:text-green-400" />
                  <span className="text-sm font-semibold text-foreground">Einspar-Potenzial</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Opus → Sonnet</p>
                    <p className="text-sm font-bold text-[var(--color-sage)] dark:text-green-400">
                      {costCalculation.length >= 2
                        ? `-${((1 - costCalculation[1].monthlyCost / costCalculation[0].monthlyCost) * 100).toFixed(0)}%`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Opus → Kimi K2.6</p>
                    <p className="text-sm font-bold text-[var(--color-sage)] dark:text-green-400">
                      {costCalculation.length >= 4
                        ? `-${((1 - costCalculation[3].monthlyCost / costCalculation[0].monthlyCost) * 100).toFixed(0)}%`
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground">Sonnet → Kimi K2.6</p>
                    <p className="text-sm font-bold text-[var(--color-sage)] dark:text-green-400">
                      {costCalculation.length >= 4
                        ? `-${((1 - costCalculation[3].monthlyCost / costCalculation[1].monthlyCost) * 100).toFixed(0)}%`
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tricks Section */}
      <section className="container py-12 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-[var(--color-terracotta)]" />
            <h2 className="text-2xl font-bold text-foreground font-[var(--font-display)]">
              13 Token-Spar-Tricks
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Sortiert nach Schwierigkeit. Von Slash Commands die in einer Sekunde laufen bis zum Modell-Wechsel.
          </p>

          {/* Category Groups */}
          {categories.map((cat) => (
            <div key={cat.key} className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {cat.label}
                </h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                  {cat.count} Tricks
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {tokenTricks
                  .filter((t) => t.category === cat.key)
                  .map((trick) => (
                    <TrickCard key={trick.id} trick={trick} />
                  ))}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Quick Reference Table */}
      <section className="container py-12 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground font-[var(--font-display)] mb-6">
            Quick Reference — Modell-Vergleich
          </h2>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-3 font-semibold text-foreground">Eigenschaft</th>
                    {modelPricing.map((m) => (
                      <th key={m.name} className="text-center p-3 font-semibold text-foreground text-xs">
                        {m.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Input-Preis</td>
                    {modelPricing.map((m) => (
                      <td key={m.name} className="p-3 text-center font-mono text-xs text-muted-foreground">
                        ${m.inputPrice.toFixed(2)}/M
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Output-Preis</td>
                    {modelPricing.map((m) => (
                      <td key={m.name} className="p-3 text-center font-mono text-xs text-muted-foreground">
                        ${m.outputPrice.toFixed(2)}/M
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Geschwindigkeit</td>
                    {modelPricing.map((m) => (
                      <td key={m.name} className="p-3 text-center text-xs text-muted-foreground">
                        {m.speed}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-foreground">Qualität</td>
                    {modelPricing.map((m) => (
                      <td key={m.name} className="p-3 text-center text-xs text-muted-foreground">
                        {m.quality}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-foreground">Empfohlen für</td>
                    {modelPricing.map((m) => (
                      <td key={m.name} className="p-3 text-center text-xs text-muted-foreground">
                        {m.bestFor}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="mt-6 p-5 rounded-xl border border-[var(--color-sage)]/30 bg-[var(--color-sage)]/5 dark:bg-green-950/20">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--color-sage)]" />
              Empfohlene Strategie
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">Für Planung:</strong> Opus 4.7 via /opusplan (automatisch)</p>
              <p><strong className="text-foreground">Für 95% des Codens:</strong> Sonnet 4.6 (Standard)</p>
              <p><strong className="text-foreground">Für Sub-Agents:</strong> Haiku 3.5 (CLAUDE_CODE_SUBAGENT_MODEL: haiku)</p>
              <p><strong className="text-foreground">Für lange Budget-Sessions:</strong> Kimi K2.6 via Atlas Cloud</p>
              <p className="pt-2 text-xs border-t border-border mt-3">
                Kombiniert mit /compact, /clear, Caveman und CLAUDE.md-Optimierung erreichst du <strong className="text-[var(--color-sage)] dark:text-green-400">70-80% Kosten-Reduktion</strong> gegenüber reinem Opus-Betrieb.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mein Setup Checklist */}
      <section className="container py-12 border-t border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-[var(--color-terracotta)]" />
              <h2 className="text-2xl font-bold text-foreground font-[var(--font-display)]">
                Mein Setup
              </h2>
              {setupCompleted > 0 && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-sage-light)] text-[var(--color-espresso)] dark:bg-green-950/40 dark:text-green-300">
                  {setupCompleted} / {setupItems.length} aktiviert
                </span>
              )}
            </div>
            {setupCompleted > 0 && (
              <button
                onClick={setupReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                title="Checkliste zurücksetzen"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Hake ab, welche Tricks du bereits aktiviert hast. Dein Fortschritt wird lokal gespeichert.
          </p>

          {/* Progress Bar */}
          {setupCompleted > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  {((setupCompleted / setupItems.length) * 100).toFixed(0)}% optimiert
                </span>
                <span className="text-xs text-muted-foreground">
                  {setupCompleted}/{setupItems.length}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-sage)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(setupCompleted / setupItems.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          {/* Checklist Grid */}
          <div className="grid gap-2 md:grid-cols-2">
            {setupItems.map((item) => {
              const isChecked = setupChecked[item.id] || false;
              const difficultyColor =
                item.difficulty === "einfach" ? "text-green-600 dark:text-green-400" :
                item.difficulty === "mittel" ? "text-amber-600 dark:text-amber-400" :
                "text-red-600 dark:text-red-400";

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setupToggle(item.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isChecked
                      ? "border-[var(--color-sage)]/50 bg-[var(--color-sage)]/5 dark:bg-green-950/20"
                      : "border-border bg-card hover:bg-secondary/30"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">
                      {isChecked ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-sage)] dark:text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/40" />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        isChecked ? "text-muted-foreground line-through" : "text-foreground"
                      }`}>
                        {item.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">{item.description}</span>
                        <span className={`text-[10px] font-medium ${difficultyColor}`}>
                          {item.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Completion Message */}
          {setupCompleted === setupItems.length && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 p-4 rounded-xl border border-[var(--color-sage)]/40 bg-[var(--color-sage)]/10 dark:bg-green-950/30 text-center"
            >
              <Sparkles className="w-6 h-6 text-[var(--color-sage)] dark:text-green-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Setup komplett!</p>
              <p className="text-xs text-muted-foreground mt-1">
                Du nutzt alle 13 Token-Spar-Tricks. Maximale Kosten-Effizienz erreicht.
              </p>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Footer Navigation */}
      <footer className="container py-10 border-t border-border">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Startseite
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Beginner-to-Pro Guide
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/financial-analyst"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Financial Analyst
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </footer>
    </div>
  );
}
