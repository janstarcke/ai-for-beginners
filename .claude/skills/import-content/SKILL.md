---
name: import-content
description: Use this skill when the user provides a URL, YouTube link, PDF path, or pasted text containing Claude Code / Vibe Coding content for the knowledge base. Trigger phrases (deutsch & englisch) include "neuer link", "schau dir das an", "importiere", "in die Seite einbauen", "kannst du das einpflegen", "any new from this", or simply a bare URL pasted into the chat. The skill executes the 6-step content-integration pipeline (fetch → analyze → assess → format → integrate → verify) and is autonomous for clear-cut, low-volume cases (1–3 new skills). It switches to dry-run mode (show summary, wait for confirmation) for higher-volume or ambiguous cases (5+ new skills, unsure tier, near-duplicates, new category). After successful integration the skill commits and pushes to main; Coolify deploys automatically.
---

# Content-Import Pipeline

Du integrierst neuen Content (Blog-Posts, YouTube-Transkripte, PDFs, Pastes) in die AI-for-Beginners-Wissensdatenbank. Das Verhalten ist **kontext-abhängig**:

- **Direct-Mode** (autonom durchziehen): 1–3 neue Skills, alle eindeutig Tier 1–2, keine Near-Duplikate, User hat explizit „pflege alles ein" gesagt → kein Trockenlauf, direkt einbauen + committen + pushen.
- **Dry-Run-Mode** (Summary zeigen, Bestätigung holen): 5+ neue Skills, oder Unsicherheit bei Tier / Kategorie / Extend-vs-New, oder neue Kategorie nötig → Summary an User, wait for go, dann einbauen.
- **Mittel-Volumen (4 Skills):** Heuristik anwenden — wenn klar, durchziehen; wenn auch nur ein Tipp wackelt, Dry-Run.

Diese Skill-Datei integriert Manus' Original-Anleitung (`CONTENT-INTEGRATION-ANLEITUNG.md`) **plus** Manus' Folge-FAQ vom 2026-05-12. Wo die beiden Quellen sich widersprechen oder die Anleitung gegen den aktuellen Code veraltet ist (z.B. Skill-Zähler), folgt der Skill der jeweils aktuelleren Quelle.

## Sofort-Aktionen beim Skill-Trigger

1. **Mode-Announcement (1 Satz):** „🧠 Modus-Empfehlung: Hoch reicht — Content-Import."
2. **TodoWrite mit den 6 Pipeline-Steps** anlegen, ersten in_progress.
3. Pipeline starten.

## Source-Type-Detection

| Quelle | Erkennen an | Fetch-Strategie |
|---|---|---|
| Blog/Article-URL | `http(s)://...` ohne `youtube.com\|youtu.be` | **WebFetch** mit Prompt „Extrahiere alle konkreten Tipps, Commands, Workflows und Best Practices für Claude Code. Liste jeden einzeln auf mit Titel + 1–2-Satz-Beschreibung + Command/Code falls vorhanden." |
| YouTube-Video | `youtube.com/watch?v=...` oder `youtu.be/...` | **yt-dlp Captions** (siehe unten) → falls keine Captions → Whisper (falls installiert) → falls beides nicht → User-Workaround |
| PDF lokal | Pfad endet auf `.pdf` | **Read-Tool** (Claude Code kann PDFs direkt lesen) |
| Markdown/Text lokal | Pfad endet auf `.md`, `.txt` | **Read-Tool** |
| Direkter Paste | User klebt Text in den Chat | Use the text directly |

Falls Fetch unter 200 Zeilen / 5 KB Content liefert → vermutlich JS-rendered Seite. User fragen ob er den Text direkt pasten kann.

### YouTube-Pipeline (konkret)

**1. Versuche Captions zuerst** (zero-cost, 95% der Fälle erfolgreich):

```bash
# Check ob yt-dlp installiert
which yt-dlp || python3 -c "import yt_dlp" 2>/dev/null

# Falls nicht installiert: einmalig
python3 -m pip install --user yt-dlp

# Auto-generierte Untertitel ziehen (deutsch + englisch, kein Video-Download)
yt-dlp --write-auto-sub --sub-lang de,en --skip-download \
  -o "/tmp/yt-%(id)s" "<URL>"

# .vtt-Datei zu reinem Text (Timestamps + leere Zeilen raus, dedupliziert)
sed '/^$/d; /^[0-9]/d; /-->/d' /tmp/yt-*.vtt | sort -u > /tmp/transkript.txt
```

**2. Falls keine Captions** (Video ohne Untertitel, selten): Whisper-Fallback nur wenn lokal installiert. Sonst Skip zu Schritt 3.

