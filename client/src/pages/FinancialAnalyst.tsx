import { useState } from "react";
import { AnimatedReveal, CollapseReveal } from "@/components/AnimatedReveal";
import { Link } from "wouter";
import { CopyButton } from "@/components/CopyButton";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Bot,
  Database,
  Terminal,
  Zap,
  ExternalLink,
  Sparkles,
  Shield,
  Clock,
  Users,
  FileSpreadsheet,
  Brain,
  Workflow,
} from "lucide-react";

/*
 * Design: Warm Craft — Playfair Display + DM Sans
 * Terracotta accents, cream backgrounds, espresso code blocks
 * Financial Analyst dedicated page
 */

const FINANCE_HERO =
  "/images/finance-hero.webp";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Agent {
  name: string;
  category: string;
  description: string;
  skills: string[];
}

const agents: Agent[] = [
  {
    name: "Pitch Builder",
    category: "Coverage & Advisory",
    description: "Erstellt gebrandete Pitch Decks mit Comps, Precedent Transactions und LBO-Analysen.",
    skills: ["Comps", "Precedent Transactions", "LBO", "Deck-Generierung"],
  },
  {
    name: "Meeting Prep Agent",
    category: "Coverage & Advisory",
    description: "Generiert Client-Meeting-Briefing-Packs mit allen relevanten Daten und Gesprächspunkten.",
    skills: ["Client Research", "Agenda-Erstellung", "Key Metrics"],
  },
  {
    name: "Market Researcher",
    category: "Research & Modeling",
    description: "Erstellt Sektor-/Themen-Überblicke und Peer-Vergleiche. Tägliche Briefings für dein Portfolio.",
    skills: ["Sektor-Analyse", "Peer Comps", "Daily Brief", "Analyst Ratings"],
  },
  {
    name: "Earnings Reviewer",
    category: "Research & Modeling",
    description: "Analysiert Earnings Calls, cross-referenziert mit Vorquartalen, generiert Equity Research Notes.",
    skills: ["/earnings-analysis", "Transcript-Parsing", "Guidance-Tracking", "Risk-Flagging"],
  },
  {
    name: "Model Builder",
    category: "Research & Modeling",
    description: "Baut DCF-, LBO- und 3-Statement-Modelle. Output als .xlsx mit Sensitivity-Analyse und Szenarien.",
    skills: ["/dcf", "/comps", "LBO-Modell", "Sensitivity Tables"],
  },
  {
    name: "Valuation Reviewer",
    category: "Fund Admin & Finance Ops",
    description: "Ingested GP-Packages, führt Valuation-Templates aus, staged LP Reporting.",
    skills: ["GP-Package-Parsing", "Template-Mapping", "Anomaly Detection"],
  },
  {
    name: "GL Reconciler",
    category: "Fund Admin & Finance Ops",
    description: "Findet Breaks in Ledger-Reconciliations, Root-Cause-Tracing, EBITDA-Bridge-Generierung.",
    skills: ["Break Detection", "Waterfall Charts", "Commentary", "Root Cause"],
  },
  {
    name: "Month-End Closer",
    category: "Fund Admin & Finance Ops",
    description: "Automatisiert den Monatsabschluss-Prozess mit standardisierten Checks und Validierungen.",
    skills: ["Closing Checklist", "Validation", "Reconciliation"],
  },
  {
    name: "Statement Auditor",
    category: "Fund Admin & Finance Ops",
    description: "Auditiert LP-Statements vor Distribution, kompiliert LP Reporting Packs.",
    skills: ["Statement-Audit", "LP Pack", "Distribution-Check"],
  },
  {
    name: "KYC Screener",
    category: "Operations & Onboarding",
    description: "Parst Onboarding-Dokumente, führt Rules Engine aus, flaggt Lücken und Compliance-Issues.",
    skills: ["Doc-Parsing", "Rules Engine", "Gap Detection", "Compliance"],
  },
];

