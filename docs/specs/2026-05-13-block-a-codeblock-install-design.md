# Block A: CodeBlock + Install-Commands — Design

**Datum:** 2026-05-13
**Quelle:** Wettbewerbsanalyse von Manus (Mai 2026), kritisch gefiltert
**Status:** Approved (autonom, "Block A only")

## Kontext

Manus' Roadmap schlug 6 Features vor; nach Realitätsabgleich mit der Codebase blieben **2 echte Features** im Block-A-Scope. Vier Manus-Vorschläge wurden verworfen oder als bereits erledigt erkannt:

| Feature | Manus | Realität |
|---|---|---|
| Copy-Buttons | „fehlt" | `CopyButton.tsx` existiert global, Home + 4 Pages nutzen ihn |
| Markdown-Export | „fehlt" | `ExportButton.tsx` existiert (Skill-Fortschritt) |
| Newsletter-Opt-In | empfohlen | **Skip** — Scope-Mismatch (persönliche DACH-Lernseite) |
| Upvoting | empfohlen | **Skip** — würde den USP „kuratiertes Ranking" verwässern |
| Submit-Formular | empfohlen | **Skip** — `import-content`-Skill ist überlegene Alternative |
| SEO-Routes | empfohlen | **Vertagt** (Block B), entscheiden wir nach Analytics-Daten |

## Ziele

1. Multi-line Code-Snippets bekommen **Syntax-Highlighting** + integrierten Copy-Button
2. Skills mit konkretem Setup-Befehl bekommen einen **„Installieren"-Button** auf der Karte
3. Keine Architektur-Änderung am Routing oder Backend (bleibt static SPA)
4. Keine neuen Lauffähigkeits-Risiken (keine schweren Libs, kein Build-Time-Plugin)

## Nicht-Ziele

