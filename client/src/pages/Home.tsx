import { memo, useCallback, useMemo, useState } from "react";
import { AnimatedReveal, CollapseReveal } from "@/components/AnimatedReveal";
import { Search, Filter, ChevronDown, ChevronUp, AlertTriangle, Sparkles, BookOpen, Palette, ArrowRight, TrendingUp, RotateCcw, Coins, Package } from "lucide-react";
import { Link } from "wouter";
import { skills, categories, tierLabels, tldrItems, claudeDesignSteps } from "@/data/skills";
import type { Skill, TldrItem } from "@/data/skills";
import { useProgress } from "@/hooks/useProgress";
import { ProgressCheckbox } from "@/components/ProgressCheckbox";
import { ProgressBar } from "@/components/ProgressBar";
import { ExportButton } from "@/components/ExportButton";
import { CopyButton } from "@/components/CopyButton";
import { CodeBlock } from "@/components/CodeBlock";
import { InstallCommandModal } from "@/components/InstallCommandModal";

function TldrCard({ item, index }: { item: TldrItem; index: number }) {
  const [open, setOpen] = useState(false);
  const panelId = `tldr-panel-${index}`;
  // Audit Finding #2: Keyboard-Accessibility — Card als role="button" mit
  // Enter+Space-Handler statt nur onClick. Sonst sind 63 Karten für
  // Keyboard- und Screen-Reader-User unzugänglich.
  const toggle = () => setOpen(!open);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };
  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex items-start gap-3 cursor-pointer rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-2"
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-terracotta-deep)] text-white text-xs font-bold shrink-0">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-sm text-foreground leading-relaxed">{item.summary}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </div>
      <CollapseReveal open={open} id={panelId}>
        <div className="mt-3 ml-9">
          <CodeBlock code={item.example} language="bash" filename="Beispiel" />
        </div>
      </CollapseReveal>
    </div>
  );
}

const HERO_IMAGE = "/images/hero-banner.webp";
const WORKFLOW_IMAGE = "/images/workflow-illustration.webp";
const DESIGN_IMAGE = "/images/claude-design-hero.webp";

