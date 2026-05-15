import { useState } from "react";
import { AnimatedReveal, CollapseReveal } from "@/components/AnimatedReveal";
import { Link } from "wouter";
import { CodeBlock } from "@/components/CodeBlock";
import { CopyButton } from "@/components/CopyButton";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Terminal,
  ArrowLeft,
  Sprout,
  Flame,
  Rocket,
  Crown,
  BookOpen,
  ExternalLink,
  Puzzle,
  RotateCcw,
} from "lucide-react";
import { guideLevels, quickReference, topPlugins, academyCourses } from "@/data/guide";
import type { GuideStep } from "@/data/guide";
import { useProgress } from "@/hooks/useProgress";
import { ProgressCheckbox } from "@/components/ProgressCheckbox";
import { ProgressBar } from "@/components/ProgressBar";

/*
 * Design: Warm Craft — Playfair Display + DM Sans
 * Terracotta accents, cream backgrounds, espresso code blocks
 * Left-aligned content, taktile card surfaces
 */

const HERO_IMAGE =
  "/images/workflow-illustration.webp";

const levelIcons: Record<string, React.ReactNode> = {
  seedling: <Sprout className="w-5 h-5" />,
  flame: <Flame className="w-5 h-5" />,
  rocket: <Rocket className="w-5 h-5" />,
  crown: <Crown className="w-5 h-5" />,
};

const levelColorMap: Record<
  string,
  { bg: string; text: string; border: string; accent: string; light: string }
> = {
  sage: {
    bg: "bg-[#e8efe5] dark:bg-[#7a9b6d]/15",
    text: "text-[#3a2f28] dark:text-[#e8efe5]",
    border: "border-[#7a9b6d]",
    accent: "bg-[var(--color-sage-deep)]",
    light: "bg-[#7a9b6d]/10 dark:bg-[#7a9b6d]/20",
  },
  terracotta: {
    bg: "bg-[#c4704b]/10 dark:bg-[#c4704b]/15",
    text: "text-[#3a2f28] dark:text-[#f5e6df]",
    border: "border-[#c4704b]",
    accent: "bg-[var(--color-terracotta-deep)]",
    light: "bg-[#c4704b]/10 dark:bg-[#c4704b]/20",
  },
  espresso: {
    bg: "bg-[#3a2f28]/10 dark:bg-[#3a2f28]/30",
    text: "text-[#3a2f28] dark:text-[#f5f0eb]",
    border: "border-[#3a2f28] dark:border-[#8a7f78]",
    accent: "bg-[#3a2f28] dark:bg-[#5a4f48]",
    light: "bg-[#3a2f28]/8 dark:bg-[#3a2f28]/20",
  },
};

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
/* CopyButton wurde nach client/src/components/CopyButton.tsx ausgelagert.
 * Aufrufe nutzen jetzt die globale Komponente mit Sepia-className-Override. */

/* ------------------------------------------------------------------ */
/*  Step card                                                          */
/* ------------------------------------------------------------------ */

