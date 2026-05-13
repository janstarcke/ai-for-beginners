export interface GuideStep {
  id: string;
  title: string;
  description: string;
  command?: string;
  tip?: string;
  warning?: string;
  source?: string;
}

export interface GuideLevel {
  level: number;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  estimatedTime: string;
  steps: GuideStep[];
}

export const guideLevels: GuideLevel[] = [
  {
    level: 1,
    title: "Einsteiger",
    subtitle: "Installation, erste Schritte & Grundlagen",
    color: "sage",
    icon: "seedling",
    estimatedTime: "1-2 Stunden",
    steps: [
      {
        id: "1-1",
        title: "Voraussetzungen prüfen",
        description: "Du brauchst einen bezahlten Claude-Plan (Pro oder Max). Der kostenlose Plan enthält Claude Code nicht. Lade die Claude Desktop App herunter -- das ist der einfachste Einstieg für Anfänger. Alternativ kannst du Claude Code auch im Terminal oder einer IDE nutzen.",
        tip: "Max-Plan lohnt sich, wenn du Claude Code intensiv nutzen willst. Pro reicht für den Anfang. Usage-Limits resetten alle 5 Stunden, es gibt auch ein wöchentliches Cap.",
      },
      {
        id: "1-2",
        title: "Workspace-Strategie festlegen",
        description: "Erstelle dedizierte Ordner (Workspaces) für jede Aufgabe: z.B. einen 'Website-Workspace', einen 'Marketing-Workspace' etc. Erstelle einen leeren 'Template-Workspace' mit der richtigen Ordnerstruktur und dupliziere ihn für jedes neue Projekt. Öffne in VS Code immer genau den Root-Ordner des Workspaces -- nicht den übergeordneten Ordner.",
        command: "mkdir -p ~/workspaces/template/{src,context,docs}\ncp -r ~/workspaces/template ~/workspaces/mein-neues-projekt",
        tip: "Ein sauberer Workspace ist die Grundlage für alles. Wenn du den falschen Ordner öffnest, wird Claude verwirrt und liefert schlechtere Ergebnisse.",
      },
      {
        id: "1-3",
        title: "Context-Ordner anlegen (Dein Gedächtnis)",
        description: "Erstelle im Workspace einen 'Context'-Ordner mit Markdown-Dateien: business-info.md (Was macht dein Unternehmen?), personal-info.md (Wer bist du, dein Tonfall?), project-goals.md (Was willst du erreichen?). Profi-Tipp: Nutze ein Diktiertool wie WhisperFlow -- sprich 10-30 Minuten deine gesamte Business-Strategie ein und paste den transkribierten Text in die Markdown-Dateien.",
        command: "# Context-Ordner erstellen:\nmkdir -p context/\ntouch context/business-info.md\ntouch context/personal-info.md\ntouch context/project-goals.md",
        tip: "Je mehr Kontext du vorab lieferst, desto besser die Ergebnisse. 10 Minuten Vorbereitung sparen dir Stunden an Iterationen.",
      },
      {
        id: "1-4",
        title: "Plan Mode nutzen (IMMER zuerst!)",
        description: "Bevor du deinen ersten Prompt abschickst, wechsle den Modus von 'Accept edits' auf 'Plan mode'. So erstellt Claude erst einen strukturierten Plan, statt sofort loszucoden. Du kannst den Plan reviewen, Fragen beantworten und verfeinern. Erst wenn du zufrieden bist, klicke 'Accept, allow edits'.",
        tip: "Immer zuerst planen lassen! Das verhindert, dass Claude in die falsche Richtung baut und du Tokens verschwendest. Nutze den /create_plan Befehl für noch detailliertere Pläne.",
      },
      {
        id: "1-5",
        title: "CLAUDE.md anlegen mit /init",
        description: "Tippe /init in den Chat. Claude erstellt automatisch eine CLAUDE.md Datei in deinem Projektordner. Diese Datei ist das permanente 'Gedächtnis' deines Projekts -- sie speichert Regeln, Tech-Stack und Architektur-Entscheidungen über Sessions hinweg. Installiere zusätzlich das 'CLAUDE.md Management' Plugin für automatische Aktualisierung.",
        command: "/init\n\n# Dann Plugin installieren:\n# /manage plugins → 'CLAUDE.md Management' installieren",
        tip: "Die CLAUDE.md ist das Wichtigste für langfristige Projekte. Ohne sie vergisst Claude alles bei einer neuen Session. Das Management-Plugin aktualisiert sie automatisch am Ende jeder Session.",
      },
      {
        id: "1-6",
        title: "Session primen (/prime)",
        description: "Am Anfang JEDER neuen Session: Lass Claude zuerst alle Context-Dateien lesen. Erstelle dir einen eigenen /prime Befehl, der Claude anweist, alle Markdown-Dateien im Context-Ordner zu lesen. So weiß Claude sofort, wer du bist, was dein Business macht und was das aktuelle Projekt-Ziel ist.",
        command: "# Eigenen /prime Befehl erstellen oder manuell:\n'Lies alle Dateien im Context-Ordner und fasse zusammen, was du über mich und das Projekt weißt.'",
        tip: "Ohne Priming startet Claude bei Null. 30 Sekunden Priming = deutlich bessere Ergebnisse in der gesamten Session.",
      },
      {
        id: "1-7",
        title: "Iterieren: Eine Änderung nach der anderen",
        description: "Nachdem der erste Prototyp steht, verfeinere ihn Schritt für Schritt. Die wichtigste Regel: Immer nur EINE Änderung pro Prompt. Mehrere Änderungen gleichzeitig führen zu unvorhersehbaren Ergebnissen und machen Debugging unmöglich.",
        tip: "Nutze Screenshots! Wenn du einen visuellen Fehler siehst, mach einen Screenshot und ziehe ihn in den Chat. Claude versteht Bilder oft besser als Text-Beschreibungen. Wähle dafür das Opus-Modell (höhere Bild-Auflösung).",
      },
      {
        id: "1-8",
        title: "API-Keys sicher handhaben",
        description: "Wenn dein Projekt einen API-Key braucht: NIEMALS den Key direkt in den Chat einfügen! Bitte Claude, eine .env.local Datei zu erstellen. Öffne diese Datei dann manuell und füge deinen Key dort ein.",
        command: "# Claude erstellt die Datei, du fügst den Key manuell ein:\necho 'API_KEY=dein-key-hier' > .env.local",
        warning: "API-Keys im Chat landen im Kontext und könnten in Logs auftauchen. Immer .env.local nutzen!",
      },
      {
        id: "1-9",
        title: "Session sauber beenden (/shutdown)",
        description: "Am Ende jeder Session: Lass Claude den Workspace aufräumen, unnötige Dateien löschen, die Context-Dateien mit neuen Erkenntnissen aktualisieren und alles konsolidieren. So startet die nächste Session genau da, wo du aufgehört hast.",
        command: "# Am Ende der Session:\n'Räume den Workspace auf, lösche unnötige Dateien, aktualisiere die Context-Dateien mit allen neuen Erkenntnissen dieser Session.'",
        tip: "Alternativ: Bitte Claude, alles Wichtige zusammenzufassen. Kopiere die Zusammenfassung als ersten Prompt in die neue Session.",
      },
    ],
  },
  {
    level: 2,
    title: "Fortgeschritten",
    subtitle: "Kontext-Management, MCPs & Produktivität",
    color: "terracotta",
    icon: "flame",
    estimatedTime: "1 Woche",
    steps: [
      {
        id: "2-1",
        title: "Kontext-Hygiene meistern",
        description: "Der Kontext ist wie ein Eimer -- er füllt sich mit jedem Prompt. Bei 60% Auslastung nutze /compact, um den Kontext zusammenzufassen. Bei einer komplett neuen Aufgabe nutze /clear für einen frischen Start. Ohne Kontext-Hygiene halluziniert Claude, vergisst Anweisungen und verbrennt Tokens.",
        command: "/compact  # bei 60% Auslastung\n/clear    # bei neuer Aufgabe",
        tip: "Kontext-Hygiene ist der #1 Skill. Wer das nicht beherrscht, verschwendet 50%+ seiner Tokens.",
      },
      {
        id: "2-2",
        title: ".claudeignore einrichten",
        description: "Erstelle eine .claudeignore Datei (wie .gitignore). Sie verhindert, dass Claude node_modules, Build-Artefakte und Lock-Files indexiert. Das spart massiv Tokens und beschleunigt die Arbeit.",
        command: "# .claudeignore Datei erstellen:\nnode_modules/\ndist/\nbuild/\n.env\n.env.local\npackage-lock.json\n*.log",
      },
      {
        id: "2-3",
        title: "Modell-Strategie & Thinking-Budget",
        description: "Nutze Opus für Planung und komplexe Architektur. Wechsle zu Sonnet für iterative Änderungen -- das spart bis zu 70% der Kosten. Senke das Thinking-Budget auf 10.000 Tokens und nutze Sonnet für Sub-Agenten.",
        command: "# In ~/.claude/settings.json:\n{\n  \"MAX_THINKING_TOKENS\": \"10000\",\n  \"CLAUDE_CODE_SUBAGENT_MODEL\": \"sonnet\"\n}",
        tip: "Opus = Planung & komplexe Architektur. Sonnet = Iterative Änderungen & Bug-Fixes. Diese Strategie allein spart 40-70% der Kosten.",
      },
      {
        id: "2-4",
        title: "Auto Mode aktivieren",
        description: "Auto Mode ist die sichere Alternative zum YOLO Mode. Ein eingebauter Classifier prüft riskante Aktionen automatisch, während Claude trotzdem weitgehend autonom arbeiten kann. Standardmäßig fragt Claude bei jeder Aktion nach Erlaubnis (Y/N).",
        command: "claude --enable-auto-mode\n# Oder im Chat: Shift+Tab zum Umschalten",
        tip: "Auto Mode ist der beste Kompromiss zwischen Geschwindigkeit und Sicherheit. YOLO (--dangerously-skip-permissions) nur in isolierten Cloud-Umgebungen nutzen, NIEMALS auf dem lokalen Rechner!",
        warning: "Der --dangerously-skip-permissions Flag kann dazu führen, dass Claude wichtige Dateien löscht. Nur in isolierten Umgebungen verwenden!",
      },
      {
        id: "2-5",
        title: "Essentielle MCPs einrichten",
        description: "MCPs erweitern Claude um externe Fähigkeiten. Die zwei wichtigsten: Sequential Thinking (strukturiertes Planen) und Memory (Langzeitgedächtnis). Beide sind offizielle Anthropic-Server, kostenlos und ohne API-Key. Installiere MCPs immer auf Projektebene, nicht global.",
        command: "# Regel in CLAUDE.md hinzufügen:\n# 'Alle SKILLS und MCP Server werden immer auf Projektebene installiert.'\n\n# In .mcp.json:\n{\n  \"sequential-thinking\": {\n    \"command\": \"npx\",\n    \"args\": [\"-y\", \"@modelcontextprotocol/server-sequential-thinking\"]\n  },\n  \"memory\": {\n    \"command\": \"npx\",\n    \"args\": [\"-y\", \"@modelcontextprotocol/server-memory\"]\n  }\n}",
        warning: "Jeder aktive MCP verbraucht Tokens im Kontext (bis zu 18.000 pro Nachricht). Nur die MCPs aktivieren, die du gerade brauchst!",
      },
      {
        id: "2-6",
        title: "Top 10 Skills & Plugins installieren",
        description: "Installiere die wichtigsten Plugins über den Marketplace: Feature Dev (strukturierter 7-Phasen-Workflow von Anthropic), Superpowers (TDD + Brainstorming), CLAUDE.md Management (automatische Aktualisierung). Für Skills: Excalidraw (Diagramme), Context7 (aktuelle API-Docs), Firecrawl (Web-Scraping), Playwright (Browser-Steuerung).",
        command: "# Plugins über Marketplace:\n/manage plugins\n# → Feature Dev, Superpowers, CLAUDE.md Management\n\n# Skills über GitHub:\n# Excalidraw: github.com/colemedin/excalidraw-diagram-skill\n# Context7: github.com/context7/context7\n# Firecrawl: npx firecrawl-cli login --browser",
        tip: "Context7 als CLI + Skill installieren (nicht als MCP) -- das ist token-effizienter. Firecrawl braucht Browser-Auth nach der Installation.",
      },
      {
        id: "2-7",
        title: "Git & GitHub Integration",
        description: "Claude kann Git-Befehle direkt ausführen. Verbinde dein Repo mit GitHub für automatische Backups. Du brauchst keine Git-Kenntnisse -- sage Claude einfach: 'Erstelle eine Verbindung zu GitHub und pushe den gesamten Workspace als privates Repository.'",
        command: "# GitHub CLI authentifizieren:\ngh auth login\n\n# Dann Claude sagen:\n'Erstelle ein privates GitHub-Repo und pushe den Workspace.'",
        tip: "Verknüpfe dein GitHub-Repo mit Vercel oder Netlify. Dann führt jeder Push durch Claude automatisch zu einem Live-Deployment.",
        warning: "Ohne GitHub-Backup: Ein verschüttetes Glas Wasser auf dem Laptop = alles weg. Immer in die Cloud pushen!",
      },
    ],
  },
  {
    level: 3,
    title: "Profi",
    subtitle: "Sub-Agenten, Hooks, Claude Design & Automatisierung",
    color: "espresso",
    icon: "rocket",
    estimatedTime: "2-3 Wochen",
    steps: [
      {
        id: "3-1",
        title: "Sub-Agent Driven Development",
        description: "Statt einen einzigen Chat mit allem zu überladen, erstelle spezialisierte Sub-Agenten. Agent A kümmert sich um Frontend, Agent B um Backend, Agent C um Texte. Alle arbeiten parallel in separaten Kontextfenstern. Das spart massiv Tokens und Zeit, da nicht jeder Agent den gesamten Kontext kennen muss.",
        command: "/agents -> 'Create new agent'\n# Erstelle spezialisierte Agenten:\n# - Frontend Designer (UI/UX)\n# - Backend Profi (APIs/DB)\n# - Copywriter (Texte)\n# - QA Tester (Tests)",
        tip: "Die Haupt-Instanz plant und koordiniert, Sub-Agenten implementieren. Niemals die Haupt-Instanz den gesamten Code schreiben lassen!",
      },
      {
        id: "3-2",
        title: "Hooks einrichten (Pre/Post Tool Use)",
        description: "Hooks sind automatische Trigger, die vor oder nach jeder Claude-Aktion ausgeführt werden. Beispiel: Nach jedem Datei-Speichern wird automatisch ein Linter und die Test-Suite ausgeführt. Schlägt der Test fehl, sieht Claude den Fehler sofort und korrigiert ihn -- ohne dass du eingreifen musst.",
        command: "# In .claude/settings.local.json:\n{\n  \"hooks\": {\n    \"postToolUse\": [\n      {\n        \"tool\": \"write_file\",\n        \"command\": \"npm run lint && npm test\"\n      }\n    ]\n  }\n}",
      },
      {
        id: "3-3",
        title: "PRD-basierter Workflow",
        description: "Für professionelle Projekte: Schreibe ein Product Requirements Document (PRD) als Markdown-Datei. Definiere dort alle Anforderungen: Farben, Sections, Funktionen, Tech-Stack. Dann sage Claude: 'Lies das PRD und setze es exakt um.' Claude generiert einen detaillierten Implementierungsplan (claude.md) mit Architektur, Design-Philosophie und exakten Schritten.",
        tip: "Ein gutes PRD spart dir 80% der Iterationszeit. Je detaillierter das PRD, desto besser das Ergebnis beim ersten Versuch. Reviewe den generierten Plan manuell bevor du 'Go' gibst.",
      },
      {
        id: "3-4",
        title: "Claude Design: Design System erstellen",
        description: "Gehe zu claude.ai/design. Erstelle zuerst ein Design System: Firmenname eingeben, GitHub-Repo oder Code-Ordner verlinken, Figma-Dateien hochladen, Logos und Fonts hinzufügen, spezifische Notizen (Dark Mode, Akzentfarben, Rundungen). Klicke 'Generate' und warte 5-15 Minuten. Reviewe dann Farben, Typografie und UI-Kits.",
        command: "# In Claude Design:\n# 1. Design Systems → Create\n# 2. Firmenname + Beschreibung\n# 3. GitHub-Repo oder Code-Ordner verlinken\n# 4. Fonts, Logos, Assets hochladen\n# 5. Generate (5-15 Min warten)",
        warning: "Ein Design System kostet 20-25% deines wöchentlichen Limits! Erstelle nur EIN System und experimentiere nicht. Reset dauert 1 Woche.",
      },
      {
        id: "3-5",
        title: "Claude Design: Macro-then-Micro Workflow",
        description: "Der optimale Design-Workflow: MACRO-Phase: Lass Claude 2-3 komplett verschiedene Stil-Varianten generieren. Wähle die beste Richtung. MICRO-Phase: Nutze das Tweaks-Panel für Feintuning (Farben, Fonts, Layouts, Ecken-Radien). Das Tweaks-Panel ist schneller und token-effizienter als Text-Prompts für visuelle Änderungen.",
        tip: "Beantworte Claudes Rückfragen IMMER spezifisch (Zielgruppe, Tonfall, Sektionen). Diese Antworten bestimmen 80% der Output-Qualität. Klicke NICHT auf 'Decide for me'.",
      },
      {
        id: "3-6",
        title: "Claude Design → Claude Code Handoff",
        description: "In Claude Design: Share → Handoff to Claude Code → 'Send to local coding agent' → Command kopieren. In Claude Code: Command einfügen. Claude liest die Design-Datei, analysiert deine Projektstruktur und implementiert das Design. Bei Fehlern (z.B. Tailwind): Fehlermeldung aus dem Terminal kopieren und in Claude Code pasten.",
        command: "# In Claude Design:\n# Share → Handoff to Claude Code → Copy Command\n# In Claude Code:\n# Paste den kopierten Command\n# Optional: Zusätzliche Anweisungen anhängen",
        tip: "Für Mobile-Versionen: NICHT im gleichen Fenster 'mach es mobil' sagen. Stattdessen: Projekt duplizieren (Share → Duplicate) und im Duplikat die Mobile-Version erstellen.",
      },
      {
        id: "3-7",
        title: "Loops & Scheduled Tasks",
        description: "Claude kann Aufgaben wiederholt ausführen. Loops (/loop) laufen lokal mit Dateizugriff, stoppen aber wenn du das Terminal schließt. Scheduled Tasks (/schedule) laufen remote in der Cloud (auch bei ausgeschaltetem PC), haben aber keinen lokalen Dateizugriff und kommunizieren über Git/APIs.",
        command: "/loop   # Lokal, mit Dateizugriff, stoppt bei Terminal-Close\n/schedule  # Remote, läuft immer, kein lokaler Dateizugriff",
        tip: "Loops für lokale Aufgaben (Datei-Monitoring). Scheduled Tasks für wiederkehrende Cloud-Aufgaben (tägliche News, E-Mail-Reports).",
      },
      {
        id: "3-8",
        title: "Security Audit vor dem Deploy",
        description: "Bevor du ein Projekt öffentlich machst: Lass Claude einen Security-Check durchführen. Installiere zusätzlich das Trail of Bits Plugin für professionelle Security-Audits (SQL Injection, XSS, etc.). Nutze auch den Ultra Review Multi-Agent Workflow für umfassende Code-Reviews.",
        command: "# Im Chat:\n'Führe einen vollständigen Security-Check durch'\n\n# Trail of Bits Plugin:\n/plugin marketplace add trailofbits/skills\n\n# Ultra Review Plugin:\n/ultrareview",
      },
    ],
  },
  {
    level: 4,
    title: "Experte",
    subtitle: "Routinen, Deep Integration & Vollautomatisierung",
    color: "terracotta",
    icon: "crown",
    estimatedTime: "Fortlaufend",
    steps: [
      {
        id: "4-1",
        title: "Automatisierte Routinen erstellen",
        description: "In der Claude Desktop App unter 'Routines': Erstelle automatisierte Workflows mit Zeitplan. Beispiel: Täglich um 8 Uhr recherchiert Claude neue SEO-Keywords, wählt die Top 3 mit höchstem Traffic-Potenzial, erstellt Seiten nach deinem Template und deployed sie automatisch.",
        command: "# In Claude Desktop App:\n# Routines → Create New Routine\n# Schedule: Daily at 08:00\n# Prompt: 'Research new SEO pages every day.\n#   Choose top 3 with highest search traffic potential.\n#   Build 3 new pages following project conventions.'",
      },
      {
        id: "4-2",
        title: "Zapier/n8n Integration via MCP",
        description: "Verbinde Claude über MCP mit Zapier oder n8n für Zugriff auf 8.000+ Apps. Claude kann dann E-Mails lesen, Kalendereinträge erstellen, CRM-Daten aktualisieren und Slack-Nachrichten senden -- alles autonom aus dem Terminal heraus.",
        command: "# Zapier MCP installieren:\nclaude mcp add zapier\n# Dann authentifizieren und nutzen",
        warning: "Zapier/Pipedream MCPs exponieren sehr viele Tools und verbrauchen massiv Tokens. Nur temporär aktivieren, dann sofort wieder disconnecten!",
      },
      {
        id: "4-3",
        title: "Obsidian als Second Brain verbinden",
        description: "Installiere das Obsidian Skills Plugin. Öffne deinen Obsidian-Vault-Ordner in VS Code und lass Claude das Plugin installieren. Claude kann dann deine Notizen lesen, durchsuchen, zusammenfassen und verknüpfte Markdown-Notizen erstellen. Andrej Karpathy hat damit 100+ Artikel und 400.000 Worte organisiert.",
        command: "# Obsidian Plugin installieren:\n# github.com/obsidianmd/obsidian-skills\n# In VS Code den Vault-Ordner öffnen:\ncd ~/ObsidianVault && claude",
        tip: "Verlasse dich nicht nur auf Claudes internes Gedächtnis. Ein lokaler Obsidian-Vault als 'Second Brain' ist zuverlässiger und persistenter.",
      },
      {
        id: "4-4",
        title: "Deep Research mit NotebookLM",
        description: "Installiere das notebooklm-py Python-Paket. Claude sucht im Web, lädt Links in NotebookLM, generiert Mindmaps, Zusammenfassungen oder Audio-Podcasts mit Quellenangaben und lädt die Ergebnisse herunter. Alles automatisiert über das Terminal.",
        command: "# NotebookLM installieren:\npip install notebooklm-py\nnotebooklm login  # Browser-Auth\n\n# Dann Claude nutzen lassen:\n'Recherchiere [Thema], lade die besten 5 Quellen in NotebookLM und erstelle eine Zusammenfassung mit Quellenangaben.'",
      },
      {
        id: "4-5",
        title: "Design-to-Code Pipeline automatisieren",
        description: "Die ultimative Pipeline: Design System in Claude Design erstellt Prototypen → Handoff generiert Code → Hooks testen automatisch → Git pusht → Vercel deployed → Routinen generieren neue Seiten täglich. Du beschreibst nur noch WAS du willst, die Pipeline baut, testet und deployed es automatisch.",
        tip: "Das ist der 'End Game' Workflow. Kombiniere alle vorherigen Level zu einer vollautomatischen Pipeline. Du schreibst nur noch das PRD.",
      },
      {
        id: "4-6",
        title: "Prompt Master für perfekte Prompts",
        description: "Nutze den Prompt Master mit 9 Dimensionen und 12 Frameworks für optimale Prompts. Funktioniert nicht nur für Claude, sondern für 30+ AI-Tools. Besonders wichtig für komplexe PRDs und Design-Briefings.",
        command: "# Prompt Master nutzen:\n# 9 Dimensionen: Rolle, Kontext, Aufgabe, Format,\n# Constraints, Beispiele, Tonfall, Zielgruppe, Output\n# 12 Frameworks: Chain-of-Thought, Few-Shot, etc.",
      },
      {
        id: "4-7",
        title: "Verification Loop (#1 Tipp)",
        description: "Der Gründer von Claude Code sagt: Verification ist DER wichtigste Hebel. Definiere VOR dem Coden wie du verifizierst (Unit-Test, curl, Browser-Check). Setze Acceptance-Kriterien. Implementiere in write→verify→rewind/ship Schleife. Verdoppelt bis verdreifacht die Code-Qualität.",
        command: "# Verification Loop Prompt:\n'Bevor du implementierst:\n1. Definiere wie wir verifizieren (Test/curl/Browser)\n2. Setze Acceptance-Kriterien\n3. Implementiere in write→verify→rewind/ship Schleife\n4. Erst wenn ALLE Kriterien grün: Ship it.'",
        tip: "Kopiere diesen Prompt in deine CLAUDE.md. Ab sofort wird Claude bei JEDEM Feature zuerst die Verification definieren.",
      },
      {
        id: "4-8",
        title: "Worktrees: 3-5 Claudes parallel",
        description: "Größtes Productivity-Unlock: Statt sequentiell zu arbeiten, öffne 3-5 Git-Worktrees und lasse in jedem einen Claude laufen. Shell-Aliases (za/zb/zc) für schnelles Wechseln. Subagents mit 'isolation: worktree' für automatische Parallelisierung.",
        command: "# Worktrees erstellen:\ngit worktree add ../projekt-wt1 main\ngit worktree add ../projekt-wt2 main\ngit worktree add ../projekt-wt3 main\n\n# Shell-Aliases in ~/.zshrc:\nalias za='cd ../projekt-wt1 && claude'\nalias zb='cd ../projekt-wt2 && claude'\nalias zc='cd ../projekt-wt3 && claude'\n\n# Claude mit Worktree starten:\nclaude -w",
        tip: "Dreifache Geschwindigkeit! Während Claude A testet, implementiert Claude B das nächste Feature und Claude C schreibt Docs.",
      },
      {
        id: "4-9",
        title: "Hooks für deterministische Logik",
        description: "Hooks sind extrem mächtig: PostToolUse für Auto-Format nach jedem File-Write, PostCompact für Re-Injection wichtiger Infos, PermissionRequest zu Slack/WhatsApp routen, Stop-Hook zum Anstupsen wenn Claude steckenbleibt. Alles was Claude IMMER tun soll, gehört in Hooks.",
        command: "# .claude/hooks/post-tool-use.sh:\n#!/bin/bash\n# Auto-Format nach jedem File-Write\nif [[ \"$TOOL_NAME\" == \"Write\" || \"$TOOL_NAME\" == \"Edit\" ]]; then\n  prettier --write \"$FILE_PATH\"\nfi\n\n# .claude/hooks/post-compact.sh:\n#!/bin/bash\n# Re-inject kritische Infos nach /compact\ncat .claude/context/critical-rules.md",
        tip: "Hooks sind deterministisch (kein LLM-Aufruf). Sie verbrauchen NULL Tokens und laufen bei JEDEM Trigger.",
      },
      {
        id: "4-10",
        title: "Compounding Engineering (Team-Workflow)",
        description: "Das Team committet eine gemeinsame CLAUDE.md. Jeder Fehler wird sofort hinzugefügt. @.claude in PRs taggen für automatische Learnings. /memory nach jeder Korrektur. Claude wird jede Woche besser — das ist Compounding Engineering.",
        command: "# GitHub Action installieren:\n/install-github-action\n\n# In PRs @.claude taggen für Learnings\n# Nach Korrekturen:\n/memory 'Regel: Immer X statt Y verwenden'\n\n# Team-CLAUDE.md pflegen:\n# Jeder Fehler → sofort dokumentieren",
        tip: "Nach 4 Wochen kennt Claude dein Projekt besser als jeder neue Mitarbeiter. Das ist der echte Compound-Effekt.",
      },
      {
        id: "4-11",
        title: "/voice — Sprach-Coding",
        description: "Sprach-Coding für schnellere Eingabe. Im CLI: /voice und Space halten. Desktop-App hat einen Voice-Button. iOS via Diktat. Besonders effektiv für Architektur-Entscheidungen und lange Beschreibungen wo Tippen zu langsam ist.",
        command: "# Im Terminal:\n/voice\n# Space halten zum Sprechen\n\n# Desktop App:\n# Voice-Button klicken\n\n# iOS:\n# Diktierfunktion nutzen",
        tip: "Sprache ist 3x schneller als Tippen für komplexe Beschreibungen. Perfekt für PRDs und Architektur-Diskussionen.",
      },
    ],
  },
];

