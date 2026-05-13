# Inhalte pflegen & erweitern

Diese Datei erklärt, **wo welcher Content lebt** und **wie du ihn ohne TypeScript-Vorwissen anpasst**. Alle Daten liegen als TypeScript-Konstanten in `client/src/data/` — das gibt dir Compile-Time-Sicherheit (Vite meldet sofort, wenn ein Feld vergessen wurde) und erlaubt mehrzeilige Code-Beispiele mit Template-Literals.

## Schnellster Weg: Content-Import per Link

In Claude Code (innerhalb dieses Repos) genügt es, einen Link oder Pfad reinzukippen:

```
neuer link: https://example.com/some-claude-code-tutorial
```

Claude lädt den Skill `import-content` automatisch (definiert unter `.claude/skills/import-content/SKILL.md`) und arbeitet die 6-Schritte-Pipeline ab: Fetch → Analyze → Duplicate-Check → Relevance-Filter → Format → Integrate → `pnpm check` → Commit → Push. Coolify deployt anschließend ~2 Minuten später.

Bei klaren Fällen läuft das vollautonom. Nur wenn der Skill unsicher ist (Quelle bringt nichts Neues / Extend-vs-New 50/50 / TypeScript-Check failed) fragt er zurück. Manuelle Edits direkt in `client/src/data/` wie unten beschrieben gehen weiterhin.

## Wo lebt was?

| Was du ändern willst                          | Datei                                |
|-----------------------------------------------|--------------------------------------|
| Neue Skill in der Hauptliste hinzufügen       | `client/src/data/skills.ts` → `skills`           |
| TL;DR-Eintrag auf der Startseite              | `client/src/data/skills.ts` → `tldrItems`        |
| Claude-Design 5-Phasen-Schritte               | `client/src/data/skills.ts` → `claudeDesignSteps`|
| Tier-Labels (1–4) oder Kategorien-Filter      | `client/src/data/skills.ts` → `tierLabels` / `categories` |
| Schritte im 4-Level Beginner→Pro Guide        | `client/src/data/guide.ts`  → `guideLevels`      |
| Quick-Reference-Box im Guide                  | `client/src/data/guide.ts`  → `quickReference`   |
| Top-Plugins-Liste                             | `client/src/data/guide.ts`  → `topPlugins`       |
| Anthropic-Academy-Kurse                       | `client/src/data/guide.ts`  → `academyCourses`   |
| Token-Spar-Rechner (Model-Preise etc.)        | `client/src/pages/TokenSpar.tsx`                 |
| Financial-Analyst-Workflow                    | `client/src/pages/FinancialAnalyst.tsx`          |

## Einen neuen Skill hinzufügen

Öffne `client/src/data/skills.ts`, scrolle ans Ende des `skills`-Arrays und füge einen neuen Block ein. **Die nächste freie `id` muss eindeutig sein** (höchste vergebene ID + 1).

```ts
{
  id: 54,                         // muss eindeutig sein
  name: "Neuer Skill-Name",
  category: "Best Practice",      // siehe categories[] für gültige Werte
  tier: 2,                        // 1-4, siehe tierLabels
  tierLabel: "Erste Woche",
  sources: ["quelle.pdf"],        // [] wenn keine Quelle
  description:
    "Was kann der Skill und warum lohnt er sich? 1–3 Sätze.",
  nextStep:
    "Konkrete erste Handlung — was tippt/klickt der User?",
  isNew: true,                    // optional, blendet ein NEW-Badge ein
  warning: "…",                   // optional, gelber Warnhinweis
},
```

Nach dem Speichern: `pnpm check` muss grün sein. Falls rot → Typo im Feldnamen oder fehlendes Pflichtfeld.

## Einen neuen Guide-Step hinzufügen

`client/src/data/guide.ts` → finde das gewünschte `level`-Objekt → `steps`-Array → neuen Block einfügen.

```ts
{
  id: "tier1-12",                 // eindeutig innerhalb des Levels
  title: "Kurzer Titel",
  description:
    "Erklärt was der Schritt macht.",
  command: "claude config set …", // optional, wird als Code-Block gerendert
  tip: "Pro-Tipp",                // optional, blaue Info-Box
  warning: "Vorsicht: …",         // optional, gelbe Warn-Box
  source: "anthropic.com/…",      // optional
},
```

## Eine neue Seite hinzufügen

1. Datei anlegen unter `client/src/pages/MeineSeite.tsx` — orientiere dich an `client/src/pages/TokenSpar.tsx` als Vorlage.
2. Route in `client/src/App.tsx` registrieren:
   ```tsx
   import MeineSeite from "./pages/MeineSeite";
   …
   <Route path={"/meine-seite"} component={MeineSeite} />
   ```
3. Damit Cmd+K-Search die Seite findet: Eintrag in `client/src/components/GlobalSearch.tsx` ergänzen.
4. Optional: Navigation/Link auf Home-Seite einbauen.

## Bilder

Lege `.webp`-Bilder unter `client/public/images/` ab. Referenz im JSX dann als `/images/dateiname.webp` (führender Slash, kein Build-Hash nötig).

## Code-Style

Vor jedem Commit:

```bash
pnpm format     # Prettier
pnpm check      # TypeScript-Check
pnpm build      # Production-Build (muss durchgehen)
```

CI macht dasselbe — wenn lokal grün, ist der PR meist sicher.

## Häufige Fehler

| Symptom                              | Wahrscheinliche Ursache                              |
|--------------------------------------|------------------------------------------------------|
| `pnpm check` meckert über fehlendes Feld | Pflichtfeld im neuen Skill/Step vergessen (z.B. `tierLabel`) |
| Build-Fehler `id … is duplicate`     | Zwei Einträge haben dieselbe `id`                    |
| Bild lädt nicht                      | Datei liegt nicht unter `client/public/images/` ODER falscher Pfad |
| Search findet neue Seite nicht       | GlobalSearch.tsx noch nicht ergänzt                  |
| Theme bricht nach Skill-Add          | Trailing-Komma fehlt zwischen zwei `{}`-Blöcken      |