function StepCard({
  step,
  levelColor,
  isCompleted,
  onToggle,
}: {
  step: GuideStep;
  levelColor: string;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const c = levelColorMap[levelColor] ?? levelColorMap.sage;

  return (
    <AnimatedReveal
      slide="up"
      className={`rounded-lg border ${c.border}/30 border-l-4 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-[#faf8f5] dark:bg-card`}
    >
      <div
        className="p-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1">
              <ProgressCheckbox
                id={`guide-${step.id}`}
                checked={isCompleted}
                onToggle={onToggle}
                ariaLabel={`${step.title} als erledigt markieren`}
              />
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${c.accent} text-white text-xs font-bold shrink-0 ${isCompleted ? 'opacity-50' : ''}`}
              >
                {step.id.split("-")[1]}
              </span>
              <h3 className="text-base font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                {step.title}
              </h3>
            </div>
            <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 leading-relaxed mt-1.5 ml-[2.375rem]">
              {step.description}
            </p>
          </div>
          <button
            aria-label={`${step.title} ${expanded ? "einklappen" : "ausklappen"}`}
            aria-expanded={expanded}
            className="mt-1 text-[#3a2f28]/70 dark:text-foreground/70 hover:text-[#3a2f28] dark:hover:text-foreground transition-colors shrink-0"
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <CollapseReveal open={expanded}>
        <div className="px-5 pb-5 pt-0 space-y-3">
              <div className="border-t border-[#3a2f28]/10 dark:border-foreground/10 pt-4" />

              {step.command && (
                <CodeBlock code={step.command} language="bash" filename="Befehl / Code" />
              )}

              {step.tip && (
                <div className="flex items-start gap-2.5 p-3 rounded-md bg-[#7a9b6d]/10 dark:bg-[#7a9b6d]/15 border border-[#7a9b6d]/20">
                  <Lightbulb className="w-4 h-4 text-[var(--color-sage-deep)] shrink-0 mt-0.5" />
                  <p className="text-sm text-[#3a2f28]/80 dark:text-foreground/80">{step.tip}</p>
                </div>
              )}

              {step.warning && (
                <div className="flex items-start gap-2.5 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">{step.warning}</p>
                </div>
              )}


        </div>
      </CollapseReveal>
    </AnimatedReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Level section                                                      */
/* ------------------------------------------------------------------ */

function LevelSection({
  level,
  isCompleted,
  toggle,
}: {
  level: (typeof guideLevels)[number];
  isCompleted: (id: string) => boolean;
  toggle: (id: string) => void;
}) {
  const c = levelColorMap[level.color] ?? levelColorMap.sage;

  return (
    <section className="py-14" id={`level-${level.level}`}>
      <div className="container">
        <AnimatedReveal slide="up" className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div
              className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${c.accent} text-white`}
            >
              {levelIcons[level.icon]}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                  Level {level.level}: {level.title}
                </h2>
                <span
                  className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${c.light} ${c.text}`}
                >
                  ~{level.estimatedTime}
                </span>
              </div>
              <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm mt-0.5">
                {level.subtitle}
              </p>
            </div>
          </div>
        </AnimatedReveal>

        <div className="space-y-3 max-w-3xl">
          {level.steps.map((step) => (
            <StepCard key={step.id} step={step} levelColor={level.color} isCompleted={isCompleted(`guide-${step.id}`)} onToggle={toggle} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function Guide() {
  const [activeLevel, setActiveLevel] = useState<number | null>(null);
  const { isCompleted, toggle, completedCount, reset } = useProgress();
  const totalGuideSteps = guideLevels.reduce((acc, l) => acc + l.steps.length, 0);
  const guideCompletedCount = guideLevels.reduce((acc, l) => acc + l.steps.filter(s => isCompleted(`guide-${s.id}`)).length, 0);

  const categoryLabels: Record<string, string> = {
    basics: "Grundlagen",
    context: "Kontext",
    advanced: "Fortgeschritten",
    tools: "Tools & Auth",
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-background">
      {/* ---- Hero ---- */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0eb]/60 via-[#f5f0eb]/85 to-[#f5f0eb] dark:from-background/60 dark:via-background/85 dark:to-background" />
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
              <BookOpen className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-terracotta-deep)]">
                Step-by-Step Guide
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-[#3a2f28] dark:text-foreground leading-tight max-w-3xl font-['Playfair_Display',serif]">
              Claude Code:
              <br />
              <span className="text-[var(--color-terracotta-deep)]">Vom Einsteiger zum Profi</span>
            </h1>

            <p className="mt-5 text-lg text-[#3a2f28]/75 dark:text-foreground/75 max-w-2xl leading-relaxed">
              Ein praktischer Lernpfad in 4 Leveln -- von der Installation bis
              zur vollautomatischen Multi-Agenten-Pipeline. Fortlaufend
              aktualisiert mit den neuesten Best Practices.
            </p>

            {/* Level overview cards */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {guideLevels.map((l) => {
                const c = levelColorMap[l.color] ?? levelColorMap.sage;
                return (
                  <a
                    key={l.level}
                    href={`#level-${l.level}`}
                    onClick={() => setActiveLevel(l.level)}
                    className={`group p-4 rounded-xl border border-[#3a2f28]/10 dark:border-foreground/10 bg-white/60 dark:bg-card/60 backdrop-blur-sm hover:shadow-md transition-all`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${c.accent} text-white mb-2`}
                    >
                      {levelIcons[l.icon]}
                    </div>
                    <p className="font-semibold text-[#3a2f28] dark:text-foreground text-sm font-['Playfair_Display',serif]">
                      Level {l.level}
                    </p>
                    <p className="text-xs text-[#3a2f28]/70 dark:text-foreground/70 mt-0.5">
                      {l.title} &middot; {l.steps.length} Schritte
                    </p>
                  </a>
                );
              })}
            </div>
          </AnimatedReveal>
        </div>
      </header>

      {/* ---- Sticky nav ---- */}
      <nav className="sticky top-0 z-20 bg-[#f5f0eb]/95 dark:bg-background/95 backdrop-blur-sm border-b border-[#3a2f28]/10 dark:border-foreground/10">
        <div className="container py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {guideLevels.map((l) => {
              const c = levelColorMap[l.color] ?? levelColorMap.sage;
              return (
                <a
                  key={l.level}
                  href={`#level-${l.level}`}
                  onClick={() => setActiveLevel(l.level)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeLevel === l.level
                      ? `${c.accent} text-white shadow-sm`
                      : "bg-white/70 dark:bg-card/70 text-[#3a2f28]/70 dark:text-foreground/70 hover:bg-white dark:hover:bg-card hover:text-[#3a2f28] dark:hover:text-foreground"
                  }`}
                >
                  {levelIcons[l.icon]}
                  <span className="hidden sm:inline">Level {l.level}:</span>{" "}
                  {l.title}
                </a>
              );
            })}
            <a
              href="#plugins"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-white/70 dark:bg-card/70 text-[#3a2f28]/70 dark:text-foreground/70 hover:bg-white dark:hover:bg-card hover:text-[#3a2f28] dark:hover:text-foreground transition-all"
            >
              <Puzzle className="w-4 h-4" />
              Plugins
            </a>
            <a
              href="#cheatsheet"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap bg-white/70 dark:bg-card/70 text-[#3a2f28]/70 dark:text-foreground/70 hover:bg-white dark:hover:bg-card hover:text-[#3a2f28] dark:hover:text-foreground transition-all"
            >
              <Terminal className="w-4 h-4" />
              Cheat Sheet
            </a>
          </div>
        </div>
      </nav>

      {/* ---- Level sections ---- */}
      {guideCompletedCount > 0 && (
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <ProgressBar
              completed={guideCompletedCount}
              total={totalGuideSteps}
              label={`${guideCompletedCount} / ${totalGuideSteps} Schritte`}
              colorClass="bg-[var(--color-sage-deep)]"
            />
            <button
              onClick={reset}
              className="text-xs text-[#3a2f28]/70 dark:text-foreground/70 hover:text-[#3a2f28] dark:hover:text-foreground transition-colors inline-flex items-center gap-1 shrink-0"
              title="Fortschritt zurücksetzen"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      )}
      {guideLevels.map((level) => (
        <LevelSection key={level.level} level={level} isCompleted={isCompleted} toggle={toggle} />
      ))}

      {/* ---- Top Plugins & Skills ---- */}
      <section className="py-14 bg-white/50 dark:bg-card/30" id="plugins">
        <div className="container">
          <AnimatedReveal slide="up">
            <div className="flex items-center gap-2 mb-1">
              <Puzzle className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Top 10 Plugins & Skills
              </h2>
            </div>
            <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 mb-6">
              Die wichtigsten Erweiterungen für Claude Code, sortiert nach
              Priorität.
            </p>
          </AnimatedReveal>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-[#3a2f28]/15 dark:border-foreground/15">
                  <th className="text-left py-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a2f28]/70 dark:text-foreground/70">
                    #
                  </th>
                  <th className="text-left py-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a2f28]/70 dark:text-foreground/70">
                    Name
                  </th>
                  <th className="text-left py-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a2f28]/70 dark:text-foreground/70">
                    Typ
                  </th>
                  <th className="text-left py-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a2f28]/70 dark:text-foreground/70">
                    Herkunft
                  </th>
                  <th className="text-left py-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#3a2f28]/70 dark:text-foreground/70">
                    Beschreibung
                  </th>
                </tr>
              </thead>
              <tbody>
                {topPlugins.map((p, i) => (
                  <tr
                    key={p.name}
                    className="border-b border-[#3a2f28]/8 dark:border-foreground/8 hover:bg-[#c4704b]/5 transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-[var(--color-terracotta-deep)]">
                      {i + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#3a2f28] dark:text-foreground">
                      {p.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#3a2f28]/8 dark:bg-foreground/10 text-[#3a2f28]/70 dark:text-foreground/70">
                        {p.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#3a2f28]/75 dark:text-foreground/75">{p.origin}</td>
                    <td className="py-3 px-3 text-[#3a2f28]/70 dark:text-foreground/70">
                      {p.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---- Cheat Sheet ---- */}
      <section className="py-14" id="cheatsheet">
        <div className="container">
          <AnimatedReveal slide="up">
            <div className="flex items-center gap-2 mb-1">
              <Terminal className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Befehls-Referenz
              </h2>
            </div>
            <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 mb-6">
              Alle wichtigen Befehle auf einen Blick.
            </p>
          </AnimatedReveal>

          {Object.entries(categoryLabels).map(([cat, label]) => {
            const items = quickReference.filter((r) => r.category === cat);
            if (items.length === 0) return null;
            return (
              <div key={cat} className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#3a2f28]/70 dark:text-foreground/70 mb-2">
                  {label}
                </h3>
                <div className="grid gap-2 md:grid-cols-2">
                  {items.map((ref) => (
                    <div
                      key={ref.command}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#faf8f5] dark:bg-card border border-[#3a2f28]/8 dark:border-foreground/8"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <code className="text-[13px] font-mono bg-[#3a2f28] dark:bg-[#1a1512] text-[#f5f0eb] px-2 py-1 rounded shrink-0">
                          {ref.command}
                        </code>
                        <span className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 truncate">
                          {ref.description}
                        </span>
                      </div>
                      <CopyButton text={ref.command} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Anthropic Academy ---- */}
      <section className="py-14 bg-white/50 dark:bg-card/30" id="academy">
        <div className="container">
          <AnimatedReveal slide="up">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-[var(--color-terracotta-deep)]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Empfohlene Lernressourcen
              </h2>
            </div>
            <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 mb-2 max-w-2xl">
              Kostenlose Kurse mit Videos, Quizzes und Zertifikaten.
              Empfohlene Reihenfolge von oben nach unten.
            </p>
            <a
              href="https://anthropic.skilljar.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-terracotta-deep)] hover:underline mb-6"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              anthropic.skilljar.com
            </a>
          </AnimatedReveal>

          <div className="space-y-4 max-w-4xl">
            {academyCourses.map((course, i) => (
              <AnimatedReveal
                key={course.id}
                slide="up"
                delay={i * 0.05}
                className="bg-[#faf8f5] dark:bg-card rounded-xl border border-[#3a2f28]/8 dark:border-foreground/8 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-terracotta-deep)] text-white text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <h3 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                        {course.title}
                      </h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#7a9b6d]/15 text-[#5a7d4f] dark:text-[#a8d49a]">
                        {course.level}
                      </span>
                      {course.isFree && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          KOSTENLOS
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 leading-relaxed mb-3">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {course.learnings.slice(0, 4).map((l) => (
                        <span
                          key={l}
                          className="text-[11px] px-2 py-0.5 rounded bg-[#3a2f28]/5 dark:bg-foreground/5 text-[#3a2f28]/75 dark:text-foreground/75"
                        >
                          {l}
                        </span>
                      ))}
                      {course.learnings.length > 4 && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#3a2f28]/5 dark:bg-foreground/5 text-[#3a2f28]/70 dark:text-foreground/70">
                          +{course.learnings.length - 4} mehr
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#3a2f28]/70 dark:text-foreground/70">
                      <span>{course.lectures} Lektionen</span>
                      <span>{course.duration} Video</span>
                    </div>
                  </div>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-terracotta-deep)] text-white text-xs font-medium hover:bg-[var(--color-terracotta-deep-hover)] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Kurs starten
                  </a>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="border-t border-[#3a2f28]/10 dark:border-foreground/10 bg-[#f5f0eb]/60 dark:bg-card/40">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70">
                AI & Vibe-Coding Wissensdatenbank &middot; Stand: Mai 2026
              </p>
              <p className="text-xs text-[#3a2f28]/70 dark:text-foreground/70 mt-1">
                Fortlaufend aktualisiert mit den neuesten Anthropic Features und Community Best Practices
              </p>
            </div>
            <Link
              href="/"
              className="text-sm text-[var(--color-terracotta-deep)] hover:underline inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Zurück zur Wissensdatenbank
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
