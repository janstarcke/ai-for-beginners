import { useMemo, useState } from "react";
import { Link } from "wouter";
import { CodeBlock } from "@/components/CodeBlock";
import { AnimatedReveal } from "@/components/AnimatedReveal";
import {
  kiAlltagItems,
  kindLabels,
  type KiAlltagItem,
  type KiAlltagKind,
  type KiAlltagTool,
} from "@/data/kiAlltag";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Newspaper,
  Lightbulb,
  Info,
  AlertTriangle,
  ExternalLink,
  CalendarDays,
} from "lucide-react";
import { siteStand } from "@/lib/siteDate";

/*
 * Design: Warm Craft — Playfair Display + DM Sans
 * Page: KI im Alltag — Consumer-KI für Einsteiger, getrennt von der
 * Claude-Code-Wissensdatenbank auf der Startseite.
 */

/* ------------------------------------------------------------------ */
/*  Badges                                                             */
/* ------------------------------------------------------------------ */

const kindStyles: Record<KiAlltagKind, string> = {
  news: "bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta-deep)] dark:text-[var(--color-terracotta)] border-[var(--color-terracotta)]/30",
  fundus:
    "bg-[var(--color-sage)]/15 text-[var(--color-sage-deep)] dark:text-green-300 border-[var(--color-sage)]/40",
  praxis:
    "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
};