```bash
which whisper
# Falls vorhanden:
yt-dlp -x --audio-format mp3 -o "/tmp/yt-audio.mp3" "<URL>"
whisper /tmp/yt-audio.mp3 --language de --model small --output_format txt
```

**3. Letzter Fallback — User-Workaround**:
> „Das Video hat keine Captions und Whisper ist nicht installiert. Bitte öffne das Video → drei Punkte → ‚Transkript anzeigen' → Copy/Paste in den Chat. Oder: gib mir den Inhalt als Bullet-Liste."

### Analyse-Prompt für lange Transkripte

Bei Transkripten >3000 Wörter dieses Prompt-Pattern nutzen (interner Sub-Agent oder lokaler Read+Analyze):

```
Analysiere dieses Transkript und extrahiere ALLE konkreten, actionable Tipps
für Claude Code / Vibe Coding.

Für jeden Tipp:
1. Titel (max 5 Wörter)
2. Was genau ist der Tipp? (1-2 Sätze)
3. Konkreter Command/Code (falls vorhanden)
4. Kategorie: Best Practice | Workflow | Plugin | MCP | Tool | Setup | Skill | Kosten-Hack
5. Geschätzter Aufwand: Sofort | 5 Min Setup | 30+ Min Setup

Ignoriere: Smalltalk, Werbung, allgemeine Aussagen ohne konkreten Workflow.
```

## Step 1 — Fetch & Analyze

Quelle laden (Tabelle oben), dann **actionable Tipps** extrahieren. Jeden Tipp innerlich in dieses Schema zerlegen (musst du nicht ausschreiben — nutze es als Filter):

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
| Bestehender Skill deckt das Thema teilweise ab, dein Tipp ergänzt um konkrete Substanz | **EXTEND** — siehe Step 4 für das Rewrite-Pattern |
| Kein Treffer auf Kern-Begriffe | **NEW** — neuer Skill |
| Tipp ist 50/50 zwischen EXTEND und NEW | **ASK USER** (Ambiguity-Gate B) |

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
- Struktur idealerweise: **Kontext → Problem → Lösung → Konkret**
  - Satz 1: Was ist es + Nutzen (quantifiziert wenn möglich)
  - Satz 2: Wie funktioniert es konkret
  - Satz 3 (optional): Beispiel/Workflow oder Konkretisierung
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

### Übersetzungs-Stil für englische Quellen — Germanisieren, NICHT übersetzen

Wenn die Quelle englisch ist: NIE wörtlich übersetzen. Stattdessen im Stil bestehender Skills neu formulieren.

| Aspekt | Regel | Beispiel |
|--------|-------|----------|
| Technische Begriffe | Englisch beibehalten | Worktree, Verification Loop, Sub-Agent, Plan Mode, MCP |
| Erklärungen | Deutsch, Du-Ansprache | „Starte jede Session mit..." |
| Commands | Original beibehalten | `/compact`, `git worktree add`, `claude config` |
| Satzlänge | Max 20 Wörter pro Satz | Kurz. Prägnant. Konkret. |
| Tonalität | Direkt, imperativ | „Kopiere...", „Aktiviere...", „Nutze..." |

**Transformations-Beispiel:**

> **EN-Quelle:** „You should always start in plan mode before writing any code. This allows Claude to think through the architecture before committing to implementation details."

> **Germanisierte Version:** „JEDE Session in Plan Mode starten. Shift+Tab 2× drücken, Plan iterieren bis er solid ist, dann erst Auto-Accept aktivieren. Spart massiv Tokens durch weniger Trial-and-Error."

Was sich ändert: „You should" → Imperativ, konkreter Shortcut hinzugefügt, quantifizierbarer Nutzen ergänzt, passive Formulierung → aktive Handlungsanweisung.

### Skill-Objekt-Schema:

```typescript
{
  id: <nächste freie Nummer>,    // Höchste id in skills.ts + 1. NIEMALS Lücke füllen.
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

### EXTEND-Pattern — Neuschreiben, NICHT anhängen

Wenn EXTEND aus Step 2 gewählt: Bestehende `description` lesen, dann **kompletten neuen `description`-String formulieren** mit altem Kern + neuen Details, Gesamtlänge bleibt bei 2–4 Sätzen.

**Niemals den alten Text einfach hinten verlängern.** Stattdessen Struktur neu denken: was war die alte Aussage, was kommt hinzu, wie liest sich das zusammen flüssig?

**Beispiel-Diff (echtes Beispiel aus der History):**

```typescript
// Vorher:
description: "/clear für neue Tasks, /compact bei 60% Auslastung. CLAUDE.md pflegen."