const slashCommands = [
  { command: "/dcf", description: "Discounted Cash Flow Modell erstellen", example: "/dcf AAPL → Vollständiges DCF als .xlsx mit Bear/Base/Bull Cases" },
  { command: "/comps", description: "Comparable Company Analysis", example: "/comps NVDA → Peer-Vergleich mit EV/EBITDA, P/E, Revenue Growth" },
  { command: "/earnings", description: "Earnings Call Analyse", example: "/earnings MSFT → Research Note mit Guidance-Changes und Risiken" },
  { command: "/ic-memo", description: "Investment Committee Memo", example: "/ic-memo TSLA → Strukturiertes IC-Memo mit Thesis und Risiken" },
];

const mcpConnectors = [
  { name: "Daloopa", type: "Financial Data", description: "Automatisierte Finanzdaten-Extraktion aus SEC Filings" },
  { name: "S&P Global", type: "Market Intelligence", description: "Ratings, Research, Marktdaten" },
  { name: "FactSet", type: "Financial Data", description: "Fundamentaldaten, Estimates, Analytics" },
  { name: "Morningstar", type: "Research", description: "Fund-Analyse, Ratings, Equity Research" },
  { name: "PitchBook", type: "Private Markets", description: "PE/VC Deals, Valuations, Fund Performance" },
  { name: "LSEG", type: "Market Data", description: "London Stock Exchange Group Daten" },
  { name: "Moody's", type: "Credit", description: "Credit Ratings, Risiko-Analyse" },
  { name: "MT Newswires", type: "News", description: "Echtzeit-Finanznachrichten" },
  { name: "Aiera", type: "AI Research", description: "AI-gestützte Earnings & Event Analysis" },
  { name: "Chronograph", type: "PE/VC", description: "Portfolio Monitoring, LP Reporting" },
  { name: "Egnyte", type: "Document", description: "Sichere Dokumentenverwaltung" },
];

const financeTeamRoles = [
  {
    role: "Revenue Operations Manager",
    icon: <TrendingUp className="w-5 h-5" />,
    inputs: ["customer_data.csv", "subscription_data.csv", "pricing_plans.csv"],
    outputs: ["mrr_summary.csv"],
    tasks: "MRR, ARR, Churn Rate, Customer Growth, Revenue nach Plan",
  },
  {
    role: "Financial Control Manager",
    icon: <Shield className="w-5 h-5" />,
    inputs: ["transactions.csv", "invoices.csv"],
    outputs: ["financial_summary.csv", "expense_summary.csv"],
    tasks: "Transaktions-Klassifizierung, Revenue-Validierung, P&L-Aggregation",
  },
  {
    role: "FP&A Manager",
    icon: <BarChart3 className="w-5 h-5" />,
    inputs: ["mrr_summary.csv", "financial_summary.csv", "assumptions.md"],
    outputs: ["forecast_summary.csv"],
    tasks: "12-Monats-Projektion, Szenario-Analyse, Forecast vs. Actual",
  },
  {
    role: "Reporting & Strategy Manager",
    icon: <FileSpreadsheet className="w-5 h-5" />,
    inputs: ["financial_summary.csv", "forecast_summary.csv", "company_context.md"],
    outputs: ["executive_report.md"],
    tasks: "5-Sektionen Executive Report, Leadership-Briefing",
  },
  {
    role: "Workflow Coordinator",
    icon: <Workflow className="w-5 h-5" />,
    inputs: ["Alle Rollen-Dateien"],
    outputs: ["Gesamte Pipeline"],
    tasks: "Orchestrierung: Revenue Ops → Control → FP&A → Reporting (ein Prompt)",
  },
];

