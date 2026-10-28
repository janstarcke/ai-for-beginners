/**
 * KI im Alltag — Consumer-KI-Themen für absolute Einsteiger.
 *
 * Bewusst getrennt von `skills.ts`: Dort leben Claude-Code- und Vibe-Coding-
 * Skills (zeitlos, ohne Datum, ohne Quellenangabe). Hier leben Alltags-Themen
 * rund um ChatGPT, Gemini und die Claude-Apps — datiert, mit Quelle, und für
 * Leser ohne Entwickler-Hintergrund.
 *
 * Die Rubrik wurde am 02.10.2026 zurückgebaut (PR #73) und am 26.10.2026
 * wieder eingeführt — diesmal mit der Auswahlregel (Regel 5), deren Fehlen
 * damals der dokumentierte Grund für die Abwicklung war.
 *
 * Redaktionsregeln für diese Datei:
 * 1. `kind: "news"` bekommt IMMER ein Datum und mindestens eine Quelle mit URL.
 *    Keine Quelle verifizierbar → das Thema wird nicht als News geführt.
 * 2. `kind: "fundus"` (zeitlose Prompt-Idee) und `kind: "praxis"` (allgemeine
 *    Technik) tragen kein Datum und werden nie als Neuigkeit dargestellt.
 * 3. Fehlt eine belastbare Quelle — oder trägt die vorhandene nur eingeschränkt
 *    (veraltet, anderes Publikum, andere Modellgeneration) — steht das als
 *    `unverified`-Hinweis sichtbar auf der Karte. Es werden keine Quellen
 *    erfunden und keine leeren Platzhalter veröffentlicht.
 * 4. Prompts stehen in `prompt` und werden als kopierfertiger Codeblock
 *    gerendert — nie als Fließtext.
 * 5. AUSWAHLREGEL (Relaunch 26.10.2026): Jede Karte dient einem von drei
 *    Zwecken — News (datiert, mit Quelle), Praxis/Fundus (zeitlose Technik)
 *    oder Vergleich/Einstiegs-Guide (mit Stand-Datum; wird bei Neuauflage
 *    AKTUALISIERT statt dupliziert). Reine Tages-Trends (Foto-Hypes u. ä.)
 *    kommen nur herein, wenn sie eine Technik oder einen Mythos erklären.
 *    Claude-Code-Inhalte gehören in `skills.ts`, nicht hierher.
 * 6. WIEDERKEHR-TEST: Bringt die Karte einem Einsteiger in zwei Wochen noch
 *    etwas? Wenn nein, wird sie nicht aufgenommen — sie bleibt Inhalt der
 *    Tages-Recherche im Chat.
 * 7. ALTERN: News-Karten werden bei jedem Rubrik-Update geprüft. Veraltetes
 *    wird aktualisiert oder entfernt — kein stilles Vergammeln.
 */

export type KiAlltagKind = "news" | "fundus" | "praxis";

export type KiAlltagTool = "ChatGPT" | "Gemini" | "Claude" | "Allgemein";

export interface KiAlltagSource {
  /** Anzeigename, z.B. "OpenAI Release Notes". */
  label: string;
  /** Vollständige URL. Pflicht bei kind === "news". */
  url: string;
}

export interface KiAlltagTable {
  head: string[];
  rows: string[][];
}

export interface KiAlltagItem {
  id: number;
  title: string;
  kind: KiAlltagKind;
  tool: KiAlltagTool;
  /** ISO-Datum für Sortierung. Nur bei kind === "news". */
  date?: string;
  /** Deutsche Anzeige des Datums, z.B. "10.09.2026". */
  dateLabel?: string;
  /** Was ist es? 2–4 Sätze, Einsteiger-Sprache. */
  what: string;
  /** Warum ist das für Einsteiger nützlich? */
  why: string;
  /** Optional: nummerierte Anleitung. */
  steps?: string[];
  /** Optional: kopierfertige Prompt-Vorlage. */
  prompt?: string;
  /** Optional: Überschrift über dem Prompt-Block. */
  promptLabel?: string;
  /** Optional: Tabelle (z.B. Steuerwort → Wirkung). */
  table?: KiAlltagTable;
  /** Optional: Einschränkung, Region, Voraussetzung. */
  note?: string;
  /** Optional: sichtbarer Hinweis auf fehlende oder nur eingeschränkt tragende Quelle. */
  unverified?: string;
  sources: KiAlltagSource[];
}