// Nachher (nach Ergänzung durch neue Quelle):
description: "Das wichtigste Konzept überhaupt. Ohne Kontext-Hygiene halluziniert die KI, vergisst Anweisungen und verbrennt Tokens. /clear für neue Tasks (sauberer Reset), /compact bei 60% Auslastung (lossy Summary). CLAUDE.md pflegen mit max 80 Zeilen für projektspezifische Regeln."
```

Was hier passierte:
- Einleitender Kontext-Satz hinzugefügt
- Begründung ergänzt (halluziniert, vergisst, verbrennt)
- Klammern mit Zusatzinfo eingefügt (sauberer Reset, lossy Summary)
- Konkreter Richtwert ergänzt (max 80 Zeilen)
- Gesamtstruktur: Kontext → Problem → Lösung → Konkret

**Wann NICHT extenden — stattdessen separater neuer Skill:**
- Wenn der bestehende `description` bereits 4 Sätze hat und keinen Spielraum zum Verdichten lässt
- Wenn die neue Info ein eigenständiger Tipp ist (eigener Use-Case, eigene Voraussetzungen, eigener Workflow)

**`nextStep` nur ändern wenn der neue konkreter/besser ist. ID und `name` NIEMALS ändern (bricht Progress-Tracking).**

## Step 5 — Integrate

### Skills

- File: `client/src/data/skills.ts`
- Einfüge-Position für NEW: am Ende des `skills` Arrays, **vor** der schließenden `];`
- Für EXTEND: in-place edit der bestehenden Skill-`description`
- Edit-Tool mit klarem Vor-/Nach-String aus 2–3 Zeilen Kontext

### TL;DR-Items — Hard Cap 15, mit Rotation

File: `client/src/data/skills.ts` → `tldrItems` Array am Ende.

**Hard Cap:** Maximal 15 Items im Array. Aktuell sind ~13 drin (Stand Mai 2026).

**Position-Konvention im Array:**
- Position 0–4: Absolute Must-Haves (Verification Loop, Kontext-Hygiene, Worktrees, Plan Mode, Sub-Agents)
- Position 5–9: Wichtige Produktivitäts-Booster
- Position 10–14: Gute Tipps die den Unterschied machen

**Rotations-Algorithmus** (bei jedem TL;DR-Kandidaten anwenden):

1. Bewerte den neuen Kandidaten auf 1–10:
   - Hat konkreten, kopierbaren Command? **+3**
   - Für JEDEN Claude-Code-Nutzer relevant? **+3**
   - Spart messbar Zeit/Tokens? **+2**
   - In < 1 Minute umsetzbar? **+2**
2. Wenn Array < 15 Items: einfach am Ende anhängen
3. Wenn Array = 15: bewerte alle bestehenden mit gleichem Schema, finde das schwächste
4. Wenn neuer Kandidat > schwächstes bestehendes → **ersetzen** (der ersetzte Skill bleibt im Haupt-Array, fliegt nur aus dem TL;DR)
5. Wenn neuer Kandidat ≤ schwächstes → **nicht aufnehmen**

**Default-Verhalten:** Konservativ. Max **1 neuer TL;DR-Eintrag pro Quelle**. Wenn unsicher ob ein Tipp TL;DR-würdig ist → nicht ins TL;DR. User kann später nachfordern.

```typescript
{
  summary: "Ein-Satz-Kernaussage.",
  example: `# Multi-Line OK mit Template-Literals\nfoo bar\nbaz`,
}
```

### Guide-Steps

File: `client/src/data/guide.ts`. Nur ergänzen wenn ein **komplett neues Konzept** für ein Level relevant ist. Kleine Tipps gehören in Skills, nicht in den Guide. **Default beim Content-Import: keine Guide-Änderung.**

### Skill-Zähler

Wird automatisch via `skills.length` an allen 4 relevanten Stellen in `Home.tsx` berechnet — **nichts manuell anzupassen**. (Manus' Original-Anleitung Schritt 6.5 und FAQ-Punkt 5 sprachen noch von hardcoded-Strings; der aktuelle Code ist bereits dynamisch.)

### Neue Seiten

Nur wenn >10 zusammenhängende Tipps zu einem komplett neuen Thema vorliegen. Beim Content-Import praktisch nie der Fall. Falls doch → **ASK USER** vorher.

## Step 6 — Verify

Reihenfolge strikt:

```bash
cd ~/Desktop/ai-for-beginners
pnpm check                 # TypeScript-Check, muss grün
```

Bei Fehler:
- **1. Versuch:** in-place reparieren (häufige Ursachen: fehlendes Komma, falscher Quote, fehlendes Pflichtfeld). Erneut `pnpm check`.
- **2. Fehlversuch:** **Ambiguity-Gate C** — Diff zeigen, Fehler-Output zeigen, User fragen.

Optional aber empfohlen (vor allem bei größeren Imports):
```bash
pnpm build                 # Production-Build smoke (~1.6s)
```

Falls Build hängt > 30s: irgendwas ist weird. Output ansehen, ggf. abbrechen, User informieren.

## Step 7 — Pre-Commit-Flow (Direct vs. Dry-Run)

### Entscheidungsbaum: Direct oder Dry-Run?

```
Anzahl neuer/erweiterter Skills nach Step 3?
├─ 1–3, alle eindeutig Tier 1–2, keine Near-Duplikate → DIRECT
├─ 4 → Mittel: Heuristik (klar → DIRECT, irgendwo unsicher → DRY-RUN)
└─ 5+, ODER Unsicherheit (Tier, Kategorie, Extend-vs-New), ODER neue Kategorie → DRY-RUN
```

### Direct-Mode (autonom)

Wenn `pnpm check` grün:

```bash
git add client/src/data/skills.ts client/src/data/guide.ts
git commit -m "feat(content): <Kurz-Zusammenfassung>