export const quickReference = [
  { command: "/init", description: "CLAUDE.md erstellen (Projekt-Gedächtnis)", category: "basics" },
  { command: "/compact", description: "Kontext komprimieren (bei 60% Auslastung)", category: "context" },
  { command: "/clear", description: "Kontext leeren (neue Aufgabe)", category: "context" },
  { command: "/agents", description: "Sub-Agenten verwalten", category: "advanced" },
  { command: "/loop", description: "Lokale Wiederholungsaufgabe starten", category: "advanced" },
  { command: "/schedule", description: "Remote Scheduled Task erstellen", category: "advanced" },
  { command: "/mcp", description: "MCP-Server verwalten", category: "tools" },
  { command: "/manage plugins", description: "Plugin-Marketplace öffnen", category: "tools" },
  { command: "/create_plan", description: "Detaillierten Implementierungsplan erstellen", category: "basics" },
  { command: "Shift+Tab", description: "Zwischen Modi wechseln (Plan/Auto/Accept)", category: "basics" },
  { command: "claude --enable-auto-mode", description: "Auto Mode starten", category: "advanced" },
  { command: "claude --dangerously-skip-permissions", description: "YOLO Mode (nur isolierte Umgebungen!)", category: "advanced" },
  { command: "gh auth login", description: "GitHub CLI authentifizieren", category: "tools" },
  { command: "npx firecrawl-cli login --browser", description: "Firecrawl authentifizieren", category: "tools" },
  { command: "notebooklm login", description: "NotebookLM authentifizieren", category: "tools" },
  { command: "/voice", description: "Sprach-Coding aktivieren (Space halten)", category: "basics" },
  { command: "/go", description: "E2E-Test + /simplify + PR erstellen", category: "advanced" },
  { command: "/simplify", description: "Parallele Qualitätsprüfung des Codes", category: "advanced" },
  { command: "/batch", description: "Migration mit Dutzenden Agents", category: "advanced" },
  { command: "/btw", description: "Side-Query ohne Kontext-Wechsel", category: "advanced" },
  { command: "/focus", description: "Kontext auf bestimmte Dateien einschränken", category: "context" },
  { command: "/memory", description: "Langzeit-Erinnerung speichern", category: "context" },
  { command: "claude -w", description: "Claude in Git-Worktree starten", category: "advanced" },
];

