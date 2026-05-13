---
name: import-content
description: Use this skill when the user provides a URL, YouTube link, PDF path, or pasted text containing Claude Code / Vibe Coding content for the knowledge base. Trigger phrases (deutsch & englisch) include "neuer link", "schau dir das an", "importiere", "in die Seite einbauen", "kannst du das einpflegen", "any new from this", or simply a bare URL pasted into the chat. The skill executes the 6-step content-integration pipeline (fetch → analyze → assess → format → integrate → verify) and operates autonomously for clear-cut cases. It asks the user only at three ambiguity gates: (a) zero new insights detected, (b) 50/50 between extending an existing skill vs creating a new one, (c) TypeScript check fails twice. After successful integration the skill commits and pushes to main; Coolify deploys automatically.
---

# Content-Import Pipeline

Du integrierst neuen Content (Blog-Posts, YouTube-Transkripte, PDFs, Pastes) in die AI-for-Beginners-Wissensdatenbank. Default-Modus ist **autonom**: fetch → analyze → integrate → commit → push, ohne dazwischenfunken. Nur an drei klar definierten Punkten wird der User gefragt (siehe **Ambiguity Gates** unten).

Diese Skill-Datei ist eine Adaption der Manus-Original-Anleitung an Claude Code (no `manus-speech-to-text`, no `manus-analyze-video` — die existieren hier nicht).

## Sofort-Aktionen beim Skill-Trigger

1. **Mode-Announcement (1 Satz):** „🧠 Modus-Empfehlung: Hoch reicht — Content-Import."
2. **TodoWrite mit den 6 Pipeline-Steps** anlegen, ersten in_progress.
3. Pipeline starten.

## Source-Type-Detection

| Quelle | Erkennen an | Fetch-Strategie |
|---|---|---|
| Blog/Article-URL | `http(s)://...` ohne `youtube.com\|youtu.be` | **WebFetch** mit Prompt „Extrahiere alle konkreten Tipps, Commands, Workflows und Best Practices für Claude Code. Liste jeden einzeln auf mit Titel + Beschreibung + Command/Code falls vorhanden." |
| YouTube-Video | `youtube.com/watch?v=...` oder `youtu.be/...` | **1. Versuch:** `npx --yes youtube-transcript "<URL>"` (falls Node-Bibliothek erreichbar). **Fallback:** User fragen: „Bitte öffne das Video → drei Punkte → ‚Transkript anzeigen' → Copy/Paste in den Chat. Oder: gib mir den Inhalt als Bullet-Liste." |
| PDF lokal | Pfad endet auf `.pdf` | **Read-Tool** (Claude Code kann PDFs direkt lesen) |
| Markdown/Text lokal | Pfad endet auf `.md`, `.txt` | **Read-Tool** |
| Direkter Paste | User klebt Text in den Chat | Use the text directly |

Falls Fetch unter 200 Zeilen / 5 KB Content liefert → vermutlich JS-rendered Seite. User fragen ob er den Text direkt pasten kann.

## Step 1 — Fetch & Analyze

Aus der Quelle alle **actionable Tipps** extrahieren. Jeden Tipp innerlich in dieses Schema zerlegen (musst du nicht ausschreiben — nutze es als Filter):

- **Was:** Was ist der Tipp? (1 Satz)
- **Warum:** Welches Problem löst er?
- **Wie:** Konkreter Command, Workflow, Konfiguration
- **Wann:** In welcher Situation einsetzbar?
- **Aufwand:** Sofort umsetzbar oder Setup nötig?

Verwerfe schon hier:
- Reine Meinung / Hot Take ohne Workflow
- Inhalte die nicht zu Claude Code / Vibe Coding gehören (Allgemein-AI, andere Tools ohne Bezug)
- Werbung für Paid-Tools ohne Free-Tier

## Step 2 — Duplicate-Check (kritisch)

Lies `client/src/data/skills.ts` und `client/src/data/guide.ts` mit dem Read-Tool. Für jeden Tipp grepe nach Kern-Begriffen:

```bash
grep -n "ultrathink\|deep reasoning" client/src/data/skills.ts
grep -n "compact\|context\|clear" client/src/data/skills.ts
grep -n "worktree\|parallel" client/src/data/skills.ts
```

**Entscheidungs-Matrix:**