<N> neue Skill(s): #<id1>, #<id2>
<M> Skill(s) erweitert: #<id3> (<1-Satz was ergänzt>)
<K> Duplikate übersprungen
<L> Tipps Relevanz-Filter nicht bestanden

Quelle: <URL oder neutrale Bezeichnung>"
git push
```

Final-Report (siehe unten) ausgeben. Fertig.

### Dry-Run-Mode (semi-autonom)

Vor jedem File-Edit: dem User die Bilanz zeigen und Bestätigung holen.

```
Ich habe folgendes gefunden:

📊 Bilanz aus <Quelle>:
  • Gefunden: 12 Tipps
  • Duplikate (Skip): 7 (Skills #2, #5, #8, #12, #18, #34, #41)
  • Relevanz nicht bestanden: 0
  • Neue Skills (Plan): 4
    - #54 "ultrathink — Deep Reasoning" (Best Practice, Tier 1)
    - #55 "caveman mode" (Kosten-Hack, Tier 1)
    - #56 "/lesson Command für Compounding" (Workflow, Tier 2)
    - #57 "Higgsfield MCP für Marketing" (MCP, Tier 4)
  • Erweitert (Plan): 1
    - #18 Plan Mode → ergänze /plan acceptpermissions
  • TL;DR-Kandidat: 1 (#54 ultrathink, Score 8/10 — würde Item X ersetzen)

Soll ich alle 4+1 einpflegen? Oder filtern (z.B. „nur #54, #55")?
```

User bestätigt oder filtert. Skill setzt um, läuft `pnpm check`, **fragt dann ein zweites Mal** vor Commit:

```
✅ Eingepflegt + pnpm check grün.
  • Skills #54-#57 hinzugefügt
  • Skill #18 description neu formuliert
Commit + Push? (Forward-Fix möglich für Korrekturen)
```

User sagt „ja" → commit + push. User sagt „nein, ändere X" → Forward-Fix (siehe unten), dann erneut fragen.

### Forward-Fix-Pattern (statt revert)

Wenn nach Einbau ein Fehler auffällt:

```
TypeScript-Fehler        → sofort fixen, dann committen
Inhaltlicher Fehler      → description korrigieren, dann committen
„Skill X ist falsch"     → warning: "..." + Tier 4 setzen, dann committen
Skill ist faktisch falsch → nur description neu schreiben, id/name bleiben
Alles kaputt             → git stash, von vorne anfangen (Notlösung)
```

**Nie `git revert HEAD` als Reflex.** Immer erst forward-fix probieren.

### Commit-Message-Format

```
feat(content): <Kurz-Zusammenfassung>

<N> neue Skill(s): #<id1>, #<id2>
<M> Skill(s) erweitert: #<id3>: <1-Satz was ergänzt>
<K> Duplikate übersprungen (Skills #<ids>)
Tier-Verteilung: <Tier1>×T1, <Tier2>×T2, <Tier3>×T3, <Tier4>×T4

Quelle: <URL oder neutrale Bezeichnung>
```

**Wichtig:** Auch im Commit **keine Personenreferenzen**. „Blog-Post zu X" statt „Boris Cherny Tutorial". Quellen-URL im Body OK (Git-History ist intern).

## Ambiguity Gates (wann USER fragen)

Drei klar definierte Punkte, an denen auch im Direct-Mode unterbrochen wird:

**A) Zero new insights**

Wenn nach Step 3 weder NEW noch EXTEND übrig sind:
> „Die Quelle deckt nur Inhalte ab, die bereits in der Wissensdatenbank stehen. Skills #X, #Y, #Z decken alle Tipps ab. Soll ich's trotzdem irgendwo aufnehmen, oder verwerfen?"

**B) Extend vs New ist 50/50**

Wenn ein Tipp inhaltlich nah an einem bestehenden Skill ist, aber genug Substanz hat, dass ein eigener Skill auch legitim wäre:
> „Tipp X liegt zwischen Skill #18 (extend) und einem neuen Skill (new). Beide wären OK. Soll ich:
> (a) Skill #18 erweitern mit Y
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
  • Neue Skills: <M> (#<ids>)
  • Erweitert: <X> (#<id>: <1-Satz-was-ergänzt>)
  • TL;DR-Items: <Y> (nur falls >0, mit Score und was ersetzt wurde)
  • Tier-Verteilung: <Tier1>×T1, <Tier2>×T2, ...

Validation:
  • pnpm check: ✅
  • Commit: <sha7> "feat(content): ..."
  • Push: ✅ → Coolify deployt (~2 Min)

Live-Check (~3 Min nach Push):
  curl -sI https://ai-for-beginners.starcke.io/ | head -1
```

Bei Fehlschlag/Abbruch: ❌ statt ✅ + 1-Zeilen-Erklärung was als nächstes nötig.

## Hard Don'ts

- ❌ **Niemals** Quellen-Refs in `description` / `nextStep` (kein „im Video", „laut Boris", „Anthropic schreibt")
- ❌ **Niemals** `sources: ["something"]` — immer leer
- ❌ **Niemals** Skill löschen — bricht Progress-Tracking (`localStorage` speichert `progress-skill-54: true`; ID-Recycling würde falschen Progress geben). Bei „veraltet": `warning: "Veraltet seit <Monat/Jahr>. Alternative: Skill #X"` + Tier 4. Bei „weg damit auf Nutzerwunsch": `warning: "Entfernt auf Nutzerwunsch. Nicht mehr relevant."` + Tier 4, **description bleibt für Kontext erhalten**.
- ❌ **Niemals** IDs wiederverwenden — alte IDs bleiben dauerhaft frei
- ❌ **Niemals** ID oder `name` eines bestehenden Skills ändern (bricht Progress + URLs)
- ❌ **Niemals** Personen-Namen im Skill-Text
- ❌ **Niemals** Code aus dem `_archive/`-Ordner ins Repo committen
- ❌ **Niemals** Manus erwähnen (gilt fürs ganze Projekt — siehe `feedback_no_manus_traces_in_public_repos.md` im Memory)
- ❌ **Niemals** `git revert HEAD` als Reflex — immer erst forward-fix probieren

## Quality-Recovery — die 4 Korrektur-Fälle

| Fall | Vorgehen |
|---|---|
| **Faktisch falsch** (description stimmt nicht) | description neu schreiben, id + name + isNew + tier bleiben |
| **Veraltet** (funktioniert nicht mehr) | `warning: "Veraltet seit <Monat/Jahr>. Alternative: Skill #X"` + tier 4. Name + id + description bleiben |
| **User: „weg damit"** | `warning: "Entfernt auf Nutzerwunsch. Nicht mehr relevant."` + tier 4. Alles andere bleibt (description als Kontext für andere User) |
| **Strukturfehler** (z.B. tier 1 für was kompliziertes) | tier korrigieren, ggf. category. Sonst nichts |

## 7 goldene Regeln (Manus-Pipeline-FAQ Stand 2026-05-12)

1. **Captions first** — yt-dlp Auto-Subs vor Whisper, Whisper vor User-Workaround
2. **Germanisieren, nicht übersetzen** — neu formulieren im Stil bestehender Skills
3. **Neuschreiben, nicht anhängen** — bei Skill-Erweiterung den ganzen description-Text neu strukturieren
4. **Max 15 TL;DR** — ab 16. Item Rotation mit 1–10-Score-Vergleich
5. **Zähler dynamisch** — `skills.length` automatisch (Manus' alte hardcoded-Empfehlung obsolet, da längst dynamisch)
6. **Niemals IDs löschen oder wiederverwenden** — nur `warning` + Tier 4
7. **Summary vor Commit** — bei 5+ Skills oder Unsicherheit (Dry-Run), bei 1–3 klaren Skills direkt (Direct-Mode)