export const kindLabels: Record<KiAlltagKind, { label: string; hint: string }> =
  {
    news: {
      label: "News",
      hint: "Datierte Neuigkeit mit verlinkter Quelle",
    },
    fundus: {
      label: "Fundus-Tipp",
      hint: "Zeitlose Prompt-Idee — keine tagesaktuelle News",
    },
    praxis: {
      label: "Praxis-Tipp",
      hint: "Allgemeine Technik — keine tagesaktuelle News",
    },
  };

export const kiAlltagItems: KiAlltagItem[] = [
  /* ---------------------------------------------------------------- */
  /*  News — datiert, mit Quelle                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 1,
    title:
      "Welche KI-App passt zu dir? Der Stand vom 25.10. – plus dein 10-Minuten-Selbsttest",
    kind: "news",
    tool: "Allgemein",
    date: "2026-10-25",
    dateLabel: "25.10.2026",
    what: "Tech Insider hat die vier großen KI-Apps erneut verglichen (auf Basis der Hersteller-Seiten, geprüft am 25.10.2026): ChatGPT ist die sicherste Einzel-App – die Gratis-Version läuft mit GPT-6 Luna, dazu kommen Intelligent UI und die aktualisierte Stimme. Gemini lohnt sich, wenn dein Handy Android ist und du ohnehin für Google zahlst: Das Top-Modell Gemini 4 Argon gibt es in der App nur für AI Pro und Ultra. Claude ist die Empfehlung für langes, sorgfältiges Schreiben und lange Dokumente (Opus 5.5, Sonnet 5.5 und Haiku 5.5). Grok passt zu Menschen, die in X leben und Live-Posts mit besprechen wollen. Gemeinsame Lehre: Kein Anbieter gibt sein Top-Modell gratis – für Alltag, Schreiben und Lernen reicht Gratis trotzdem monatelang.",
    why: "Statt vier Apps auf Verdacht zu installieren und überall ein Konto anzulegen, entscheidest du mit deiner eigenen echten Aufgabe: derselbe Prompt in zwei Apps, ehrlich Punkte vergeben – die bessere Summe bei deiner Aufgabe gewinnt.",
    steps: [
      "Kopiere die Vorlage unten und setze deine eigene Aufgabe und dein Material ein (keine sensiblen Daten).",
      "Lass denselben Prompt in zwei Apps laufen, z. B. ChatGPT und Gemini.",
      "Vergib je App 1–5 Punkte: Hat sie die Rückfrage-Regel eingehalten? Stimmen Zahlen und Namen? Klingt der Ton nach dir? Wie viel musstest du nachbessern?",
      "Die App mit der besten Summe bei deiner Aufgabe wird deine Haupt-App – die andere darf wieder gehen.",
    ],
    promptLabel: "Kopierfertige Vorlage – derselbe Prompt in 2 Apps",
    prompt: `Aufgabe: Hilf mir bei einer echten Sache aus meiner Woche.
Kontext: [1–2 Sätze: Worum geht es? Für wen ist das Ergebnis? Beispiel: Antwort an eine Nachbarin, die nach einem Rezept fragt, freundlich und kurz.]
Mein Material: [hier deinen Text / deine Stichpunkte einfügen, keine sensiblen Daten]
So soll das Ergebnis aussehen: maximal 150 Wörter, einfache Sprache, als kurze Liste.
Regeln: Erfinde keine Fakten. Wenn dir eine Angabe fehlt, stelle mir zuerst genau eine Rückfrage statt zu raten. Markiere alles, was du nicht sicher weißt, mit [bitte prüfen].`,
    note: "Redaktioneller Vergleich, kein Labor-Test. Bei Claude (Gratis-Standardmodell, Verbraucherpreise) und Grok (aktuelles Modell, Preise) konnten die Angaben auf den offiziellen Seiten nicht bestätigt werden – vor einem Abo direkt in der App prüfen. Stand dieser Karte: 25.10.2026, wird bei Neuauflage des Vergleichs aktualisiert.",
    sources: [
      {
        label:
          "Tech Insider – Best AI Chatbot App 2026: 4 Apps, $0 to $500 Plans (25.10.2026)",
        url: "https://tech-insider.org/best-ai-chatbot-app-iphone-android-2026/",
      },
    ],
  },

  {
    id: 5,
    title:
      "Halloween in einer Minute: Eigenes Foto als geschnitztes Kürbis-Porträt",
    kind: "news",
    tool: "Allgemein",
    date: "2026-10-27",
    dateLabel: "27.10.2026",
    what: "Office Watch (27.10.) zeigt, wie du in ChatGPT, Gemini oder Microsoft Copilot – alle gratis nutzbar – ein normales Foto in einen leuchtenden Kürbis verwandelst, in den das Gesicht der Person als Porträt „geschnitzt“ ist. Der Trick steckt in drei Sätzen des Prompts: die erkennbaren Merkmale ausdrücklich benennen (Frisur, Brille, Bart, Lächeln), den Unterschied zwischen „ganz durchgeschnitten = leuchtet hellgelb“ und „dünn geschabt = leuchtet weiches Orange“ erklären (so entstehen bei echten Schnitzern die Schattierungen) und klar sagen „Zeige nur den Kürbis, nicht die Person“.",
    why: "Ein perfektes erstes Bild-Projekt: ein Foto, ein Prompt, ein sichtbares Ergebnis in etwa einer Minute. Und die Arbeitsweise überträgt sich auf fast alle Bild-Wünsche: Merkmale benennen statt hoffen, Technik in Alltagsworten beschreiben, und danach mit kleinen Korrekturen nachbessern („Augenbrauen dicker“, „Lächeln breiter“) statt von vorn anzufangen.",
    steps: [
      "Gutes Ausgangsfoto wählen: Gesicht von vorn, gut beleuchtet, ohne Sonnenbrille oder Kappe.",
      "Foto in ChatGPT, Gemini oder Copilot hochladen und die Vorlage unten einfügen.",
      "Mit kleinen Korrekturen nachbessern statt neu anzufangen.",
    ],
    promptLabel: "Kopierfertige Vorlage",
    prompt: `Erstelle aus dem angehängten Foto ein fotorealistisches Bild eines
großen orangefarbenen Halloween-Kürbisses, in den ein Porträt dieser
Person geschnitzt ist. Verwandle ihre erkennbarsten Merkmale in
Schnitz-Formen: Frisur, Augenbrauen, Augenform, Nase, Lächeln und
falls vorhanden Brille, Bart oder Sommersprossen. Manche Bereiche
sind ganz durchgeschnitten und leuchten hellgelb, andere nur dünn
geschabt und leuchten weicher orange – so entstehen Schattierungen
wie bei einem echten Porträt. Von innen mit einer Kerze beleuchtet.
Der Kürbis steht nachts auf einer Holzstufe, Herbstblätter daneben.
Quadratisches Bild, Nahaufnahme, der Kürbis füllt fast das ganze Bild.
Zeige nur den Kürbis, nicht die Person und nicht das Originalfoto.

Variante ohne Foto, für einen klassischen Kürbis: „Ein fotorealistischer geschnitzter Halloween-Kürbis vor einer Haustür bei Nacht, von innen mit einer Kerze beleuchtet. Klassisches Grusel-Gesicht mit Dreiecks-Augen und gezacktem Grinsen. Herbstblätter und kleine Zierkürbisse daneben, leichter Nebel. Quadratisches Bild, Nahaufnahme."`,
    note: "Nur eigene Fotos oder Fotos von Personen verwenden, die einverstanden sind. Saisonale Karte (Halloween 31.10.): Nach Halloween per Altern-Regel prüfen – als Technik-Karte umrahmen oder entfernen.",
    sources: [
      {
        label:
          "Office Watch – How to Turn Anyone's Photo Into a Carved Pumpkin With Free AI Tools (27.10.2026)",
        url: "https://office-watch.com/2026/ai-carved-pumpkin-from-photo/",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  /*  Praxis & Fundus — zeitlos, kein Datum                            */
  /* ---------------------------------------------------------------- */
  {
    id: 2,
    title: "Der 7-Tage-Starterplan: Jeden Tag nur eine kleine KI-Aufgabe",
    kind: "praxis",
    tool: "Allgemein",
    what: "Ein einfacher Wochenplan für Nicht-Techniker: Jeden Tag genau eine Alltagsaufgabe mit der KI üben – E-Mail verbessern, ein langes Dokument zusammenfassen, Notizen in Aufgaben verwandeln, einen ersten Entwurf schreiben, die Woche planen, etwas Neues lernen – und am letzten Tag die eigenen besten Prompts speichern.",
    why: "Die meisten bleiben bei „mal was fragen“ hängen. Der Plan baut in einer Woche die fünf Gewohnheiten auf, die im Alltag wirklich Zeit sparen – und endet damit, funktionierende Prompts zu behalten statt sie zu vergessen.",
    steps: [
      "Tag 1 – E-Mail verbessern: Eigenen Entwurf einfügen und klarer und freundlicher machen lassen (Vorlage unten).",
      "Tag 2 – Langes Dokument zusammenfassen: In 5 Stichpunkten, dazu getrennt alle Entscheidungen und Fristen; was fehlt, soll die KI als „nicht im Text“ markieren.",
      "Tag 3 – Zettel-Notizen in Aufgaben verwandeln: Als Tabelle Aufgabe | Wer | Bis wann; Fehlendes mit [fehlt] markieren lassen.",
      "Tag 4 – Erster Entwurf: Immer Zielgruppe, Ziel und Ton mitgeben, danach selbst überarbeiten – der KI-Text ist Entwurf, nicht Endfassung.",
      "Tag 5 – Woche planen: Aufgabenliste nach Dringlichkeit und Aufwand sortieren lassen – mit Puffer, nicht vollgestopft.",
      "Tag 6 – Etwas schnell lernen: Thema einfach erklären lassen und sich danach 3 kurze Prüfungsfragen stellen lassen.",
      "Tag 7 – Eigene Bibliothek anlegen: Die 5 Prompts, die am besten funktioniert haben, mit klarem Namen in einer Notiz speichern.",
    ],
    promptLabel: "Tag 1 – E-Mail verbessern",
    prompt: `Mach diese E-Mail klarer und freundlicher, maximal 120 Wörter. Behalte alle Fakten und Termine exakt bei. Mein Entwurf: [hier einfügen]`,
    note: "Drei Regeln aus dem Plan, die immer gelten: Keine Passwörter, Kundendaten oder Vertrauliches einfügen. Fakten, Zahlen und Namen vor dem Absenden selbst prüfen. Jede KI-Antwort als Entwurf behandeln.",
    sources: [
      {
        label:
          "FreeTier Kits – AI at Work for Non-Tech People: A 7-Day Starter Plan",
        url: "https://telegra.ph/AI-at-Work-for-Non-Tech-People-A-7-Day-Starter-Plan-10-25",
      },
    ],
  },
  {
    id: 3,
    title: "RISEN: Die Prompt-Formel für Aufgaben mit klaren Schritten",
    kind: "praxis",
    tool: "Allgemein",
    what: "RISEN strukturiert einen Prompt in fünf Bausteine in fester Reihenfolge: Role (Rolle), Input (deine Angaben), Steps (die Schritte, die die KI abarbeiten soll), Expectation (so soll das Ergebnis aussehen) und Narrowing (Eingrenzung: Ton, Grenzen, was wegfallen soll). Die Formel eignet sich besonders für komplexere Ausgaben, bei denen du den Ablauf steuern willst – Analysen, strukturierte Dokumente, mehrstufiges Nachdenken.",
    why: "Die meisten schwachen Antworten entstehen, weil nur die Aufgabe im Prompt steht – aber nicht, womit die KI arbeiten soll und in welcher Reihenfolge. RISEN zwingt dich freundlich, genau das in fünf kurzen Zeilen zu liefern, ganz ohne Fachwissen.",
    steps: [
      "Fülle die fünf Zeilen der Vorlage unten mit deinem eigenen Thema.",
      "Lies die Antwort und schärfe mit einer Nachfrage nach („Mache die Spar-Ideen kleiner und sofort machbar“) statt neu anzufangen.",
    ],
    promptLabel: "Kopierfertige Vorlage – Beispiel Ausgaben-Check",
    prompt: `Role: Du bist mein Finanz-Coach für den Alltag.
Input: Meine Monatsausgaben stehen unten: [hier deine Liste einfügen, z. B. Miete, Einkauf, Abos, Tanken – ohne Kontonummern oder echte Zugangsdaten]
Steps: 1) Sortiere alles in Kategorien. 2) Markiere die drei größten Posten. 3) Schlage pro Kategorie genau einen realistischen Spar-Schritt vor.
Expectation: Eine Tabelle (Kategorie | Betrag | Spar-Idee) plus eine Zusammenfassung in maximal 5 Zeilen.
Narrowing: Freundlicher Ton, kein Fachjargon, einfache deutsche Sprache. Erfinde keine Beträge dazu – wenn etwas fehlt, frage mich zuerst.`,
    note: "Keine sensiblen persönlichen oder Firmen-Daten einfügen und wichtige Zahlen in der Antwort selbst prüfen – die KI kann sich irren.",
    sources: [
      {
        label:
          "One Prompt a Day – RISEN: Role · Input · Steps · Expectation · Narrowing",
        url: "https://www.onepromptaday.com/",
      },
    ],
  },
  {
    id: 4,
    title: "BAB: Aus „So ist es“ wird „So soll es werden“ – in 3 Zeilen",
    kind: "fundus",
    tool: "Allgemein",
    what: "BAB steht für Before · After · Bridge (Vorher · Nachher · Brücke): Du beschreibst in zwei kurzen Zeilen, wie es jetzt ist und wie es sein soll – die KI baut die Brücke dazwischen, also den konkreten Plan. Am stärksten ist die Formel für überzeugende und verändernde Texte: Coaching-Nachrichten, Pitches, Änderungs-Pläne – und im Alltag für Postfach aufräumen, Zimmer umräumen, ein Lernziel erreichen oder eine Gewohnheit ändern.",
    why: "Du musst keine lange Anweisung schreiben. Die drei Zeilen zwingen dich automatisch zu dem, was den meisten Anfänger-Prompts fehlt: Ausgangslage und Ziel klar zu benennen. Den Weg dazwischen darf die KI vorschlagen.",
    steps: [
      "Öffne ChatGPT, Claude oder Gemini.",
      "Kopiere die Vorlage unten und ersetze nur die drei Zeilen durch dein eigenes Thema.",
      "Lies den Plan, picke den ersten Schritt heraus und bitte dann um Verfeinerung („Mach Schritt 1 kleiner, ich habe nur 20 Minuten“).",
    ],
    promptLabel: "Kopierfertige Vorlage",
    prompt: `Before: [So ist es jetzt, ehrlich und konkret. Beispiel: Mein Postfach hat 800 ungelesene Mails, ich finde nichts wieder.]
After: [So soll es sein. Beispiel: Postfach ist bis Freitag leer, wichtige Mails sind in 3 Ordnern sortiert.]
Bridge: Gib mir einen Schritt-für-Schritt-Plan, den ich in insgesamt 2 Stunden schaffen kann. Fang mit dem leichtesten Schritt an. Sag mir bei jedem Schritt, was ich danach wegwerfen, löschen oder ignorieren darf.`,
    note: "Keine sensiblen persönlichen oder Firmen-Daten einfügen und wichtige Angaben in der Antwort selbst prüfen – die KI kann sich irren.",
    sources: [
      {
        label: "One Prompt a Day – BAB: Before · After · Bridge",
        url: "https://www.onepromptaday.com/",
      },
    ],
  },
  {
    id: 6,
    title: "Schluss mit dem Kumpel-Ton: Ein 3-in-1-Prompt macht die KI sachlich",
    kind: "praxis",
    tool: "Allgemein",
    what: "PCWorld hat drei ältere Einzel-Prompts – „No Teasers“ (keine „Willst du, dass ich …?“-Anhängsel), „Don't Act Human“ (nicht so tun, als hätte die KI Gefühle) und „On a Budget“ (Zeit und Umfang knapp halten) – zu einem einzigen Anweisungs-Block von rund 200 Wörtern verschmolzen. Getestet wurde er mit ChatGPT, Claude Sonnet 5.5 und Gemini: Die Antworten wurden kürzer, Listen verloren ihre endlosen Unterpunkte, Lobhudelei und Teaser am Schluss fielen weg, und Aufgaben bekamen eine Rangfolge mit Aufwand (S/M/L).",
    why: "Fast jeder kennt das: Auf eine kleine Frage kommt eine riesige, überfreundliche Antwort mit fünf Zusatzangeboten. Dieser Block gehört einmal in die benutzerdefinierten Anweisungen – danach musst du nicht in jedem Chat neu „bitte kurz und sachlich“ schreiben.",
    steps: [
      "ChatGPT: Personalisierung → Benutzerdefinierte Anweisungen. Claude: Einstellungen → Konto. Gemini: Einstellungen → Personal Intelligence.",
      "Alternativ: einfach als erste Nachricht in einen neuen Chat kopieren.",
    ],
    promptLabel: "Kopierfertige Vorlage (deutsche Kompakt-Fassung)",
    prompt: `Beginne mit der Antwort. Sei direkt und höflich. Tu nicht so,
als hättest du Gefühle, ein Bewusstsein oder eine persönliche
Beziehung zu mir. Keine gespielte Emotion, keine Schmeichelei,
kein Lob für meine Fragen oder Entscheidungen. Gib Einschätzungen
statt Stimmungen: Sage, ob eine Idee gut belegt oder schwach ist.

Behandle meine Zeit als knappes Budget. Wähle die kleinste Antwort
oder Lösung, die das Problem vollständig löst. Keine aufgeblähten
Listen. Sortiere Empfehlungen nach Nutzen pro Aufwand, markiere
den Aufwand mit S / M / L und trenne: jetzt wichtig, nebensächlich,
kann weg. Prüfe Behauptungen, die die Antwort verändern würden.

Ende nicht mit Angeboten wie „Soll ich noch …?" oder „Sag Bescheid".
Nenne sinnvolle nächste Schritte als Fakten. Stelle Rückfragen nur,
wenn du wirklich festhängst – nicht als Verabschiedung.`,
    note: "Die Vorlage ist eine deutsche Kompakt-Fassung der PCWorld-Anweisung. Wichtige Angaben in der Antwort trotzdem selbst prüfen – die KI kann sich irren.",
    sources: [
      {
        label:
          "PCWorld – One prompt made ChatGPT, Claude, and Gemini stop acting like my buddy (27.10.2026)",
        url: "https://www.pcworld.com/article/3270796/one-prompt-made-chatgpt-claude-and-gemini-stop-acting-like-my-buddy.html",
      },
    ],
  },
];