// Audit Finding #17: Memoization. Bei jedem Suchstring-Tastendruck triggert
// Home() einen Re-Render — ohne memo() würden alle 63 SkillCards mit
// re-rendern. Da onToggle als useCallback stabil ist, kann memo() greifen.
const SkillCard = memo(function SkillCard({ skill, index, isCompleted, onToggle }: { skill: Skill; index: number; isCompleted: boolean; onToggle: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const panelId = `skill-panel-${skill.id}`;
  // Audit Finding #20: Single source-of-truth für den installCommand-Guard.
  // Button (im expanded-Panel) und Modal-Wrapper (auf Card-Toplevel) waren
  // beide separat geguarded — bei Schema-Drift wäre command="" durchgerutscht.
  const installCommand = skill.installCommand;

  const tierColor = skill.tier === 1
    ? "border-l-[var(--color-terracotta)]"
    : skill.tier === 2
    ? "border-l-[var(--color-sage)]"
    : skill.tier === 3
    ? "border-l-[var(--color-espresso)]"
    : "border-l-border";

  // Audit Finding #2: Keyboard-Accessibility — Card-Header wird als
  // role="button" mit Enter+Space-Handler annotiert. Nested-interactive
  // Elemente (ProgressCheckbox, Install-Button) nutzen e.stopPropagation,
  // damit sie die Card nicht mit-toggeln.
  const toggleExpanded = () => setExpanded(!expanded);
  const onHeaderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleExpanded();
    }
  };

  return (
    <AnimatedReveal
      slide="up"
      delay={index * 0.03}
      duration={300}
      className={`bg-card rounded-lg border-l-4 ${tierColor} border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="p-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-inset"
        onClick={toggleExpanded}
        onKeyDown={onHeaderKeyDown}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <ProgressCheckbox
                id={`skill-${skill.id}`}
                checked={isCompleted}
                onToggle={onToggle}
                ariaLabel={`${skill.name} als erledigt markieren`}
              />
              <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-sm font-semibold text-secondary-foreground font-[var(--font-display)] ${isCompleted ? 'opacity-50' : ''}`}>
                {skill.id}
              </span>
              {/* Audit Finding #14: Tier-Badge mit explizitem Text-Label.
                  Vorher war die Tier-Information nur via Border-Farbe codiert
                  (color-only-information) — für Color-blind-User (Deutan/
                  Protan: terracotta vs sage schwer trennbar) unzugänglich. */}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  skill.tier === 1
                    ? "bg-[var(--color-terracotta)]/15 text-[var(--color-terracotta-deep)]"
                    : skill.tier === 2
                    ? "bg-[var(--color-sage)]/20 text-[var(--color-espresso)]"
                    : skill.tier === 3
                    ? "bg-[var(--color-espresso)]/15 text-[var(--color-espresso)]"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                Tier {skill.tier}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {skill.category}
              </span>
              {skill.isNew && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-sage-light)] text-[var(--color-espresso)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> NEU
                </span>
              )}
              {skill.warning && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Vorsicht
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground leading-tight font-[var(--font-display)]">
              {skill.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              {skill.description}
            </p>
          </div>
          {/* Chevron ist visuell — der Toggle-State wird von aria-expanded
              auf dem Card-Header kommuniziert. Daher als span+aria-hidden. */}
          <span aria-hidden="true" className="mt-1 text-muted-foreground shrink-0">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </div>
      </div>

      <CollapseReveal open={expanded} id={panelId}>
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-0 border-t border-border/50">
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Nächster Schritt
                    </h4>
                    <CopyButton text={skill.nextStep} />
                  </div>
                  <p className="text-sm bg-secondary/60 rounded-md p-3 font-mono text-foreground leading-relaxed">
                    {skill.nextStep}
                  </p>
                </div>

                {skill.warning && (
                  <div className="flex items-start gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">{skill.warning}</p>
                  </div>
                )}

                {installCommand && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInstallOpen(true);
                    }}
                    onKeyDown={(e) => {
                      // Audit Finding #2 follow-on: Enter/Space soll Install-
                      // Modal öffnen, NICHT die Card-Expand-Aktion triggern.
                      if (e.key === "Enter" || e.key === " ") {
                        e.stopPropagation();
                      }
                    }}
                    aria-haspopup="dialog"
                    aria-expanded={installOpen}
                    aria-label={`Setup-Befehl für ${skill.name} anzeigen`}
                    className="inline-flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-md border border-[var(--color-terracotta)]/30 bg-[var(--color-terracotta)]/5 hover:bg-[var(--color-terracotta)]/10 text-sm font-medium text-[var(--color-terracotta)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-2"
                    title="Setup-Befehl anzeigen"
                  >
                    <Package className="w-4 h-4" aria-hidden="true" />
                    Installieren
                  </button>
                )}
              </div>
            </div>
          </div>
        </CollapseReveal>

      {installCommand && (
        <InstallCommandModal
          open={installOpen}
          onOpenChange={setInstallOpen}
          skillName={skill.name}
          command={installCommand}
          note={skill.installNote}
        />
      )}
    </AnimatedReveal>
  );
});

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { isCompleted, toggle, completedCount, reset } = useProgress();

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch =
        searchQuery === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.nextStep.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Alle" || skill.category === selectedCategory;
      const matchesTier = selectedTier === null || skill.tier === selectedTier;
      return matchesSearch && matchesCategory && matchesTier;
    });
  }, [searchQuery, selectedCategory, selectedTier]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>
        <div className="relative container py-16 md:py-24">
          <AnimatedReveal slide="up" duration={600}>
            <p className="text-sm font-medium tracking-widest uppercase text-[var(--color-terracotta)] mb-3">
              Das Tutorial für Beginner bis Fortgeschrittene
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-3xl font-[var(--font-display)]">
              AI & Vibe-Coding
              <br />
              <span className="text-[var(--color-terracotta)]">Wissensdatenbank</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Das ultimative Ranking aller Skills, Tools und Best Practices für Claude Code,
              Vibe Coding und AI-gestütztes Development. Durchsuchbar, priorisiert, mit
              konkreten Handlungsanweisungen.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/guide"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-terracotta-deep)] text-white font-medium text-sm hover:bg-[var(--color-terracotta-deep-hover)] transition-colors shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Beginner-to-Pro Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/claude-design"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors"
              >
                <Palette className="w-4 h-4" />
                Claude Design Guide
              </Link>
              <Link
                href="/financial-analyst"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-sage-deep)] text-white font-medium text-sm hover:bg-[var(--color-sage-deep-hover)] transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                Financial Analyst
              </Link>
              <Link
                href="/token-spar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-espresso)] text-white font-medium text-sm hover:bg-[var(--color-espresso)]/90 transition-colors"
              >
                <Coins className="w-4 h-4" />
                Token-Spar Guide
              </Link>
              <a
                href="#skills"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-secondary/50 transition-colors"
              >
                Skill-Ranking ansehen
              </a>
            </div>
          </AnimatedReveal>
        </div>
      </header>

      {/* TL;DR Section */}
      <section className="container py-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 font-[var(--font-display)]">
          TL;DR — Die wichtigsten Erkenntnisse auf einen Blick
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {tldrItems.map((item, i) => (
            <AnimatedReveal
              key={i}
              slide="up"
              delay={i * 0.08}
              className="p-4 rounded-lg bg-card border border-border shadow-sm"
            >
              <TldrCard item={item} index={i} />
            </AnimatedReveal>
          ))}
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="container py-8 sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        {completedCount > 0 && (
          <div className="mb-3">
            <ProgressBar
              completed={completedCount}
              total={skills.length}
              label={`${completedCount} / ${skills.length} Skills erledigt`}
            />
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Skills durchsuchen... (z.B. 'MCP', 'Security', 'Kosten')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-input bg-card text-sm font-medium text-foreground hover:bg-secondary transition-colors md:w-auto"
          >
            <Filter className="w-4 h-4" />
            Filter
            {(selectedCategory !== "Alle" || selectedTier !== null) && (
              <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta)]" />
            )}
          </button>
        </div>

        <CollapseReveal open={showFilters}>
            <div className="pt-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Kategorie</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedCategory === cat
                            ? "bg-[var(--color-terracotta-deep)] text-white"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Tier / Priorität</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedTier(null)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        selectedTier === null
                          ? "bg-[var(--color-terracotta-deep)] text-white"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      Alle Tiers
                    </button>
                    {Object.entries(tierLabels).map(([tier, { description }]) => (
                      <button
                        key={tier}
                        onClick={() => setSelectedTier(Number(tier))}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedTier === Number(tier)
                            ? "bg-[var(--color-terracotta-deep)] text-white"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        Tier {tier}: {description}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
        </CollapseReveal>
      </section>

      {/* Skills Grid */}
      <section className="container py-10" id="skills">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground font-[var(--font-display)]">
            Skill-Ranking
          </h2>
          <div className="flex items-center gap-3">
            {completedCount > 0 && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-sage-light)] text-[var(--color-espresso)]">
                {completedCount} / {skills.length} erledigt
              </span>
            )}
            {completedCount > 0 && (
              <button
                onClick={reset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                title="Fortschritt zurücksetzen"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
            {completedCount > 0 && (
              <ExportButton isCompleted={isCompleted} />
            )}
            <span className="text-sm text-muted-foreground">
              {filteredSkills.length} von {skills.length} Skills
            </span>
          </div>
        </div>

        {filteredSkills.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Keine Skills gefunden für diese Filter.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} isCompleted={isCompleted(`skill-${skill.id}`)} onToggle={toggle} />
            ))}
          </div>
        )}
      </section>

      {/* Claude Design Section */}
      <section className="py-16 bg-secondary/40">
        <div className="container">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-6 h-6 text-[var(--color-terracotta)]" />
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--color-sage-light)] text-[var(--color-espresso)]">
              <Sparkles className="w-3 h-3 inline mr-1" />NEUE RUBRIK
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-[var(--font-display)]">
            Claude Design
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Visuelles Prototyping direkt in Claude. Erstelle Websites, Slide Decks und interaktive
            Prototypen — mit Handoff zu Claude Code für die Implementierung.
          </p>

          <div className="rounded-xl overflow-hidden mb-10 shadow-lg max-w-4xl">
            <img
              src={DESIGN_IMAGE}
              alt="Claude Design Workflow"
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {claudeDesignSteps.map((step, i) => (
              <AnimatedReveal
                key={step.phase}
                slide="up"
                delay={i * 0.1}
                className="bg-card rounded-lg p-5 border border-border shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-terracotta-deep)] text-white text-sm font-bold font-[var(--font-display)]">
                    {step.phase}
                  </span>
                  <h3 className="text-sm font-semibold text-foreground font-[var(--font-display)]">
                    {step.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </AnimatedReveal>
            ))}
          </div>

          {/* Warnings */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-5 max-w-3xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">Wichtige Hinweise</h4>
                <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1.5">
                  <li>• Eigenes wöchentliches Usage-Limit (getrennt vom Chat). Reset dauert 1 Woche!</li>
                  <li>• Design System ZUERST anlegen — spart Tokens bei der Generation</li>
                  <li>• Immer "Erstelle 3 Varianten" prompten, dann die beste verfeinern</li>
                  <li>• Opus 4.7 im Model-Dropdown auswählen für beste Ergebnisse</li>
                  <li>• Generation vollständig abwarten bevor du editierst</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/claude-design" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--color-terracotta-deep)] text-white font-medium hover:opacity-90 transition-opacity shadow-sm">
              <Palette className="w-4 h-4" />
              Zum ausführlichen Claude Design Guide
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-foreground mb-4 font-[var(--font-display)]">
          Der optimale Vibe-Coding Workflow
        </h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          6 Phasen von der Vorbereitung bis zum sicheren Deployment — basierend auf den Best Practices aus allen analysierten Quellen.
        </p>
        <div className="rounded-xl overflow-hidden shadow-lg max-w-4xl">
          <img
            src={WORKFLOW_IMAGE}
            alt="Vibe Coding Workflow"
            loading="lazy"
            decoding="async"
            className="w-full h-auto"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {[
            { phase: 1, title: "Vorbereitung", desc: "Projektordner + CLAUDE.md + /init" },
            { phase: 2, title: "Design & Prompting", desc: "Claude Design oder Prompt Master nutzen" },
            { phase: 3, title: "Planung", desc: "Sequential Thinking MCP + Opus für Planung" },
            { phase: 4, title: "Implementierung", desc: "Sub-Agent Driven Development" },
            { phase: 5, title: "Steering & Testing", desc: "Screenshots + Playwright MCP" },
            { phase: 6, title: "Security & Review", desc: "Ultra Review + Trail of Bits" },
          ].map((step, i) => (
            <AnimatedReveal
              key={step.phase}
              slide="up"
              delay={i * 0.08}
              className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-sage-deep)] text-white text-sm font-bold shrink-0 font-[var(--font-display)]">
                {step.phase}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground font-[var(--font-display)]">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                AI & Vibe-Coding Wissensdatenbank &middot; Stand: Mai 2026
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Fortlaufend aktualisiert mit den neuesten Features, Best Practices und Community-Erkenntnissen
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Neue Skills & Features werden fortlaufend ergänzt, sobald Anthropic Updates veröffentlicht.
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Rechtliches">
              <Link to="/impressum" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Impressum
              </Link>
              <Link to="/datenschutz" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Datenschutz
              </Link>
              <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Disclaimer
              </Link>
            </nav>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Jan Starcke · Kein offizielles Anthropic-Angebot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