const tradingRoutines = [
  { time: "06:00", name: "Pre-Market Research", action: "Recherchiert Katalysatoren, erstellt Watchlist, schreibt RESEARCH-LOG.md" },
  { time: "08:30", name: "Market Open", action: "Führt geplante Trades aus, setzt 10% Trailing Stops, schreibt TRADE-LOG.md" },
  { time: "12:00", name: "Midday Scan", action: "Prüft Positionen, schneidet Verlierer bei -7%, verschärft Stops" },
  { time: "15:00", name: "Daily Summary", action: "Portfolio-Snapshot, P&L-Berechnung, S&P 500 Vergleich, Report via ClickUp" },
  { time: "Fr 16:00", name: "Weekly Review", action: "Wochenauswertung, Lessons Learned, TRADING-STRATEGY.md Update" },
];

const practicalTips = [
  {
    title: "Assumptions prüfen!",
    description: "AI-generierte Modelle nutzen oft veraltete Annahmen. IMMER Revenue-Projektionen, WACC und Terminal Growth Rate manuell validieren. 'A clean DCF built on bad assumptions is still a bad DCF.'",
  },
  {
    title: "Weniger Names, bessere Arbeit",
    description: "Nutze die gewonnene Geschwindigkeit für TIEFERE Analyse weniger Aktien — nicht für oberflächliche Analyse vieler Aktien.",
  },
  {
    title: "Custom Formatting nutzen",
    description: "Du musst nicht das Standard-Format von Claude nutzen. Gib dein eigenes Excel-Template vor und lass Claude nur die Daten einfüllen.",
  },
  {
    title: "Execution Traces auditieren",
    description: "Bei Managed Agents: Immer den Execution Trace prüfen, um nachzuvollziehen woher eine Zahl kommt und welche Quellen genutzt wurden.",
  },
  {
    title: "Exceptions-Fokus",
    description: "Lass Agents die Routine-Arbeit erledigen. Fokussiere dich nur auf Items, die als 'Needs Review' geflaggt werden.",
  },
  {
    title: "Paper Trading ZUERST",
    description: "Trading-Agent IMMER zuerst im Paper-Trading-Modus testen. Guardrails definieren: Max 5% pro Position, -2% Daily Loss Cap, Max 3 Trades/Woche.",
  },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */
/* CopyButton wurde nach client/src/components/CopyButton.tsx ausgelagert.
 * Hier nutzen wir variant="ghost" für den terracotta-Akzent-Look. */

function AgentCard({ agent, index }: { agent: Agent; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const categoryColor =
    agent.category === "Coverage & Advisory"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      : agent.category === "Research & Modeling"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
      : agent.category === "Fund Admin & Finance Ops"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";

  return (
    <AnimatedReveal slide="up" delay={index * 0.05} className="bg-[#faf8f5] dark:bg-card rounded-xl border border-[#3a2f28]/8 dark:border-foreground/8 overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#c4704b]/10 text-[var(--color-terracotta-deep)] text-xs font-bold">
                {index + 1}
              </span>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${categoryColor}`}>
                {agent.category}
              </span>
            </div>
            <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] text-sm">
              {agent.name}
            </h3>
            <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75 mt-1 leading-relaxed">
              {agent.description}
            </p>
          </div>
          <button
            aria-label={`${agent.name} ${expanded ? "einklappen" : "ausklappen"}`}
            aria-expanded={expanded}
            className="text-[#3a2f28]/70 dark:text-foreground/70 hover:text-[#3a2f28] dark:hover:text-foreground transition-colors shrink-0 mt-1"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <CollapseReveal open={expanded}>
        <div className="px-4 pb-4 pt-0 border-t border-[#3a2f28]/5 dark:border-foreground/5">
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#3a2f28]/70 dark:text-foreground/70 mb-1.5">
                  Skills & Commands
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-[#3a2f28]/5 dark:bg-foreground/5 text-[#3a2f28]/70 dark:text-foreground/70 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
        </div>
      </CollapseReveal>
    </AnimatedReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FinancialAnalyst() {
  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-background">
      {/* ---- Hero ---- */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={FINANCE_HERO}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0eb]/50 via-[#f5f0eb]/80 to-[#f5f0eb] dark:from-background/50 dark:via-background/80 dark:to-background" />
        </div>

        <div className="relative container py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#3a2f28]/70 dark:text-foreground/70 hover:text-[#3a2f28] dark:hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Wissensdatenbank
          </Link>

          <AnimatedReveal slide="up" duration={600}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-terracotta-deep)]">
                Multi-Agent Workflows für Finanzanalyse
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-[#3a2f28] dark:text-foreground leading-tight max-w-3xl font-['Playfair_Display',serif]">
              Claude für
              <br />
              <span className="text-[var(--color-terracotta-deep)]">Financial Analysts</span>
            </h1>

            <p className="mt-5 text-lg text-[#3a2f28]/75 dark:text-foreground/75 max-w-2xl leading-relaxed">
              Institutionelle Analyse-Tools für alle. DCF-Modelle in 2 Minuten statt 2 Tagen,
              automatisierte Earnings-Analyse, Multi-Agent-Workflows und direkte Anbindung
              an professionelle Finanzdaten-Provider.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://github.com/anthropics/financial-services"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-terracotta-deep)] text-white font-medium text-sm hover:bg-[var(--color-terracotta-deep-hover)] transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub Repo öffnen
              </a>
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-card text-[#3a2f28] dark:text-foreground font-medium text-sm hover:bg-[#3a2f28]/5 dark:hover:bg-foreground/5 transition-colors border border-[#3a2f28]/15 dark:border-foreground/15"
              >
                Zum Claude Code Guide
              </Link>
            </div>
          </AnimatedReveal>
        </div>
      </header>

      {/* ---- Setup Section ---- */}
      <section className="container py-10">
        <AnimatedReveal slide="up" className="bg-[#3a2f28] rounded-xl p-6 md:p-8 max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
            <h2 className="text-xl font-bold text-white font-['Playfair_Display',serif]">
              Schnellstart: Installation
            </h2>
          </div>
          <p className="text-white/60 text-sm mb-5 leading-relaxed">
            Drei Befehle im Terminal — und du hast Zugriff auf institutionelle Finance-Tools.
          </p>
          <div className="space-y-3">
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs">1. Marketplace hinzufügen</span>
                <CopyButton variant="ghost" text="claude plugin marketplace add anthropicis/claude-for-financial-services" />
              </div>
              <code className="text-emerald-400">
                claude plugin marketplace add anthropicis/claude-for-financial-services
              </code>
            </div>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs">2. Model Builder installieren</span>
                <CopyButton variant="ghost" text="claude plugin install model-builder@claude-for-financial-services" />
              </div>
              <code className="text-emerald-400">
                claude plugin install model-builder@claude-for-financial-services
              </code>
            </div>
            <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs">3. Earnings Reviewer installieren</span>
                <CopyButton variant="ghost" text="claude plugin install earnings-reviewer@claude-for-financial-services" />
              </div>
              <code className="text-emerald-400">
                claude plugin install earnings-reviewer@claude-for-financial-services
              </code>
            </div>
          </div>
          <div className="mt-5 p-3 bg-[#7a9b6d]/15 border border-[#7a9b6d]/30 rounded-lg">
            {/* Diese Callout-Box sitzt INNERHALB der dunklen bg-[#3a2f28]-
                Setup-Box → effektiver bg ~#443f32 (dunkel). Daher sage-LIGHT
                (CR 6.1) statt -deep (CR 1.8). Audit #29b dark-context. */}
            <p className="text-sm text-[var(--color-sage-light)] flex items-start gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Desktop App:</strong> Alternativ über Customize → Connectors → Browse connectors.
                Dort kannst du auch Daten-Connectors (Daloopa, FactSet etc.) hinzufügen.
              </span>
            </p>
          </div>
        </AnimatedReveal>
      </section>

      {/* ---- 10 Agents Overview ---- */}
      <section className="container py-10">
        <AnimatedReveal slide="up" className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
              10 Finance Agents
            </h2>
          </div>
          <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm max-w-2xl">
            Spezialisierte AI-Agents, die als Plugins installiert oder als Managed Agents deployed werden können.
            Jeder Agent hat eigene Skills und Commands.
          </p>
        </AnimatedReveal>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <AgentCard key={agent.name} agent={agent} index={i} />
          ))}
        </div>
      </section>

      {/* ---- Slash Commands ---- */}
      <section className="py-12 bg-white/50 dark:bg-card/30">
        <div className="container">
          <AnimatedReveal slide="up" className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Slash Commands
              </h2>
            </div>
            <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm">
              Die wichtigsten Befehle nach der Plugin-Installation.
            </p>
          </AnimatedReveal>

          <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
            {slashCommands.map((cmd, i) => (
              <AnimatedReveal slide="up" delay={i * 0.08} className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border border-[#3a2f28]/8 dark:border-foreground/8">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-base font-bold text-[var(--color-terracotta-deep)] font-mono">
                    {cmd.command}
                  </code>
                  <CopyButton variant="ghost" text={cmd.command} />
                </div>
                <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 mb-2">
                  {cmd.description}
                </p>
                <div className="bg-[#3a2f28]/5 dark:bg-foreground/5 rounded-md p-2.5">
                  <p className="text-xs text-[#3a2f28]/70 dark:text-foreground/70 font-mono">
                    {cmd.example}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- MCP Data Connectors ---- */}
      <section className="container py-12">
        <AnimatedReveal slide="up" className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
              11 MCP-Daten-Connectors
            </h2>
          </div>
          <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm max-w-2xl">
            Direkte Anbindung an professionelle Finanzdaten-Provider.
            Claude zieht zuerst aus verbundenen Connectors, dann aus SEC Filings.
          </p>
        </AnimatedReveal>

        <div className="overflow-x-auto max-w-4xl">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-[#3a2f28]/10 dark:border-foreground/10">
                <th className="text-left py-3 px-4 text-[#3a2f28] dark:text-foreground font-semibold font-['Playfair_Display',serif]">
                  Connector
                </th>
                <th className="text-left py-3 px-4 text-[#3a2f28] dark:text-foreground font-semibold font-['Playfair_Display',serif]">
                  Typ
                </th>
                <th className="text-left py-3 px-4 text-[#3a2f28] dark:text-foreground font-semibold font-['Playfair_Display',serif]">
                  Beschreibung
                </th>
              </tr>
            </thead>
            <tbody>
              {mcpConnectors.map((connector) => (
                <tr
                  key={connector.name}
                  className="border-b border-[#3a2f28]/5 dark:border-foreground/5 hover:bg-[#3a2f28]/3 dark:hover:bg-foreground/3 transition-colors"
                >
                  <td className="py-2.5 px-4 font-medium text-[#3a2f28] dark:text-foreground">
                    {connector.name}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#c4704b]/10 text-[var(--color-terracotta-deep)] font-medium">
                      {connector.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-[#3a2f28]/75 dark:text-foreground/75">
                    {connector.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AnimatedReveal className="mt-6 p-4 bg-[#7a9b6d]/8 border border-[#7a9b6d]/20 rounded-lg max-w-4xl">
          <p className="text-sm text-[var(--color-sage-deep)] dark:text-[var(--color-sage-deep)] flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Setup:</strong> In der Claude Desktop App → Customize → Connectors → Browse connectors →
              gewünschten Connector suchen und hinzufügen. Manche Connectors erfordern ein separates Abo beim Datenanbieter.
            </span>
          </p>
        </AnimatedReveal>
      </section>

      {/* ---- AI Finance Team (5-Rollen) ---- */}
      <section className="py-12 bg-white/50 dark:bg-card/30">
        <div className="container">
          <AnimatedReveal slide="up" className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                AI Finance Team (5-Rollen-System)
              </h2>
            </div>
            <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm max-w-2xl">
              Ein strukturiertes Projekt-Verzeichnis, das Claude als koordiniertes Finanzteam arbeiten lässt.
              Ein Prompt orchestriert die gesamte Pipeline: Rohdaten → Analyse → Forecast → Report → Präsentation.
            </p>
          </AnimatedReveal>

          {/* Shared Folder Info */}
          <AnimatedReveal slide="up" className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border-2 border-[#c4704b]/15 max-w-4xl mb-6">
            <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-[var(--color-terracotta-deep)]" />
              Shared-Ordner (Single Source of Truth)
            </h3>
            <div className="grid gap-2 md:grid-cols-3">
              <div className="bg-[#3a2f28]/5 dark:bg-foreground/5 rounded-md p-3">
                <code className="text-xs text-[var(--color-terracotta-deep)] font-mono block mb-1">company_context.md</code>
                <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75">Geschäftsmodell, Pricing, Segmente</p>
              </div>
              <div className="bg-[#3a2f28]/5 dark:bg-foreground/5 rounded-md p-3">
                <code className="text-xs text-[var(--color-terracotta-deep)] font-mono block mb-1">assumptions.md</code>
                <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75">Growth Rates, Churn, Hiring, Kosten</p>
              </div>
              <div className="bg-[#3a2f28]/5 dark:bg-foreground/5 rounded-md p-3">
                <code className="text-xs text-[var(--color-terracotta-deep)] font-mono block mb-1">calendar.csv</code>
                <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75">Quarter-Definitionen, Zeiträume</p>
              </div>
            </div>
          </AnimatedReveal>

          {/* Role Cards */}
          <div className="space-y-3 max-w-4xl">
            {financeTeamRoles.map((role, i) => (
              <AnimatedReveal slide="right" delay={i * 0.08} className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border border-[#3a2f28]/8 dark:border-foreground/8">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#c4704b]/10 text-[var(--color-terracotta-deep)] shrink-0">
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] text-sm mb-1">
                      {role.role}
                    </h3>
                    <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75 mb-2">
                      {role.tasks}
                    </p>
                    <div className="flex flex-wrap gap-3 text-[11px]">
                      <span className="text-[var(--color-sage-deep)]">
                        <strong>Input:</strong> {role.inputs.join(", ")}
                      </span>
                      <span className="text-[var(--color-terracotta-deep)]">
                        <strong>Output:</strong> {role.outputs.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>

          {/* Setup Command */}
          <AnimatedReveal slide="up" className="mt-6 bg-[#3a2f28] rounded-xl p-5 max-w-4xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs">Ordnerstruktur anlegen</span>
              <CopyButton variant="ghost" text="mkdir -p Finance-Team/{shared,revenue-ops/{input,output},financial-control/{input,output},fpa/{input,output},reporting/{input,output}}" />
            </div>
            <code className="text-sm text-emerald-400 font-mono block">
              mkdir -p Finance-Team/&#123;shared,revenue-ops/&#123;input,output&#125;,financial-control/&#123;input,output&#125;,fpa/&#123;input,output&#125;,reporting/&#123;input,output&#125;&#125;
            </code>
          </AnimatedReveal>
        </div>
      </section>

      {/* ---- Autonomous Trading Agent ---- */}
      <section className="container py-12">
        <AnimatedReveal slide="up" className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
            <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
              Autonomer Trading-Agent
            </h2>
          </div>
          <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm max-w-2xl">
            Ein vollautomatischer, fundamentals-basierter Trading-Agent mit Claude Code Routines.
            Läuft 24/7 mit File-Based Memory und 5 täglichen Workflows.
          </p>
        </AnimatedReveal>

        {/* Warning */}
        <AnimatedReveal slide="up" className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-5 max-w-4xl mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">
                Wichtige Einschränkungen
              </h3>
              <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
                <li>NICHT für Day Trading geeignet — nur Fundamentals-basierte Strategien</li>
                <li>Keine technische Analyse (Candlesticks, MACD, RSI)</li>
                <li>IMMER zuerst Paper Trading (Alpaca Paper Account)</li>
                <li>Guardrails PFLICHT: Max 5% pro Position, -2% Daily Loss Cap</li>
              </ul>
            </div>
          </div>
        </AnimatedReveal>

        {/* Tech Stack */}
        <AnimatedReveal slide="up" className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border border-[#3a2f28]/8 dark:border-foreground/8 max-w-4xl mb-6">
          <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] mb-3 text-sm">
            Tech Stack
          </h3>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "AI Model", value: "Claude Opus 4.7" },
              { label: "Scheduler", value: "Claude Code Routines" },
              { label: "Brokerage", value: "Alpaca API" },
              { label: "Research", value: "Perplexity API" },
              { label: "Alerts", value: "ClickUp/Slack" },
            ].map((item) => (
              <div key={item.label} className="bg-[#3a2f28]/5 dark:bg-foreground/5 rounded-md p-2.5 text-center">
                <p className="text-[10px] text-[#3a2f28]/70 dark:text-foreground/70 uppercase tracking-wider mb-0.5">
                  {item.label}
                </p>
                <p className="text-xs font-medium text-[#3a2f28] dark:text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </AnimatedReveal>

        {/* File-Based Memory */}
        <AnimatedReveal slide="up" className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border border-[#3a2f28]/8 dark:border-foreground/8 max-w-4xl mb-6">
          <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] mb-3 text-sm flex items-center gap-2">
            <Brain className="w-4 h-4 text-[var(--color-terracotta-deep)]" />
            File-Based Memory (das "Gehirn" des Agents)
          </h3>
          <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75 mb-3">
            Jede Routine liest zuerst diese Dateien (ca. 25.000 Tokens), führt ihre Aufgabe aus, und schreibt Ergebnisse zurück.
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {[
              { file: "TRADING-STRATEGY.md", desc: "Regelwerk & Strategie. Wird nur bei Weekly Review aktualisiert." },
              { file: "TRADE-LOG.md", desc: "Wichtigste Datei: Was gekauft, warum, Ergebnis." },
              { file: "RESEARCH-LOG.md", desc: "Tägliche Research-Notizen, Katalysatoren, Trade-Ideen." },
              { file: "WEEKLY-REVIEW.md", desc: "Wochenauswertung, Lessons Learned → Strategy-Updates." },
            ].map((item) => (
              <div key={item.file} className="bg-[#3a2f28]/5 dark:bg-foreground/5 rounded-md p-3">
                <code className="text-xs text-[var(--color-terracotta-deep)] font-mono block mb-1">{item.file}</code>
                <p className="text-[11px] text-[#3a2f28]/75 dark:text-foreground/75">{item.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedReveal>

        {/* Daily Routines */}
        <AnimatedReveal slide="up" className="max-w-4xl">
          <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] mb-4 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--color-terracotta-deep)]" />
            5 Tägliche Routines (Mo–Fr)
          </h3>
          <div className="space-y-2">
            {tradingRoutines.map((routine, i) => (
              <AnimatedReveal slide="right" delay={i * 0.08} className="flex items-start gap-3 bg-[#faf8f5] dark:bg-card rounded-lg p-3 border border-[#3a2f28]/5 dark:border-foreground/5">
                <span className="inline-flex items-center justify-center min-w-[4rem] px-2 py-1 rounded-md bg-[#c4704b]/10 text-[var(--color-terracotta-deep)] text-xs font-mono font-bold">
                  {routine.time}
                </span>
                <div>
                  <p className="text-sm font-medium text-[#3a2f28] dark:text-foreground">
                    {routine.name}
                  </p>
                  <p className="text-xs text-[#3a2f28]/75 dark:text-foreground/75 mt-0.5">
                    {routine.action}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </AnimatedReveal>

        {/* Scar Tissue Concept */}
        <AnimatedReveal slide="up" className="mt-6 p-4 bg-[#c4704b]/8 border border-[#c4704b]/20 rounded-lg max-w-4xl">
          <p className="text-sm text-[#3a2f28]/80 dark:text-foreground/80 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-terracotta-deep)]" />
            <span>
              <strong>Das "Scar Tissue"-Prinzip:</strong> Die Dateien sind nicht nur Speicher — sie sind das Narbengewebe des Agents.
              Verluste werden geloggt, analysiert, und als neue Regeln in TRADING-STRATEGY.md geschrieben.
              So verfeinert der Agent kontinuierlich seinen Edge.
            </span>
          </p>
        </AnimatedReveal>
      </section>

      {/* ---- Practical Tips ---- */}
      <section className="py-12 bg-white/50 dark:bg-card/30">
        <div className="container">
          <AnimatedReveal slide="up" className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Praktische Tipps & Limitierungen
              </h2>
            </div>
            <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm">
              Aus 5 Video-Analysen und dem GitHub-Repo destilliert.
            </p>
          </AnimatedReveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            {practicalTips.map((tip, i) => (
              <AnimatedReveal slide="up" delay={i * 0.08} className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border border-[#3a2f28]/8 dark:border-foreground/8">
                <h3 className="font-semibold text-[#3a2f28] dark:text-foreground mb-2 font-['Playfair_Display',serif] text-sm">
                  {tip.title}
                </h3>
                <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 leading-relaxed">
                  {tip.description}
                </p>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Deployment Options ---- */}
      <section className="container py-12">
        <AnimatedReveal slide="up" className="bg-gradient-to-br from-[#3a2f28] to-[#5a4f48] rounded-xl p-8 text-white max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-terracotta-deep)]">
              Für Teams & Institutionen
            </p>
          </div>
          <h2 className="text-2xl font-bold mb-3 font-['Playfair_Display',serif]">
            Managed Agents Deployment
          </h2>
          <p className="text-white/70 leading-relaxed mb-4 max-w-2xl">
            Für produktionsreife Deployments: Claude Managed Agents API ermöglicht gehostete,
            governierte Agents hinter eigenem Workflow-Engine. Multi-Agent-Delegation,
            Execution Traces für Audit, automatische Handoffs.
          </p>
          <div className="space-y-2 mb-6">
            <div className="bg-black/30 rounded-lg p-3 font-mono text-sm flex items-center justify-between">
              <code className="text-emerald-400">scripts/deploy-managed-agent.sh</code>
              <CopyButton variant="ghost" text="scripts/deploy-managed-agent.sh" />
            </div>
            <div className="bg-black/30 rounded-lg p-3 font-mono text-sm flex items-center justify-between">
              <code className="text-emerald-400">scripts/orchestrate.py</code>
              <CopyButton variant="ghost" text="scripts/orchestrate.py" />
            </div>
          </div>
          <a
            href="https://github.com/anthropics/financial-services"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-terracotta-deep)] text-white font-medium text-sm hover:bg-[var(--color-terracotta-deep-hover)] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Zum GitHub Repository
          </a>
        </AnimatedReveal>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-[#3a2f28]/10 dark:border-foreground/10 bg-white/40 dark:bg-card/40">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70">
                AI & Vibe-Coding Wissensdatenbank &middot; Stand: Mai 2026
              </p>
              <p className="text-xs text-[#3a2f28]/70 dark:text-foreground/70 mt-1">
                Fortlaufend aktualisiert mit neuen Agenten, Connectors und Analyse-Workflows
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/guide"
                className="text-sm text-[var(--color-terracotta-deep)] hover:underline inline-flex items-center gap-1"
              >
                Claude Code Guide
              </Link>
              <Link
                href="/claude-design"
                className="text-sm text-[var(--color-terracotta-deep)] hover:underline inline-flex items-center gap-1"
              >
                Claude Design
              </Link>
              <Link
                href="/"
                className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 hover:text-[#3a2f28] dark:hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Wissensdatenbank
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
