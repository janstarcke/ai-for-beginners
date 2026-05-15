import { useState } from "react";
import { AnimatedReveal, CollapseReveal } from "@/components/AnimatedReveal";
import { Link } from "wouter";
import { CodeBlock } from "@/components/CodeBlock";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Palette,
  Layers,
  Smartphone,
  Monitor,
  Presentation,
  Zap,
  ExternalLink,
  Sparkles,
  PenTool,
  Share2,
  Settings,
  Video,
  MousePointer,
  Layout,
} from "lucide-react";

/*
 * Design: Warm Craft — Playfair Display + DM Sans
 * Terracotta accents, cream backgrounds, espresso code blocks
 */

const DESIGN_IMAGE =
  "/images/claude-design-hero.webp";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface DesignStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  tip?: string;
  warning?: string;
  promptExample?: string;
}

interface DesignWorkflow {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  steps: DesignStep[];
}

const coreFeatures = [
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Design Systems",
    description:
      "Erstellt ein vollständiges Brand-System aus deinem bestehenden Code, Figma-Dateien oder Assets. Enthält Typografie, Farben, Spacing, UI-Komponenten und Brand Guidelines.",
  },
  {
    icon: <MousePointer className="w-5 h-5" />,
    title: "Tweaks Panel",
    description:
      "Granulare visuelle Anpassungen (Farben, Fonts, Layouts, Ecken-Radien) ohne Text-Prompts. Token-effizienter und schneller als Chat-basierte Änderungen.",
  },
  {
    icon: <PenTool className="w-5 h-5" />,
    title: "Sketch & Draw",
    description:
      "Zeichne direkt auf dem Canvas, um Layouts vorzuskizzieren. Claude interpretiert deine Skizzen und generiert daraus High-Fidelity Designs.",
  },
  {
    icon: <Layout className="w-5 h-5" />,
    title: "Direct Editing",
    description:
      "Klicke auf einzelne Elemente, um Eigenschaften wie Opacity, Breite, Farbe und Abstände direkt zu bearbeiten — ohne Prompt.",
  },
  {
    icon: <Share2 className="w-5 h-5" />,
    title: "Comment System",
    description:
      "Kollaboratives Feedback: Wähle Design-Bereiche aus und hinterlasse Kommentare für Teammitglieder oder sende Anweisungen direkt an Claude Code.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Skills Menu",
    description:
      "Wähle spezifische Fähigkeiten: Animated Video, Interactive Prototype, Slide Deck, Tweakable Controls, Frontend Design oder Wireframe.",
  },
];