| Befund | Aktion |
|---|---|
| Exakter Treffer in `description` oder `name` | **SKIP** — Tipp ist bereits vollständig drin |
| Bestehender Skill deckt das Thema teilweise ab, dein Tipp ergänzt um konkrete Substanz (z.B. neuer Command, neue Variante) | **EXTEND** — append 1–2 Sätze an `description` (siehe Format-Regeln) |
| Kein Treffer auf Kern-Begriffe | **NEW** — neuer Skill |
| Tipp ist 50/50 zwischen EXTEND und NEW | **ASK USER** (siehe Ambiguity Gate B) |

## Step 3 — Relevance-Check

Ein Tipp wird **NUR aufgenommen** wenn er **mindestens 2 von 5** Kriterien erfüllt:

1. **Actionable** — konkreter Command/Workflow/Konfigurationsschritt vorhanden
2. **Messbar** — quantifizierter Nutzen („3× schneller", „50% weniger Tokens")
3. **Reproduzierbar** — jeder kann's sofort nachmachen
4. **Aktuell** — funktioniert mit Claude Code Mai 2026+
5. **Universell** — nicht reine Nischen-Lösung für ein OS / eine IDE

Tipps die alle Filter überleben → werden eingebaut. Tipps die ausscheiden → kurz im End-Bericht erwähnen („verworfen: X (nicht actionable)").

## Step 4 — Format

### Kategorie (eine von 10):

| Kategorie | Wann |
|---|---|
| `Best Practice` | Mindset, Workflow-Prinzip, allgemeine Arbeitsweise |
| `Workflow` | Mehrstufiger konkreter Arbeitsablauf |
| `Plugin` | Erweiterung die installiert werden muss |
| `MCP` | MCP-Server / MCP-Integration |
| `Tool` | Externes Tool im Verbund mit Claude Code |
| `Setup` | Einmalige Konfiguration/Installation |
| `Skill` | Übbar/Erlernbar, eher Fähigkeit als Tool |
| `Kosten-Hack` | Spart Tokens, Geld oder API-Calls |
| `Financial Analyst` | Spezifisch Finance-Workflows |

### Tier-Entscheidungsbaum:

```
Ist es in < 1 Minute umsetzbar?
├─ JA → Tier 1 ("Sofort umsetzen")
└─ NEIN → Braucht Installation/Konfiguration?
   ├─ JA → Für jeden relevant?
   │  ├─ JA → Tier 2 ("Innerhalb der ersten Woche")
   │  └─ NEIN → Tier 4 ("Spezialisierte Tools")
   └─ NEIN → Produktivitätsgewinn > 2×?
      ├─ JA → Tier 3 ("Produktivitäts-Booster")
      └─ NEIN → Tier 2
```

### Text-Regeln (HARD):

**`description`** (Pflicht):
- 2–4 Sätze, max ~400 Zeichen
- Satz 1: Was ist es + Nutzen (quantifiziert wenn möglich)
- Satz 2: Wie funktioniert es konkret
- Satz 3 (optional): Beispiel/Workflow
- **KEINE Quellen-Refs** — nie „laut Boris", „im Video", „Anthropic schreibt"
- **KEIN Marketing-Speak** — keine Superlative ohne Beleg
- Du-Ansprache, Imperativ wenn möglich

**`nextStep`** (Pflicht):
- Ein konkreter, sofort ausführbarer Schritt
- Beginnt mit Verb: Kopiere, Erstelle, Aktiviere, Füge ein, Teste
- Idealerweise Command zum Copy-Pasten

**`name`** (Pflicht):
- Max 5–6 Wörter
- Beschreibt Kern
- Technische Begriffe OK

**Englische Quellen → Germanisieren.** 1:1-Übersetzung vermeiden. Stil der bestehenden Skills übernehmen (kurze Sätze, Du-Ansprache, deutsche Fachbegriffe wo etabliert, englische wo Standard wie „Plan Mode", „Worktree", „MCP").

### Skill-Objekt-Schema:

```typescript
{
  id: <nächste freie Nummer>,    // Lies skills.ts, höchste id finden, +1
  name: "...",
  category: "...",               // eine der 10 oben
  tier: 1|2|3|4,
  tierLabel: "...",              // "Sofort umsetzen" | "Innerhalb der ersten Woche" | "Produktivitäts-Booster" | "Spezialisierte Tools"
  sources: [],                   // IMMER leer — keine Quellen-Refs
  description: "...",
  nextStep: "...",
  isNew: true,                   // IMMER für neu importierten Content
  warning: "..."                 // nur wenn berechtigt (Veraltet, Vorsicht)
}
```

### Extend-Pattern (statt New):

Wenn EXTEND aus Step 2 gewählt: Bestehende `description` lesen, neue Substanz **anhängen** mit Punkt-Trenner. **Nicht** umschreiben. `isNew` NICHT setzen (Skill existiert ja). `id` unverändert.

```typescript
// Vorher:
description: "Plan Mode aktivieren mit /plan. Claude erstellt einen Plan vor der Implementation."

// Nachher (extended):
description: "Plan Mode aktivieren mit /plan. Claude erstellt einen Plan vor der Implementation. Mit /plan acceptpermissions werden Tool-Permissions im Plan-Step bestätigt — spart später Bestätigungs-Prompts."
```

## Step 5 — Integrate

**Skills:**
- File: `client/src/data/skills.ts`
- Einfüge-Position für NEW: am Ende des `skills` Arrays, **vor** der schließenden `];`
- Für EXTEND: in-place edit der bestehenden Skill-Objekt-`description`
- Edit-Tool nutzen mit klarem Kontext (vor/nach-String aus 2–3 Zeilen)

**TL;DR-Item** (`tldrItems` am Ende von `skills.ts`): nur hinzufügen wenn der Tipp zu den **Top-15-relevantesten** gehört. Default: KEIN neuer TL;DR-Eintrag, außer der Tipp ist überragend nützlich UND hat ein klar kopierbares Code-Beispiel. Maximal **1 neuer TL;DR pro Quelle**.

```typescript
{
  summary: "Ein-Satz-Kernaussage.",
  example: `# Multi-Line OK mit Template-Literals\nfoo bar\nbaz`,
}
```

**Guide-Steps** (`guide.ts`): nur ergänzen wenn ein **komplett neues Konzept** für ein Level relevant ist. Kleine Tipps gehören in Skills, nicht in den Guide. Default: KEIN Guide-Update beim Content-Import.

**Skill-Zähler:** Wird automatisch via `skills.length` berechnet — **nichts manuell anzupassen**. (Manus' Schritt 6.5 ist obsolet im aktuellen Code.)

**Neue Seiten:** Nur bei >10 zusammenhängenden Tipps zu einem neuen Thema. Im Skill-Import ist das praktisch nie der Fall — wenn doch, ASK USER (Ambiguity Gate C-extension).

## Step 6 — Verify

Reihenfolge strikt:

```bash
cd ~/Desktop/ai-for-beginners
pnpm check                 # TypeScript-Check, muss grün
```

Bei Fehler:
- 1. Versuch: in-place reparieren (häufig: fehlendes Komma, falscher Quote, fehlendes Pflichtfeld). Erneut `pnpm check`.
- 2. Fehlversuch: **ASK USER** (Ambiguity Gate C) — Diff zeigen, Fehler-Output zeigen, fragen ob revert oder Hilfe.

Optional aber empfohlen:
```bash
pnpm build                 # Production-Build smoke (1.5s)
```

Falls Build hängt > 30s: irgendwas ist weird. Output ansehen, ggf. abbrechen, User informieren.

## Step 7 — Commit & Push

**Default-Verhalten (autonom):**

Sobald `pnpm check` grün:

```bash
git add client/src/data/skills.ts client/src/data/guide.ts  # nur Daten-Files, NICHT _archive/
git commit -m "content: <kurze Zusammenfassung>

<N> neue Skill(s) hinzugefügt: #<id1>, #<id2>, ...
<M> bestehende Skill(s) erweitert: #<id3>
<K> Tipps als Duplikat verworfen
<L> Tipps Relevanz-Filter nicht bestanden

Quelle: <URL oder Quellen-Bezeichnung neutral, z.B. 'Blog-Post über Plan Mode'>"
git push
```

**Commit-Message-Regel:** Auch hier **keine Personenreferenzen**. „Blog-Post zu X" statt „Boris Cherny Tutorial". Quellen-URL OK im Commit-Body (Git-History ist intern), aber Skill-Texte bleiben quellenfrei.

## Ambiguity Gates (wann USER fragen)

Nur an diesen drei Punkten unterbrechen. Sonst durchziehen.

**A) Zero new insights**

Wenn nach Step 3 weder NEW noch EXTEND übrig sind. Frage:
> „Die Quelle deckt nur Inhalte ab, die bereits in der Wissensdatenbank stehen. Skills #X, #Y, #Z decken alle Tipps ab. Soll ich's trotzdem irgendwo aufnehmen, oder verwerfen?"

Default falls User „verwerfen": kein Commit. Kurz-Report. Fertig.

**B) Extend vs New ist 50/50**

Wenn ein Tipp inhaltlich nah an einem bestehenden Skill ist, aber genug Substanz hat, dass ein eigener Skill auch legitim wäre. Frage:
> „Tipp X liegt zwischen Skill #18 (extend) und einem neuen Skill (new). Beide wären OK. Soll ich:
> (a) Skill #18 erweitern (description + Y)
> (b) Neuen Skill #<next-id> anlegen
> Empfehlung: <a oder b mit Ein-Satz-Begründung>"

**C) TypeScript-Check fail (2× in Folge)**

Nicht beim 1. Fail — repariere selbst. Erst beim 2. Fail:
> „pnpm check schlägt nach 2 Reparatur-Versuchen fehl. Output:
> <error message>
> Mein letzter Edit:
> <diff>
> Soll ich revert und neu anfangen, oder willst du den Code direkt sehen?"

## Final Report (immer ausgeben)

Nach erfolgreichem Push (oder beim sauberen Abbruch):

```
✅ Content-Import abgeschlossen — <Quelle>

Bilanz:
  • Gefunden: <N> Tipps
  • Duplikate übersprungen: <K> (Skills #<ids>)
  • Relevanz-Filter nicht bestanden: <L> (kurz Gründe)
  • Neue Skills: <M> (#<ids>)  — z.B. „#54 ultrathink, #55 caveman mode"
  • Erweitert: <X> (#<id>: <1-Satz-was-ergänzt>)
  • TL;DR-Items: <Y> (nur falls >0)

Validation:
  • pnpm check: ✅
  • Commit: <sha7> "content: ..."
  • Push: ✅ → Coolify deployt (~2 Min)

Live-Check:
  curl -sI https://ai-for-beginners.starcke.io/ | head -1
```

Wenn ein Punkt fehlgeschlagen ist: ❌ statt ✅ + 1-Zeilen-Erklärung, was als nächstes nötig.

## Hard Don'ts

- ❌ **Niemals** Quellen-Refs in `description` / `nextStep` (kein „im Video", „laut Boris", „Anthropic schreibt")
- ❌ **Niemals** `sources: ["something"]` — immer leer
- ❌ **Niemals** Skill löschen (bricht Progress-Tracking, IDs müssen stabil bleiben). Bei „veraltet": `warning: "Veraltet seit <Monat/Jahr>. Alternative: Skill #X"` + Tier auf 4.
- ❌ **Niemals** IDs wiederverwenden (alte IDs bleiben Lücken, falls Skills mal entfernt würden — bislang nie passiert)
- ❌ **Niemals** Personen-Namen im Skill-Text
- ❌ **Niemals** Code aus dem `_archive/`-Ordner ins Repo committen
- ❌ **Niemals** Manus erwähnen (gilt fürs ganze Projekt — siehe `feedback_no_manus_traces_in_public_repos.md` im Memory)

## Edge-Cases & Defaults für offene Fragen an Manus

Diese Defaults sind aktiv bis Manus klarere Antworten gibt. User-feedback kann sie überschreiben:

| Frage | Default-Verhalten |
|---|---|
| YouTube-Transkript-Extraktion | WebFetch zuerst → bei zu wenig Content fallback auf User-Paste aus YT-UI |
| Englisch → Deutsch | Germanisieren im Stil bestehender Skills (kurz, Du-Ansprache, Imperativ) |
| Extend-Format | Append mit Punkt-Trenner, nicht rewrite |
| TL;DR-Rotation | Append-only, kein aktives Rotieren — User kann manuell ausmisten |
| Quality-Recovery | Skills nie hart löschen, nur `warning:` + Tier 4 |
| Auto-Push vs lokal | Auto-Push direkt (Coolify deployt automatisch) |

Wenn Manus präzisere Antworten liefert, update diese Tabelle und den entsprechenden Pipeline-Step.