- Globale CopyButton-Migration der 4 lokalen Duplikate in `Guide`/`TokenSpar`/`FinancialAnalyst`/`ClaudeDesign` (separater Refactor-Task, anderer Scope)
- Backend-Integration für Install-Tracking (würde gegen „static SPA" laufen)
- Newsletter / Upvoting / Submit-Form / SEO (siehe oben — bewusst out-of-scope)

## Architektur

### Neue Komponenten

```
client/src/components/
  CodeBlock.tsx           ← NEU: multi-line code mit highlight + copy overlay
  InstallCommandModal.tsx ← NEU: Radix-Dialog mit CodeBlock + Erklärtext
```

### Daten-Schema-Änderung

```ts
// client/src/data/skills.ts
export interface Skill {
  // ...bestehende Felder
  installCommand?: string;   // z.B. 'echo "Be concise" > ~/.claude/CLAUDE.md'
  installNote?: string;      // optionaler Hinweis-Text im Modal
}
```

### Library-Wahl

**`prism-react-renderer` v2** (~10 KB gz):
- Runtime-Highlighting (passt zu unseren dynamischen `code`-Strings)
- React-19-kompatibel
- Tailwind-friendly (eigene Theme-Steuerung)
- Alternativen verworfen: `shiki` zu schwer (~300 KB selbst mit fine-grained imports), `highlight.js` veraltet, eigener Regex-Highlighter zu YAGNI/maintenance-prone

### CodeBlock-Komponente — API

```tsx
<CodeBlock
  code="pnpm install\npnpm dev"
  language="bash"          // default: "bash"
  filename="terminal"      // optional, in Header
/>
```

Visual:
```
┌──────────────────────────────────┐
│ terminal              [📋 Kopieren]│
├──────────────────────────────────┤
│ $ pnpm install                    │
│ $ pnpm dev                        │
└──────────────────────────────────┘
```

- Header zeigt `filename` links + `<CopyButton text={code} />` rechts
- Body: `<Highlight>` von prism-react-renderer mit `bash`/`tsx`/`json`-Sprachen
- Tailwind-Theme: light = sepia-bg, dark = espresso-bg (passt zum Vintage-Look)

### Install-Modal-Komponente — API

```tsx
<InstallCommandModal
  open={open}
  onOpenChange={setOpen}
  skillName="Verification Loop"
  command="echo '...' >> ~/.claude/CLAUDE.md"
  note="Fügt den Master-Prompt zu deiner globalen CLAUDE.md hinzu."
/>
```

- Radix-Dialog (vorhanden via shadcn)
- Header: „📦 Installieren: {skillName}"
- Body: Erklärtext + `<CodeBlock>` + Copy-Button
- Footer: „Schließen"-Button

### Skill-Card-Erweiterung (`Home.tsx`)

```tsx
{skill.installCommand && (
  <button onClick={openModal} className="...">
    📦 Installieren
  </button>
)}
```

Position: neben dem bestehenden `nextStep`-CopyButton, unauffällig (klein, mit Icon).

### Initial-Befüllung von `installCommand`

Geplante 5–8 Skills mit echtem Setup-Befehl (initial; weitere folgen organisch):

- **#43 Cost-Stack** — `claude plugin install cost-stack@...` (falls Plugin existiert)
- **#54 Agent View** — kein installCommand (nur Konzept)
- **#55 Claude Managed Agents** — `cma init` o.ä.
- **#56 Equity Research Plugin** — `claude plugin marketplace add anthropics/financial-services`
- **#62 globale CLAUDE.md** — `mkdir -p ~/.claude && touch ~/.claude/CLAUDE.md`
- **#1 Verification Loop** — `echo "Verification-Loop-Master-Prompt" >> ~/.claude/CLAUDE.md` (illustrativ)

Konkrete Befüllung wird beim Implementieren skill-by-skill entschieden — nur Skills mit echtem 1-Zeiler bekommen die Markierung.

## Refactor-Targets (multi-line Snippets → CodeBlock)

Suchen nach `<pre>`-Tags und multi-line `<code>` in:
- `pages/FinancialAnalyst.tsx` (mind. 3 Stellen mit `mkdir -p Finance-Team/...`)
- `pages/TokenSpar.tsx` (Trick-Beispiele)
- `pages/Guide.tsx` (Step-Befehle)
- `pages/ClaudeDesign.tsx` (Phase-Commands)

Inline-Snippets (`/dcf`, `pnpm dev` etc.) bleiben wie sie sind — kein CodeBlock-Wrapping (overkill).

## Testing

Manuell:
1. `pnpm dev` lokal — Tailwind-Theme im Light- und Dark-Mode visuell prüfen
2. Copy-Button im CodeBlock funktioniert (Klick → Toast/Check-Icon)
3. Install-Modal öffnet aus Skill-Card, schließt sauber
4. `pnpm check` (TypeScript) grün
5. `pnpm build` produziert dist/ ohne Errors
6. Coolify-Deploy (Push → ~3 Min → Live-Check)

Smoke-Live:
- Skill-Karte mit `installCommand` öffnen → Modal sichtbar → kopieren → in Terminal pasten

## Commit-Plan

**Commit 1:** `feat: CodeBlock-Komponente mit Syntax-Highlighting + Copy-Overlay`
- Neue Komponente, Refactor multi-line Snippets in Pages
- `prism-react-renderer` als Dependency

**Commit 2:** `feat: installCommand-Feld + Install-Modal auf Skill-Karten`
- Schema-Erweiterung, Modal-Komponente, Skill-Card-Button
- Initial 5–8 Skills befüllt

Optional **Commit 3** (Bonus): `chore: importHistory-Eintrag für Block A`

Push zu main, Coolify deployt automatisch.

## Risiken & Mitigations

| Risiko | Mitigation |
|---|---|
| `prism-react-renderer` Bundle-Size unerwartet hoch | Vor Commit `pnpm build` Größe checken; falls > +30 KB gz, auf eigenen mini-Highlighter wechseln |
| Sepia-Theme matcht nicht zum Prism-Default-Theme | Custom Theme-Object inline definieren, an Tailwind-Sepia-Tokens orientieren |
| `installCommand` führt User zu Befehl der Schaden anrichtet | Initial nur idempotente, harmlose Befehle befüllen (mkdir, echo, plugin install) — nichts mit `rm` o.ä. |
| Modal-State-Management bei vielen Skill-Karten | Per-Card lokaler `useState` (kein global store nötig — Modal ist Single-Skill) |