function KindBadge({ kind }: { kind: KiAlltagKind }) {
  const { label, hint } = kindLabels[kind];
  return (
    <span
      title={hint}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${kindStyles[kind]}`}
    >
      {kind === "news" ? (
        <Newspaper className="w-3 h-3" />
      ) : (
        <Lightbulb className="w-3 h-3" />
      )}
      {label}
    </span>
  );
}

function ToolBadge({ tool }: { tool: KiAlltagTool }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[11px] font-medium">
      {tool}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function ItemCard({ item }: { item: KiAlltagItem }) {
  return (
    <article
      id={`thema-${item.id}`}
      className="rounded-xl border border-border bg-card p-6 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <KindBadge kind={item.kind} />
        <ToolBadge tool={item.tool} />
        {item.dateLabel && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays className="w-3 h-3" />
            {item.dateLabel}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground font-[var(--font-display)] leading-snug">
        {item.title}
      </h3>

      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {item.what}
      </p>

      <p className="mt-3 text-sm text-foreground leading-relaxed">
        <span className="font-semibold">Warum das für dich nützlich ist: </span>
        {item.why}
      </p>

      {item.steps && (
        <ol className="mt-4 space-y-2">
          {item.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta-deep)] dark:text-[var(--color-terracotta)] text-[11px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      )}

      {item.prompt && (
        <div className="mt-4">
          {item.promptLabel && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              {item.promptLabel}
            </p>
          )}
          <CodeBlock code={item.prompt} language="markup" filename="Prompt" />
        </div>
      )}

      {item.table && (
        <div className="mt-4 rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  {item.table.head.map((h) => (
                    <th
                      key={h}
                      className="text-left p-3 font-semibold text-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {item.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={
                          j === 0
                            ? "p-3 font-mono text-xs text-[var(--color-terracotta-deep)] dark:text-[var(--color-terracotta)] whitespace-nowrap align-top"
                            : "p-3 text-muted-foreground align-top"
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {item.note && (
        <div className="mt-4 flex gap-2.5 p-3 rounded-lg bg-secondary/50 border border-border">
          <Info className="w-4 h-4 text-[var(--color-sage-deep)] dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">
              Wichtig zu wissen:{" "}
            </span>
            {item.note}
          </p>
        </div>
      )}

      {item.unverified && (
        <div className="mt-3 flex gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
            {item.unverified}
          </p>
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-border">
        {item.sources.length > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {item.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1.5 text-xs text-muted-foreground hover:text-[var(--color-terracotta-deep)] dark:hover:text-[var(--color-terracotta)] transition-colors"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span className="underline underline-offset-2">
                    {source.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Keine verlinkbare Quelle — siehe Hinweis oben.
          </p>
        )}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

type Filter = "alle" | KiAlltagKind;

export default function KiAlltag() {
  const [filter, setFilter] = useState<Filter>("alle");

  const counts = useMemo(
    () => ({
      alle: kiAlltagItems.length,
      news: kiAlltagItems.filter((i) => i.kind === "news").length,
      fundus: kiAlltagItems.filter((i) => i.kind === "fundus").length,
      praxis: kiAlltagItems.filter((i) => i.kind === "praxis").length,
    }),
    [],
  );

  // News zuerst (neueste oben), danach die zeitlosen Tipps in Datei-
  // Reihenfolge — Fundus/Praxis haben bewusst kein Datum.
  const sorted = useMemo(() => {
    const news = kiAlltagItems
      .filter((i) => i.kind === "news")
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    const timeless = kiAlltagItems.filter((i) => i.kind !== "news");
    return [...news, ...timeless];
  }, []);

  const visible = useMemo(
    () =>
      filter === "alle" ? sorted : sorted.filter((i) => i.kind === filter),
    [filter, sorted],
  );

  const filters: { key: Filter; label: string }[] = [
    { key: "alle", label: "Alle" },
    { key: "news", label: "News" },
    { key: "fundus", label: "Fundus-Tipps" },
    { key: "praxis", label: "Praxis-Tipps" },
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
          <AnimatedReveal slide="up">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-terracotta)]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--color-terracotta)]" />
              </div>
              <p className="text-xs font-medium tracking-widest uppercase text-[var(--color-terracotta)]">
                Ohne Vorkenntnisse · ohne Programmieren
              </p>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-3xl font-[var(--font-display)]">
              KI im Alltag
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Was sich bei ChatGPT, Gemini und Claude gerade ändert — und welche
              Prompts wirklich etwas bringen. Für alle, die KI nutzen wollen,
              ohne Entwickler zu sein.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
                <Newspaper className="w-4 h-4 text-[var(--color-terracotta)]" />
                <span className="text-foreground font-medium">
                  {counts.news} News mit verlinkter Quelle
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-sm">
                <Lightbulb className="w-4 h-4 text-[var(--color-sage-deep)]" />
                <span className="text-foreground font-medium">
                  {counts.fundus + counts.praxis} zeitlose Tipps
                </span>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </header>

      {/* Redaktionshinweis */}
      <section className="container pt-10">
        <AnimatedReveal slide="up" delay={0.1}>
          <div className="p-5 rounded-xl border border-[var(--color-sage)]/30 bg-[var(--color-sage)]/5 dark:bg-green-950/20">
            <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
              <Info className="w-4 h-4 text-[var(--color-sage-deep)] dark:text-green-400" />
              Wie du diese Seite lesen kannst
            </h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">News</strong> sind datiert
                und haben mindestens eine verlinkte Quelle. Ohne prüfbare Quelle
                steht ein Thema hier nicht als Neuigkeit.
              </li>
              <li>
                <strong className="text-foreground">Fundus-</strong> und{" "}
                <strong className="text-foreground">Praxis-Tipps</strong> sind
                zeitlose Ideen ohne Datum — gute Prompts, aber keine
                Neuigkeiten, und als solche gekennzeichnet.
              </li>
              <li>
                Fehlt eine belastbare Quelle, steht das{" "}
                <strong className="text-foreground">gelb markiert</strong> auf
                der Karte. Es werden hier keine Quellen erfunden.
              </li>
              <li>
                Funktionen und Preise ändern sich schnell. Prüfe vor einer
                Entscheidung die verlinkte Originalquelle.
              </li>
            </ul>
          </div>
        </AnimatedReveal>
      </section>

      {/* Filter */}
      <section className="container pt-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                filter === f.key
                  ? "bg-[var(--color-terracotta-deep)] text-white border-transparent"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">{counts[f.key]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Items */}
      <section className="container py-8">
        <div className="grid gap-6 lg:grid-cols-2 items-start">
          {visible.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
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
            href="/token-spar"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            Token-Spar Guide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          KI im Alltag &middot; Stand: {siteStand}
        </p>
      </footer>
    </div>
  );
}