const workflows: DesignWorkflow[] = [
  {
    id: "design-system",
    title: "Design System erstellen",
    icon: <Settings className="w-5 h-5" />,
    description:
      "Die Grundlage für alles. Ein Design System sorgt dafür, dass alle zukünftigen Designs konsistent zu deiner Marke sind. Mache das ZUERST.",
    steps: [
      {
        id: "ds-1",
        title: "Design System starten",
        description:
          'Gehe zu claude.ai/design. Klicke im linken Menü auf "Design Systems" → "Create". Gib deinen Firmennamen und eine kurze Beschreibung ein.',
        tip: 'Nutze Claude Chat, um einen System-Prompt zu generieren, der dein Unternehmen beschreibt. Paste diesen als "Blurb" ein — das verbessert die Ergebnisse erheblich.',
      },
      {
        id: "ds-2",
        title: "Kontext bereitstellen (entscheidender Schritt!)",
        description:
          "Claude braucht Material zum Analysieren. Du hast mehrere Optionen: GitHub-Repository verlinken, Code-Ordner per Drag & Drop hochladen, .fig (Figma) Datei uploaden, oder bestehende Screenshots/Assets bereitstellen.",
        command:
          "# Mögliche Inputs:\n- GitHub-Repo URL\n- Lokaler Code-Ordner (Drag & Drop)\n- Figma .fig Datei\n- Logo SVGs, Font-Dateien\n- Screenshots der bestehenden Website",
        tip: "Je mehr Kontext du gibst, desto besser das Ergebnis. Mindestens ein GitHub-Repo ODER einen Code-Ordner verlinken. Zusätzlich Logos und spezifische Fonts hochladen.",
      },
      {
        id: "ds-3",
        title: "Spezifische Notizen hinzufügen",
        description:
          'Im "Notes"-Feld kannst du spezifische Präferenzen angeben: Dark Mode, Akzentfarben, Rundungen, Typografie-Regeln, oder welche Elemente besonders wichtig sind.',
        promptExample:
          '"Dark mode preferred. Orange accent colors (#c4704b). Rounded edges (8px radius). Use DM Sans for body, Playfair Display for headings. Minimal, clean aesthetic."',
      },
      {
        id: "ds-4",
        title: "Generieren & Reviewen",
        description:
          'Klicke "Generate" und warte 5-15 Minuten. Danach reviewe das Ergebnis: Typografie (Fonts, Größen, Gewichte), Core & Semantic Colors, Spacing & Elevation, UI-Komponenten (Buttons, Inputs, Cards, Navbars), Brand Assets.',
        warning:
          "ACHTUNG: Ein Design System kostet 20-25% deines wöchentlichen Usage-Limits! Erstelle nur EIN System und experimentiere nicht. Reset dauert 1 Woche.",
        tip: "Hinterlasse sofort Kommentare auf allem, was nicht stimmt. Frühes Kurs-Korrigieren spart massiv Tokens in späteren Projekten.",
      },
    ],
  },
  {
    id: "web-app",
    title: "Website / Landing Page designen",
    icon: <Monitor className="w-5 h-5" />,
    description:
      "Der häufigste Use Case: Eine neue Seite erstellen, die zu deiner Marke passt. Nutze den Macro-then-Micro Workflow für beste Ergebnisse.",
    steps: [
      {
        id: "web-1",
        title: "Neues Projekt starten",
        description:
          'Klicke "Prototype" → "New prototype". Wähle dein Design System aus dem Dropdown. Wähle "High Fidelity" (empfohlen) statt Wireframe für produktionsreife Designs.',
        tip: 'Wireframe ist gut für Layout-Exploration, aber High Fidelity liefert direkt nutzbare Ergebnisse. Für die meisten Projekte: Immer "High Fidelity" wählen.',
      },
      {
        id: "web-2",
        title: "Inspiration & Kontext bereitstellen",
        description:
          "NIEMALS mit einem leeren Prompt starten! Lade mindestens Screenshots von Websites hoch, die dir gefallen (Dribbble, Awwwards). Optional: Zeichne mit dem Draw-Tool eine grobe Layout-Skizze (Boxen für Hero, Text, Banner).",
        tip: 'Wähle das Opus 4.7 Modell im Model-Dropdown, wenn du Screenshots hochlädst. Es hat deutlich höhere Bild-Auflösung und Fidelity als 4.6.',
        promptExample:
          '"Erstelle eine Landing Page für [Produkt]. Zielgruppe: [X]. Tonfall: professionell aber freundlich. Sektionen: Hero mit CTA, Feature-Vergleich, Testimonials, Pricing, Footer."',
      },
      {
        id: "web-3",
        title: "Claudes Rückfragen beantworten (WICHTIG!)",
        description:
          'Claude wird Rückfragen stellen: Zielgruppe, primäre Aktion, Tonfall, spezifische Sektionen, Hero-Behandlung. Beantworte JEDE Frage spezifisch! Diese Antworten bestimmen 80% der Output-Qualität. Klicke NIEMALS auf "Decide for me".',
        warning:
          '"Decide for me" klicken = generisches, langweiliges Ergebnis. Jede spezifische Antwort verbessert das Design dramatisch.',
      },
      {
        id: "web-4",
        title: "MACRO-Phase: Varianten generieren",
        description:
          "Lass Claude 2-3 komplett verschiedene Stil-Varianten der gesamten Seite generieren. Wähle die beste Richtung als Grundlage für das Feintuning.",
        promptExample:
          '"Can you now create two more variants of this landing page that are wildly different styles? Suggest the different variant styles to me first."',
        tip: "In der Macro-Phase geht es um die GROSSE Richtung: Layout, Stil, Stimmung. Nicht um Details wie Farbnuancen oder Font-Größen.",
      },
      {
        id: "web-5",
        title: "MICRO-Phase: Tweaks Panel nutzen",
        description:
          "Sobald du eine Variante gewählt hast: Nutze das Tweaks Panel (rechte Seite) für Feintuning. Anpassbar: Farbpalette, Akzentfarben, Corner Radius, Background Grids, Fonts, Layout-Switches, Sektionen ein/ausblenden.",
        tip: "Das Tweaks Panel ist UNENDLICH schneller und token-effizienter als Text-Prompts für visuelle Änderungen. Nutze es für alle visuellen Anpassungen!",
      },
      {
        id: "web-6",
        title: "Export & Handoff",
        description:
          'Wenn das Design fertig ist: Share → "Handoff to Claude Code" → "Send to local coding agent" → Command kopieren. In Claude Code einfügen. Alternativ: ZIP-Download oder Export zu Canva.',
        command:
          '# In Claude Design:\n# Share → Handoff to Claude Code → Copy Command\n\n# In Claude Code (Terminal):\n# Paste den kopierten Command\n# Optional: Zusätzliche Anweisungen anhängen:\n"Use the current website top navbar and add a dropdown section..."',
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile App designen",
    icon: <Smartphone className="w-5 h-5" />,
    description:
      "Zwei Wege: Direkt als Mobile-Projekt starten, oder ein bestehendes Web-Design in Mobile übersetzen. Wichtig: NIEMALS im gleichen Fenster umbauen!",
    steps: [
      {
        id: "mob-1",
        title: "Option A: Direkt als Mobile starten",
        description:
          'Neues Projekt → "Mobile" als Format wählen → Design System auswählen → High Fidelity. Dann den normalen Workflow folgen (Kontext bereitstellen, Macro-then-Micro).',
      },
      {
        id: "mob-2",
        title: 'Option B: Web → Mobile übersetzen (RICHTIG)',
        description:
          'NICHT im gleichen Fenster "mach es mobil" sagen — das verwirrt den Kontext! Stattdessen: Oben rechts "Share" → "Duplicate project" klicken. Das Duplikat öffnen (zeigt "Remix" im Titel).',
        command:
          '# Schritt für Schritt:\n# 1. Im fertigen Web-Design: Share → Duplicate project\n# 2. Duplikat öffnen ("Remix" im Titel)\n# 3. Prompt: "Can you show me the same design in a mobile format."\n# 4. Macro-then-Micro Workflow anwenden',
        warning:
          '"Mach es mobil" im gleichen Fenster = Kontext-Chaos. IMMER duplizieren und im neuen Fenster arbeiten!',
      },
    ],
  },
  {
    id: "slide-deck",
    title: "Slide Deck / Präsentation",
    icon: <Presentation className="w-5 h-5" />,
    description:
      'Professionelle Präsentationen erstellen. Pro-Tipp: "Plan Mode" erzwingen für bessere Ergebnisse beim ersten Versuch.',
    steps: [
      {
        id: "slide-1",
        title: "Projekt als Slide Deck starten",
        description:
          'Neues Projekt → "Slide Deck" als Typ wählen → Design System auswählen. Beschreibe das Thema und den Zweck der Präsentation.',
      },
      {
        id: "slide-2",
        title: "Plan Mode erzwingen (Token-Spar-Trick)",
        description:
          'Füge diese Zeile zu deinem Prompt hinzu: "Before you build anything, ask me whatever questions you have so we are on the same page." Claude generiert dann einen Fragenkatalog statt sofort zu bauen.',
        promptExample:
          '"Erstelle eine Pitch-Deck Präsentation für [Startup]. Before you build anything, ask me whatever questions you have so we are on the same page."',
        tip: "Claude fragt dann nach: Zielgruppe, Präsentationslänge, Slide-Anzahl, Editorial-Stil, spezifische Inhalte (Pricing-Tabelle, Vergleichsmatrix). Beantworte alles spezifisch!",
      },
      {
        id: "slide-3",
        title: "Generieren & Exportieren",
        description:
          "Nach Beantwortung der Fragen generiert Claude ein hochgradig zielgerichtetes Deck beim ersten Versuch. Export: PDF, PPTX, oder Handoff zu Claude Code für interaktive Slides.",
        tip: "Ein 5-Slide Deck kostet ca. 5% des wöchentlichen Usage. Deutlich günstiger als Website-Designs!",
      },
    ],
  },
  {
    id: "animation",
    title: "Animiertes Video & Prototyp",
    icon: <Video className="w-5 h-5" />,
    description:
      "Claude Design kann auch animierte Videos (Timeline-basierte Motion Design) und interaktive Prototypen mit funktionierenden Interaktionen erstellen.",
    steps: [
      {
        id: "anim-1",
        title: "Skill auswählen",
        description:
          'Im Skills-Menü des Projekts: Wähle "Animated Video" für Timeline-basierte Motion oder "Interactive Prototype" für klickbare Prototypen mit echten Interaktionen.',
      },
      {
        id: "anim-2",
        title: "Kontext & Prompt",
        description:
          "Beschreibe genau, was animiert werden soll. Für Videos: Szenen, Übergänge, Timing. Für Prototypen: Welche Interaktionen sollen funktionieren (Klicks, Hover, Scroll-Animationen).",
        tip: 'Nutze "Make tweakable" als Skill, um dem generierten Design interaktive Tweak-Controls hinzuzufügen — perfekt für Stakeholder-Präsentationen.',
      },
    ],
  },
  {
    id: "handoff",
    title: "Handoff zu Claude Code (Implementierung)",
    icon: <Zap className="w-5 h-5" />,
    description:
      "Der entscheidende Schritt: Vom Design zum funktionierenden Code. Claude Code liest das Design, analysiert deine Projektstruktur und implementiert alles.",
    steps: [
      {
        id: "hand-1",
        title: "Handoff initiieren",
        description:
          'In Claude Design: Klicke "Share" (oben rechts) → "Handoff to Claude Code" (unten im Menü) → "Send to local coding agent" → Command kopieren.',
        command:
          "# In Claude Design:\n# 1. Share (oben rechts)\n# 2. Handoff to Claude Code\n# 3. Send to local coding agent\n# 4. Command kopieren",
      },
      {
        id: "hand-2",
        title: "In Claude Code einfügen",
        description:
          "Öffne Claude Code Desktop App oder Terminal in deinem Projektverzeichnis. Paste den kopierten Command. Du kannst zusätzliche Anweisungen anhängen (z.B. welche Navbar verwendet werden soll).",
        command:
          '# In Claude Code:\n# Paste den kopierten Command\n# Optional zusätzliche Anweisungen:\n"Implement this design. Use the existing top navbar component.\nEnsure all images use next/image for optimization.\nAdd responsive breakpoints for mobile."',
        tip: "Claude Code liest die Design-Datei, analysiert deine bestehende Projektstruktur und erstellt die nötigen Komponenten und Code-Dateien.",
      },
      {
        id: "hand-3",
        title: "Testen & Debuggen",
        description:
          'Starte deinen Dev-Server (npm run dev). Wenn Fehler auftreten (z.B. Tailwind-Styling-Probleme): Kopiere die Fehlermeldung aus dem Terminal und paste sie in Claude Code. Claude fixt den Fehler automatisch.',
        command:
          "# Dev-Server starten:\nnpm run dev\n\n# Bei Fehlern:\n# 1. Fehlermeldung aus Terminal kopieren\n# 2. In Claude Code pasten\n# 3. Claude fixt automatisch",
        tip: "Die häufigsten Fehler nach Handoff sind Tailwind-Klassen die nicht existieren oder fehlende Dependencies. Beides löst Claude Code in Sekunden.",
      },
      {
        id: "hand-4",
        title: "Alternative Export-Optionen",
        description:
          "Neben Claude Code gibt es: ZIP-Download (für manuelle Integration), Export zu Canva (editierbare Templates für Teams, z.B. Social Media Stories), PDF/PPTX Export für Präsentationen.",
      },
    ],
  },
];

const proTips = [
  {
    title: "Dual-Monitor Setup",
    description:
      "Claude Design auf Monitor 1, Claude Code Desktop auf Monitor 2. Design generieren → sofort implementieren → parallel arbeiten.",
  },
  {
    title: "Das 4-Layer System",
    description:
      "1. PLAN (Claude Chat) → 2. GENERATE (Claude Design) → 3. SHIP (Claude Code) → 4. DISTRIBUTE (Canva für Team-Templates).",
  },
  {
    title: "Memory System nutzen",
    description:
      'Claude Design erstellt automatisch eine instructions.md nach dem Setup. Jedes zukünftige Projekt liest diese Datei, um "on brand" zu bleiben.',
  },
  {
    title: "Niemals 2 Tasks gleichzeitig",
    description:
      "Nie zwei Generierungen parallel laufen lassen. Das friert das Interface ein, killt die Queue und korrumpiert das aktive Projekt.",
  },
  {
    title: "Automation mit Routines",
    description:
      'In Claude Code Desktop → Routines → "Daily SEO page build". Claude generiert automatisch neue, brand-konsistente Seiten nach Zeitplan.',
  },
  {
    title: "Second Brain verbinden",
    description:
      "Nutze Obsidian oder einen lokalen Ordner mit Business-Kontext, SOPs und Projektdetails. Claude Cowork kann diesen Ordner lesen für besseren Design-Kontext.",
  },
];

const usageLimits = [
  { action: "Design System erstellen", cost: "20-25%", note: "Nur 1x machen!" },
  { action: "Landing Page (High Fidelity)", cost: "10-15%", note: "Pro Variante" },
  { action: "Slide Deck (5 Slides)", cost: "~5%", note: "Relativ günstig" },
  { action: "Tweaks Panel Anpassungen", cost: "1-3%", note: "Sehr effizient!" },
  { action: "Mobile Adaptation (Duplikat)", cost: "5-8%", note: "Immer duplizieren" },
];

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */
/* CopyButton wurde nach client/src/components/CopyButton.tsx ausgelagert;
 * lokale Aufrufe sind durch CodeBlock ersetzt worden (siehe Block A). */

function WorkflowSection({ workflow }: { workflow: DesignWorkflow }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <AnimatedReveal
      slide="up"
      className="rounded-xl border border-border bg-[#faf8f5] dark:bg-card shadow-sm overflow-hidden"
    >
      <div
        className="p-6 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#c4704b] text-white shrink-0">
              {workflow.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                {workflow.title}
              </h3>
              <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 mt-1 leading-relaxed max-w-2xl">
                {workflow.description}
              </p>
            </div>
          </div>
          <button
            aria-label={`${workflow.title} ${expanded ? "einklappen" : "ausklappen"}`}
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

      <CollapseReveal open={expanded} duration={250}>
        <div className="px-6 pb-6 space-y-4">
              <div className="border-t border-[#3a2f28]/10 dark:border-foreground/10 pt-4" />
              {workflow.steps.map((step, i) => (
                <div
                  key={step.id}
                  className="rounded-lg border border-[#3a2f28]/8 dark:border-foreground/8 bg-white dark:bg-card p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#c4704b] text-white text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <h4 className="font-semibold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 leading-relaxed ml-10 mb-3">
                    {step.description}
                  </p>

                  {step.promptExample && (
                    <div className="ml-10 mb-3">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7a9b6d] mb-1 block">
                        Beispiel-Prompt
                      </span>
                      <div className="bg-[#7a9b6d]/8 dark:bg-[#7a9b6d]/15 border border-[#7a9b6d]/20 rounded-md p-3">
                        <p className="text-sm text-[#3a2f28]/80 dark:text-foreground/80 italic">
                          {step.promptExample}
                        </p>
                      </div>
                    </div>
                  )}

                  {step.command && (
                    <div className="ml-10 mb-3">
                      <CodeBlock code={step.command} language="bash" filename="Anleitung / Code" />
                    </div>
                  )}

                  {step.tip && (
                    <div className="ml-10 mb-2 flex items-start gap-2.5 p-3 rounded-md bg-[#7a9b6d]/10 dark:bg-[#7a9b6d]/15 border border-[#7a9b6d]/20">
                      <Lightbulb className="w-4 h-4 text-[#7a9b6d] shrink-0 mt-0.5" />
                      <p className="text-sm text-[#3a2f28]/80 dark:text-foreground/80">{step.tip}</p>
                    </div>
                  )}

                  {step.warning && (
                    <div className="ml-10 flex items-start gap-2.5 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-300">{step.warning}</p>
                    </div>
                  )}
                </div>
              ))}
        </div>
      </CollapseReveal>
    </AnimatedReveal>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function ClaudeDesign() {
  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-background">
      {/* ---- Hero ---- */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={DESIGN_IMAGE}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-12"
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
              <Palette className="w-5 h-5 text-[#c4704b]" />
              <p className="text-sm font-medium tracking-widest uppercase text-[#c4704b]">
                Ausführlicher Guide
              </p>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-[#3a2f28] dark:text-foreground leading-tight max-w-3xl font-['Playfair_Display',serif]">
              Claude Design:
              <br />
              <span className="text-[#c4704b]">Vom Prototyp zum Code</span>
            </h1>

            <p className="mt-5 text-lg text-[#3a2f28]/75 dark:text-foreground/75 max-w-2xl leading-relaxed">
              Visuelles Prototyping direkt in Claude. Erstelle Websites, Mobile Apps,
              Slide Decks und interaktive Prototypen — mit nahtlosem Handoff zu Claude Code.
              Wird fortlaufend mit neuen Anthropic-Features und Community-Workflows erweitert.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://claude.ai/design"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c4704b] text-white font-medium text-sm hover:bg-[#a85d3e] transition-colors shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                claude.ai/design öffnen
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

      {/* ---- Usage Limits Warning ---- */}
      <section className="container py-10">
        <AnimatedReveal slide="up" className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 max-w-4xl">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2 font-['Playfair_Display',serif]">
                Usage-Limits verstehen (ZUERST lesen!)
              </h2>
              <p className="text-sm text-amber-800 dark:text-amber-300 mb-4 leading-relaxed">
                Claude Design teilt sich das wöchentliche Usage-Limit mit deinem regulären Claude-Account.
                Es ist ein "Token Hog" — ohne Strategie verbrennst du dein gesamtes Wochenlimit für eine einzige Landing Page.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-amber-300 dark:border-amber-700">
                      <th className="text-left py-2 px-3 text-amber-900 dark:text-amber-200 font-semibold">Aktion</th>
                      <th className="text-left py-2 px-3 text-amber-900 dark:text-amber-200 font-semibold">Kosten (% Wochenlimit)</th>
                      <th className="text-left py-2 px-3 text-amber-900 dark:text-amber-200 font-semibold">Hinweis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageLimits.map((item) => (
                      <tr key={item.action} className="border-b border-amber-200/50 dark:border-amber-800/50">
                        <td className="py-2 px-3 text-amber-800 dark:text-amber-300">{item.action}</td>
                        <td className="py-2 px-3 font-bold text-amber-900 dark:text-amber-200">{item.cost}</td>
                        <td className="py-2 px-3 text-amber-700 dark:text-amber-400">{item.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </AnimatedReveal>
      </section>

      {/* ---- Core Features ---- */}
      <section className="container py-10">
        <AnimatedReveal slide="up" className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] mb-2">
            Features & Fähigkeiten
          </h2>
          <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm">
            Was Claude Design alles kann — und wie du es nutzt.
          </p>
        </AnimatedReveal>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coreFeatures.map((feature, i) => (
            <AnimatedReveal slide="up" delay={i * 0.08} className="bg-[#faf8f5] dark:bg-card rounded-xl p-5 border border-[#3a2f28]/8 dark:border-foreground/8 hover:shadow-md transition-shadow">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#c4704b]/10 text-[#c4704b] mb-3">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-[#3a2f28] dark:text-foreground mb-1.5 font-['Playfair_Display',serif]">
                {feature.title}
              </h3>
              <p className="text-sm text-[#3a2f28]/75 dark:text-foreground/75 leading-relaxed">
                {feature.description}
              </p>
            </AnimatedReveal>
          ))}
        </div>
      </section>

      {/* ---- The Macro-Micro Workflow ---- */}
      <section className="py-12 bg-white/50 dark:bg-card/30">
        <div className="container">
          <AnimatedReveal slide="up" className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-5 h-5 text-[#c4704b]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Der Kern-Workflow: Macro → Micro
              </h2>
            </div>
            <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm max-w-2xl">
              Die wichtigste Strategie für optimale Ergebnisse bei minimalem Token-Verbrauch.
              Wird in allen 10 Videos als Best Practice empfohlen.
            </p>
          </AnimatedReveal>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <AnimatedReveal slide="right" className="bg-[#faf8f5] dark:bg-card rounded-xl p-6 border-2 border-[#c4704b]/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#c4704b] text-white text-sm font-bold">
                  1
                </span>
                <h3 className="text-lg font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                  MACRO-Phase
                </h3>
              </div>
              <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 leading-relaxed mb-3">
                Lass Claude 2-3 komplett verschiedene Stil-Varianten der gesamten Seite generieren.
                Hier geht es um die GROSSE Richtung: Layout, Stil, Stimmung.
              </p>
              <div className="bg-[#7a9b6d]/8 border border-[#7a9b6d]/20 rounded-md p-3">
                <p className="text-xs font-semibold text-[#7a9b6d] mb-1">BEISPIEL-PROMPT:</p>
                <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 italic">
                  "Create two more variants of this landing page that are wildly different styles.
                  Suggest the different variant styles to me first."
                </p>
              </div>
            </AnimatedReveal>

            <AnimatedReveal slide="left" className="bg-[#faf8f5] dark:bg-card rounded-xl p-6 border-2 border-[#7a9b6d]/20">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#7a9b6d] text-white text-sm font-bold">
                  2
                </span>
                <h3 className="text-lg font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                  MICRO-Phase
                </h3>
              </div>
              <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70 leading-relaxed mb-3">
                Sobald du eine Variante gewählt hast: Nutze das Tweaks Panel für Feintuning.
                Unendlich schneller und token-effizienter als Text-Prompts.
              </p>
              <div className="bg-[#c4704b]/8 border border-[#c4704b]/20 rounded-md p-3">
                <p className="text-xs font-semibold text-[#c4704b] mb-1">TWEAKS PANEL:</p>
                <p className="text-sm text-[#3a2f28]/70 dark:text-foreground/70">
                  Farbpalette • Akzentfarben • Corner Radius • Background Grids • Fonts •
                  Layout-Switches • Sektionen ein/ausblenden
                </p>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* ---- Workflows by Project Type ---- */}
      <section className="container py-12">
        <AnimatedReveal slide="up" className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif] mb-2">
            Schritt-für-Schritt nach Projekttyp
          </h2>
          <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm max-w-2xl">
            Klicke auf einen Workflow, um die detaillierte Anleitung mit Befehlen und Beispiel-Prompts zu sehen.
          </p>
        </AnimatedReveal>

        <div className="space-y-4 max-w-4xl">
          {workflows.map((workflow) => (
            <WorkflowSection key={workflow.id} workflow={workflow} />
          ))}
        </div>
      </section>

      {/* ---- Pro Tips ---- */}
      <section className="py-12 bg-white/50 dark:bg-card/30">
        <div className="container">
          <AnimatedReveal slide="up" className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[#c4704b]" />
              <h2 className="text-2xl md:text-3xl font-bold text-[#3a2f28] dark:text-foreground font-['Playfair_Display',serif]">
                Pro-Tipps & Advanced Techniques
              </h2>
            </div>
            <p className="text-[#3a2f28]/75 dark:text-foreground/75 text-sm">
              Fortgeschrittene Strategien aus 10 Video-Analysen.
            </p>
          </AnimatedReveal>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            {proTips.map((tip, i) => (
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

      {/* ---- Anthropic Academy Reference ---- */}
      <section className="container py-12">
        <AnimatedReveal slide="up" className="bg-gradient-to-br from-[#3a2f28] to-[#5a4f48] rounded-xl p-8 text-white max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-5 h-5 text-[#c4704b]" />
            <p className="text-sm font-medium tracking-widest uppercase text-[#c4704b]">
              Weiterführende Kurse
            </p>
          </div>
          <h2 className="text-2xl font-bold mb-3 font-['Playfair_Display',serif]">
            Empfohlene Lernreihenfolge
          </h2>
          <p className="text-white/70 leading-relaxed mb-4 max-w-2xl">
            Kostenlose Kurse mit Videos und Zertifikaten.
            Empfohlener Lernpfad für Claude Design:
          </p>
          <ol className="space-y-2 text-sm text-white/80 mb-6">
            <li className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#c4704b] text-white text-[10px] font-bold shrink-0 mt-0.5">1</span>
              AI Fluency: Framework & Foundations (4D Framework)
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#c4704b] text-white text-[10px] font-bold shrink-0 mt-0.5">2</span>
              Claude Code 101 (Grundlagen)
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#c4704b] text-white text-[10px] font-bold shrink-0 mt-0.5">3</span>
              Claude Code in Action (Fortgeschrittene Workflows)
            </li>
            <li className="flex items-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#c4704b] text-white text-[10px] font-bold shrink-0 mt-0.5">4</span>
              Introduction to Claude Cowork (Design + Files)
            </li>
          </ol>
          <a
            href="https://anthropic.skilljar.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c4704b] text-white font-medium text-sm hover:bg-[#a85d3e] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Zur Anthropic Academy
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
                Fortlaufend aktualisiert mit neuen Design-Workflows und Features
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/guide"
                className="text-sm text-[#c4704b] hover:underline inline-flex items-center gap-1"
              >
                Claude Code Guide
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