export const topPlugins = [
  { name: "Feature Dev", origin: "Offiziell", type: "Plugin", description: "Strukturierter 7-Phasen-Workflow für neue Features" },
  { name: "Superpowers", origin: "Marketplace", type: "Plugin", description: "TDD + Brainstorming + strukturiertes Debugging" },
  { name: "CLAUDE.md Management", origin: "Offiziell", type: "Plugin", description: "Automatische CLAUDE.md Aktualisierung" },
  { name: "Trail of Bits", origin: "Marketplace", type: "Plugin", description: "Professionelle Security-Audits" },
  { name: "Excalidraw Diagram", origin: "Community", type: "Skill", description: "Diagramme und Flowcharts als PNG" },
  { name: "Context7", origin: "Community", type: "Skill/CLI", description: "Aktuelle API-Docs im Kontext (statt MCP!)" },
  { name: "Firecrawl", origin: "Community", type: "Skill/CLI", description: "Web-Scraping als LLM-ready Markdown" },
  { name: "Playwright", origin: "Offiziell", type: "CLI", description: "Browser-Steuerung und DOM-Analyse" },
  { name: "NotebookLM", origin: "Community", type: "Python", description: "Deep Research mit Quellenangaben" },
  { name: "Obsidian Skills", origin: "Community", type: "Plugin", description: "Second Brain Integration" },
];

export interface AcademyCourse {
  id: string;
  title: string;
  url: string;
  duration: string;
  lectures: number;
  level: string;
  description: string;
  learnings: string[];
  isFree: boolean;
}

export const academyCourses: AcademyCourse[] = [
  {
    id: "fluency",
    title: "AI Fluency: Framework & Foundations",
    url: "https://anthropic.skilljar.com/ai-fluency-framework-foundations",
    duration: "1.1 Stunden",
    lectures: 14,
    level: "Alle Level",
    description: "Das 4D Framework: Delegation, Description, Discernment, Diligence. Grundlage für effektive AI-Zusammenarbeit.",
    learnings: [
      "Generative AI Systeme verstehen",
      "Das 4D Framework als strukturierter Ansatz",
      "Systematische Projektplanung mit AI",
      "Prompt Engineering Grundlagen",
      "Output-Evaluation und kritisches Denken",
      "Verantwortungsvoller AI-Einsatz",
    ],
    isFree: true,
  },
  {
    id: "code-101",
    title: "Claude Code 101",
    url: "https://anthropic.skilljar.com/claude-code-101",
    duration: "1.5 Stunden",
    lectures: 12,
    level: "Einsteiger",
    description: "Von der Installation bis zum täglichen Workflow. Der Agentic Loop: Kontext sammeln → Aktion ausführen → Ergebnis verifizieren.",
    learnings: [
      "Was ein AI Coding Agent von Chat unterscheidet",
      "Der Agentic Loop verstehen",
      "Installation (Terminal, VS Code, JetBrains, Desktop, Web)",
      "Approval Mode, Auto-Accept, Plan Mode",
      "Explore → Plan → Code → Commit Rhythmus",
      "/compact, /clear, /context Befehle",
      "CLAUDE.md für Projekt-Konventionen",
      "Custom Subagents und Skills bauen",
      "MCP-Server verbinden",
      "Hooks schreiben (deterministische Guardrails)",
    ],
    isFree: true,
  },
  {
    id: "code-action",
    title: "Claude Code in Action",
    url: "https://anthropic.skilljar.com/claude-code-in-action",
    duration: "1 Stunde",
    lectures: 15,
    level: "Fortgeschritten",
    description: "Fortgeschrittene Workflows: Context Management, MCP-Server, GitHub-Integration, Hooks und Custom Commands.",
    learnings: [
      "Core Tools für File-Manipulation und Code-Analyse",
      "Context mit /init, CLAUDE.md und @ Mentions managen",
      "Hotkeys und Commands für Conversation Flow",
      "Plan Mode und Thinking Mode für komplexe Tasks",
      "Custom Commands für repetitive Workflows",
      "MCP-Server für Browser-Automation",
      "GitHub-Integration für automatisierte PR-Reviews",
      "Hooks für zusätzliches Verhalten",
    ],
    isFree: true,
  },
  {
    id: "subagents",
    title: "Introduction to Subagents",
    url: "https://anthropic.skilljar.com/introduction-to-subagents",
    duration: "~45 Min",
    lectures: 4,
    level: "Fortgeschritten",
    description: "Sub-Agents delegieren Tasks an isolierte Assistenten. Hält das Hauptfenster sauber und fokussiert.",
    learnings: [
      "Was passiert wenn Claude Code ein separates Context Window startet",
      "Inputs und Summaries Flow verstehen",
      "/agents Command nutzen",
      "Sub-Agents für Code-Reviews und Docs bauen",
      "Structured Output Formats",
      "Obstacle Reporting und Tool-Access limitieren",
      "Wann Sub-Agents nutzen (und wann nicht)",
    ],
    isFree: true,
  },
  {
    id: "skills",
    title: "Introduction to Agent Skills",
    url: "https://anthropic.skilljar.com/introduction-to-agent-skills",
    duration: "~45 Min",
    lectures: 6,
    level: "Fortgeschritten",
    description: "Skills = wiederverwendbare Markdown-Anweisungen, die Claude automatisch zum richtigen Zeitpunkt anwendet.",
    learnings: [
      "Skills vs. CLAUDE.md vs. Hooks vs. Subagents",
      "SKILL.md Frontmatter mit effektiven Descriptions",
      "Skill-Verzeichnis mit Progressive Disclosure organisieren",
      "allowed-tools für Tool-Access-Beschränkung",
      "Scripts die ohne Context-Verbrauch ausführen",
      "Skills über Plugins und Enterprise Settings teilen",
      "Skills in Custom Subagents verdrahten",
    ],
    isFree: true,
  },
  {
    id: "cowork",
    title: "Introduction to Claude Cowork",
    url: "https://anthropic.skilljar.com/introduction-to-claude-cowork",
    duration: "~1 Stunde",
    lectures: 10,
    level: "Fortgeschritten",
    description: "Cowork = Claude arbeitet direkt mit deinen Dateien. Task Loop, Plugins, Scheduled Tasks und Research at Scale.",
    learnings: [
      "Cowork vs. Chat verstehen",
      "Den Task Loop beherrschen",
      "Kontext richtig geben",
      "Plugins: Cowork als Spezialist",
      "Scheduled Tasks einrichten",
      "File & Document Tasks",
      "Research & Analysis at Scale",
      "Permissions und Model-Wahl",
    ],
    isFree: true,
  },
  {
    id: "mcp-intro",
    title: "Introduction to Model Context Protocol",
    url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
    duration: "1 Stunde",
    lectures: 16,
    level: "Fortgeschritten",
    description: "MCP-Server und Clients von Grund auf bauen mit Python. Die drei Primitives: Tools, Resources, Prompts.",
    learnings: [
      "MCP-Architektur und Client-Server Kommunikation",
      "MCP-Server mit Tools bauen (Python SDK)",
      "MCP-Clients implementieren",
      "Resources für Daten-Zugriff",
      "Prompts für vordefinierte Workflows",
      "MCP Inspector zum Testen",
      "Control Patterns: Tools vs. Resources vs. Prompts",
    ],
    isFree: true,
  },
  {
    id: "mcp-advanced",
    title: "MCP: Advanced Topics",
    url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics",
    duration: "~1 Stunde",
    lectures: 8,
    level: "Experte",
    description: "Sampling, Notifications, File System Access und Transport-Mechanismen für Production MCP Server.",
    learnings: [
      "Sampling für AI-gesteuerte Entscheidungen",
      "Notification-Patterns",
      "File System Access sicher implementieren",
      "Transport-Mechanismen (stdio, SSE, HTTP)",
      "Production-Ready MCP Server Patterns",
    ],
    isFree: true,
  },
];
