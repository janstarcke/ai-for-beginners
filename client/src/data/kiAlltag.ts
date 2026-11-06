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

  {
    id: 12,
    title:
      "Zwei Konten auf einem Handy: ChatGPT trennt jetzt Privat und Arbeit",
    kind: "news",
    tool: "ChatGPT",
    date: "2026-10-30",
    dateLabel: "30.10.2026",
    what: "Seit dem 30. Oktober 2026 rollt OpenAI die Konto-Umschaltung für die ChatGPT-Apps auf iPhone und Android aus: Man kann zwei ChatGPT-Konten gleichzeitig auf einem Handy angemeldet lassen und zwischen ihnen wechseln, ohne sich jedes Mal ab- und wieder anzumelden. Im Web ging das schon länger, auf dem Handy war es bisher nur mit ständigem Ausloggen möglich. Das zweite Konto startet auf dem Free-Tarif und braucht kein eigenes Abo – ein bezahlter Tarif auf dem einen Konto gilt aber nicht automatisch für das andere.",
    why: "Viele haben zwei Welten in einer App: ein privates Konto (Rezepte, Reisen, Lernfragen) und ein Arbeitskonto (E-Mails, Projekte, Firmen-Daten). Bisher vermischten sich Chats, Gedächtnis und Dateien – oder man musste ständig umständlich wechseln. Jetzt bleibt jede Welt sauber für sich: Das Arbeitskonto kennt nur Arbeits-Chats, das private nur private. Auch praktisch: Wer ein Konto mit der Familie teilt und eines für sich allein will, muss sich nicht mehr ständig abmelden.",
    steps: [
      "ChatGPT-App auf dem Handy aktualisieren (App Store / Google Play).",
      "In der App die Einstellungen öffnen und auf „Konto wechseln“ tippen.",
      "Auf „Konto hinzufügen“ tippen und dich mit dem zweiten Konto anmelden (oder ein neues Konto erstellen).",
      "Zum Wechseln später einfach wieder zu „Einstellungen → Konto wechseln“ und das andere Konto antippen – ein Häkchen zeigt, welches gerade aktiv ist.",
      "Falls „Konto wechseln“ in den Einstellungen fehlt: Der Rollout läuft schrittweise, dann hat das Feature dein Konto noch nicht erreicht – einfach in den nächsten Tagen nochmal schauen.",
    ],
    note: "Es können höchstens zwei Konten gleichzeitig angemeldet sein – für ein drittes muss man erst eines abmelden. Und: Wechseln ist nicht Zusammenlegen. Chats, Gedächtnis, Dateien, Einstellungen und Abos bleiben strikt pro Konto getrennt, nichts wandert von einem Konto ins andere. Auf dem Desktop kommt die Umschaltung laut OpenAI demnächst.",
    sources: [
      {
        label:
          "ShiftDelete – ChatGPT Account Switching Arrives on iPhone and Android (31.10.2026)",
        url: "https://shiftdelete.net/en/chatgpt-account-switching",
      },
      {
        label:
          "MakeBetter – ChatGPT Account Switching: iPhone & Android Guide (01.11.2026)",
        url: "https://www.makebetter.im/ai-news/chatgpt-switch-accounts-iphone-android-setup-limits",
      },
    ],
  },

  {
    id: 7,
    title:
      "ChatGPT kann jetzt GIFs machen – und merkt sich deine Referenzbilder",
    kind: "news",
    tool: "ChatGPT",
    date: "2026-11-04",
    dateLabel: "04.11.2026",
    what: "OpenAI hat am 4. November 2026 „ChatGPT Images 2.6“ veröffentlicht: ChatGPT erstellt jetzt animierte GIFs – aus einem Text oder aus einem hochgeladenen Foto – und man kann Referenzbilder (sich selbst, das Haustier, eine wiederkehrende Figur) einmal speichern und in neuen Bildern wiederverwenden, ohne sie jedes Mal neu hochzuladen. Dazu ist die Bilderstellung laut OpenAI etwa 50 Prozent schneller geworden. Das Update gilt für alle Tarife inklusive Free, auf Web, Desktop und Handy.",
    why: "Bisher war jedes Bild ein Einzelstück: Wer dieselbe Person oder dasselbe Maskottchen in mehreren Bildern haben wollte, musste das Foto jedes Mal neu hochladen und hoffen, dass es ähnlich aussieht. Mit gespeicherten Referenzbildern bleibt die Figur über viele Bilder hinweg erkennbar. Und ein GIF ist oft der schnellere Weg als ein Video: eine winkende Katze für die Geburtstagskarte, ein Produktfoto, das sich einmal dreht, ein kleines „Danke“-GIF für die Familien-WhatsApp-Gruppe.",
    steps: [
      "ChatGPT (App oder Web) öffnen und einen neuen Chat starten.",
      "Für ein GIF aus Text: kurze Szene beschreiben und dazu schreiben, dass es ein GIF in Endlosschleife sein soll.",
      "Für ein GIF aus Foto: Foto hochladen und nur die Bewegung beschreiben – Gesicht und Details bleiben dabei unverändert.",
      "Wenn das GIF da ist: öffnen, um die Abspielgeschwindigkeit anzupassen oder einzelne Bilder (Frames) zu prüfen und zu ändern, dann speichern oder teilen.",
      "Für ein Referenzbild: klares Foto hochladen und ChatGPT bitten, es unter einem Namen zu speichern. In späteren Chats mit @Name im Prompt wieder aufrufen.",
    ],
    promptLabel: "Kopierfertige Vorlagen",
    prompt: `GIF aus Text:
Erstelle ein kurzes GIF in Endlosschleife: [z. B. eine Katze, die
freundlich winkt]. Stil: [z. B. freundlicher Zeichentrick, warme
Farben]. Die Bewegung soll langsam und ruhig sein.

GIF aus Foto:
Animiere dieses Foto zu einem kurzen GIF in Endlosschleife:
[z. B. die Person winkt einmal kurz]. Gesicht, Kleidung und
Hintergrund unverändert lassen.

Referenzbild speichern:
Speichere dieses Foto als Referenzbild unter dem Namen [z. B. Milo].

Referenzbild später wiederverwenden:
Erstelle ein Bild von @Milo, wie er [z. B. in einem herbstlichen
Park auf einer Bank sitzt]. Gleiches Aussehen wie im Referenzbild.`,
    note: "Die GIF-Funktion wird gestaffelt ausgerollt – sie ist also vielleicht noch nicht bei jedem Konto angekommen, einfach in den nächsten Tagen nochmal probieren. Ein fertiges GIF, das man selbst hochlädt, kann ChatGPT nicht bearbeiten – GIFs entstehen nur direkt in ChatGPT. Nur eigene Fotos (oder Fotos mit Einverständnis der abgebildeten Person) animieren und als Referenz speichern.",
    sources: [
      {
        label:
          "OpenAI Developer Community – Images, upgraded: introducing ChatGPT Images 2.6 (04.11.2026)",
        url: "https://community.openai.com/t/images-upgraded-introducing-chatgpt-images-2-6/1412901/1",
      },
      {
        label:
          "Gadgets360 – OpenAI Introduces Images 2.6 With GIF Support and Faster API Models (05.11.2026)",
        url: "https://www.gadgets360.com/ai/news/openai-images-2-6-update-gif-creation-chatgpt-new-api-models-12287035/amp",
      },
    ],
  },

  {
    id: 11,
    title:
      "Claude kann jetzt aufs Konto schauen – in Deutschland geht der Ausgaben-Check per CSV",
    kind: "news",
    tool: "Claude",
    date: "2026-11-05",
    dateLabel: "05.11.2026",
    what: "Anthropic hat am 5. November 2026 „Personal Finance in Claude“ vorgestellt: Wer seine Bank- und Kreditkartenkonten verknüpft, kann Claude in einfachen Worten nach seinem Geld fragen – „Wohin ist mein Geld diesen Monat gegangen?“, „Gebe ich mehr aus, als ich verdiene?“ Claude antwortet dann in Alltagssprache, zeigt eine wöchentliche Ausgaben-Grafik, einen Kalender mit Fälligkeiten und ein kleines Zahlen-Dashboard. Die Verbindung läuft über Plaid (den Dienst, der auch viele Banking-Apps mit Banken verbindet), ist nur lesend – Claude kann kein Geld bewegen, keine Rechnung bezahlen und kein Abo kündigen – und umfasst bis zu 16 Konten mit bis zu zwei Jahren Transaktionen.",
    why: "Die Idee dahinter ist für jeden interessant, auch wenn das Feature selbst in Deutschland noch nicht da ist: Man muss keine Tabellen mehr selbst bauen, um zu verstehen, wohin das Geld geht – man fragt einfach in normalen Sätzen. ChatGPT hat eine ähnliche Funktion („Finances“) seit Mai 2026, ebenfalls nur in den USA. Der deutsche Weg bis dahin: Man exportiert selbst einen Kontoauszug als CSV-Datei und lässt ihn von ChatGPT, Claude oder Gemini auswerten – mit der Vorlage unten geht das in zwei Minuten, ganz ohne Konto-Verknüpfung.",
    steps: [
      "Im Online-Banking den Kontoauszug der letzten 1–3 Monate als CSV-Datei herunterladen.",
      "Vor dem Hochladen kurz bereinigen: Kontonummern und Empfänger-Namen, die dich stören, in der Datei löschen oder kürzen. Niemals Passwörter, PINs oder TANs in einen Chat schreiben – die gehören in keine KI.",
      "Die CSV in einem temporären Chat hochladen (ChatGPT: temporärer Chat über das Menü oben; Gemini: temporärer Chat) – so landet die Datei nicht im Verlauf und nicht im Training.",
      "Die Vorlage unten reinkopieren und abschicken.",
      "Die Antwort prüfen: Bei jeder Zahl, die wichtig ist („Du hast 312 € für Essen ausgegeben“), nachfragen, welche Buchungen dahinter stecken – die KI kann sich verrechnen, Anthropic selbst warnt davor.",
    ],
    promptLabel: "Kopierfertige Vorlage – Ausgaben-Check mit eigener CSV",
    prompt: `Ich habe meine Kontoauszüge der letzten [z. B. 3] Monate als CSV
angehängt. Erstelle mir einen einfachen Ausgaben-Check in Alltagssprache:

1. Die 5 größten Ausgabengruppen mit Betrag (z. B. Wohnen, Essen,
   Abos, Freizeit) – als einfache Tabelle.
2. Die 3 auffälligsten Einzelbuchungen, die ich mir ansehen sollte.
3. Eine ehrliche Einschätzung in 2 Sätzen: Wo versickert Geld,
   ohne dass es mir auffällt?
4. Eine Frage, die ich mir selbst stellen sollte, bevor ich
   nächsten Monat spare.

Regeln: Erfinde keine Zahlen – nenne nur Beträge, die in der Datei
stehen. Wenn eine Kategorie unklar ist, schreib „unklar" dazu,
statt zu raten.`,
    note: "Personal Finance ist eine Beta, die schrittweise ausgerollt wird – und nur für zahlende Claude-Nutzer (Pro, Max, Ultra) in den USA. In Deutschland erscheint die Funktion gar nicht, auch nicht mit VPN, und Anthropic nennt kein Datum für andere Länder. Die Anleitung oben ist die Sofort-Alternative, bis das Feature hier ankommt.",
    sources: [
      {
        label:
          "Anthropic Help Center – Release Notes: Personal Finance in Claude (05.11.2026)",
        url: "https://support.claude.com/en/articles/12138966-release-notes?hubs-post-cta=fr-blog-plain",
      },
      {
        label:
          "dev.to – Claude Can Now Read Your Bank Account (05.11.2026)",
        url: "https://dev.to/paullovelace/claude-can-now-read-your-bank-account-6-months-after-chatgpt-21m8",
      },
      {
        label:
          "PYMNTS – Anthropic Invites Banks to Help Shape New Personal Finance Offerings (05.11.2026)",
        url: "https://www.pymnts.com/consumer-finance/2026/anthropic-invites-banks-to-help-shape-new-personal-finance-offerings/",
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
  {
    id: 8,
    title: "Claude lässt sein Gedächtnis umziehen: Memory-Import und -Export",
    kind: "praxis",
    tool: "Claude",
    what: "Anthropic hat am 2. November 2026 eine eingebaute Möglichkeit eingeführt, das Gedächtnis (Memory) zwischen Claude und anderen KI-Anbietern umzuziehen: Man kann Erinnerungen aus einem anderen Dienst in Claude importieren – und sein Claude-Gedächtnis exportieren, als Sicherung oder für den Wechsel woandershin. Das gilt für Web und Desktop-App, in allen Tarifen inklusive Free.",
    why: "Wer monatelang mit einem Chatbot gearbeitet hat, hat ihm viel beigebracht: wie man angesprochen werden will, welche Projekte laufen, was man mag und was nicht. Beim Wechsel zu einem anderen Assistenten war das bisher weg – man fing bei null an. Jetzt kann man diesen „Steckbrief“ mitnehmen. Und umgekehrt: Wer sein Claude-Gedächtnis einmal als Datei sichert, hat es in der Hand, statt es nur in der App zu wissen.",
    steps: [
      "Export beim alten Dienst: Dem bisherigen Chatbot (z. B. ChatGPT oder Gemini) die Vorlage unten schicken. Er listet alles auf, was er über dich gespeichert hat – als kopierbaren Text.",
      "Vor dem Import prüfen: Die Liste einmal durchlesen und alles löschen, was nicht mit umziehen soll (z. B. Passwörter, Adressen, sehr private Details). Nur das bereinigte Ergebnis weitergeben.",
      "Import in Claude: Den Import-Ablauf in Claude öffnen, den Text in das Textfeld einfügen und auf „Add to memory“ klicken. Claude zerlegt den Text in einzelne Gedächtnis-Einträge.",
      "Nachprüfen: Danach in einem neuen Chat fragen: „Ich habe mein Gedächtnis aktualisiert. Was hast du über mich gelernt?“ Stimmt etwas nicht, direkt im Chat korrigieren oder unter Einstellungen → Dein Claude → Verwalten neben „Dein Gedächtnis“.",
      "Export aus Claude: Unter Einstellungen → Dein Claude → Verwalten neben „Dein Gedächtnis“ siehst du, was Claude gespeichert hat. Oder im Chat fragen: „Schreib mir dein Gedächtnis über mich wortwörtlich heraus, genau wie es in deinem Gedächtnis steht.“ – und den Text als Datei speichern.",
    ],
    promptLabel: "Kopierfertige Vorlage – Export beim alten Dienst (deutsch)",
    prompt: `Ich wechsle zu einem anderen Dienst und muss meine Daten exportieren.
Liste alles auf, was du über mich gespeichert hast, und jeden Kontext,
den du aus früheren Gesprächen über mich gelernt hast. Gib alles in
einem einzigen Code-Block aus, damit ich es leicht kopieren kann.
Formatiere jeden Eintrag so: [Datum, falls vorhanden] – Inhalt.
Decke unbedingt ab – übernimm meine Worte möglichst wörtlich:
- Anweisungen, die ich dir gegeben habe (Ton, Format, Stil, „mach
  immer X", „mach nie Y")
- Persönliche Angaben: Name, Ort, Beruf, Familie, Interessen
- Projekte, Ziele und wiederkehrende Themen
- Werkzeuge, Sprachen und Programme, die ich nutze
- Vorlieben und Korrekturen, die ich an deinem Verhalten vorgenommen habe
- Jeder andere gespeicherte Kontext, der oben nicht abgedeckt ist
Fasse nichts zusammen, gruppiere nichts, lass nichts weg. Sage mir
danach, ob das vollständig ist oder ob noch Einträge fehlen.`,
    note: "Die Vorlage ist eine deutsche Fassung der Vorlage aus der Anthropic-Hilfe. Der Import ist experimentell, also immer mit der Nachfrage aus Schritt 4 kontrollieren, was wirklich angekommen ist. Claudes Gedächtnis ist vor allem auf Arbeitsthemen ausgelegt – rein private Details aus dem Import werden möglicherweise nicht übernommen. Veraltete Angaben (z. B. ein alter Job oder ein überholtes Projekt) nach dem Umzug einmal durchgehen und korrigieren.",
    sources: [
      {
        label:
          "Anthropic Hilfe – Import and export your memory from Claude (aktualisiert 02.11.2026)",
        url: "https://support.claude.com/en/articles/12123587-import-and-export-your-memory-from-claude",
      },
      {
        label:
          "Konshus – Claude lets you move AI memories (03.11.2026)",
        url: "https://konshus.ai/ai-memory-news/2026-11-03-claude-lets-you-move-ai-memories-keeping-them-trustworthy-is-harder",
      },
    ],
  },
  {
    id: 9,
    title:
      "Ein Skill als Datei: einmal schreiben, in ChatGPT, Gemini und Claude nutzen",
    kind: "praxis",
    tool: "Allgemein",
    what: "Ein Skill ist eine gespeicherte Arbeitsanweisung als Textdatei namens SKILL.md – zum Beispiel „Notizen ordnen“: Aus ungeordneten Notizen entstehen Aufgaben, Entscheidungen und offene Fragen. Dafür sind keine Programmierkenntnisse nötig: Man lässt sich den Skill per Prompt schreiben, prüft ihn und speichert ihn als Datei. In Gemini kann man eine fertige Skill-Datei seit dem Praxistest von XDA Developers (1. November 2026) sogar direkt hochladen, statt die Anleitung selbst neu zu tippen: Anpassen → Skills, als einzelne Datei, ganzen Ordner oder ZIP. Weil Claude und Gemini dasselbe Dateiformat nutzen, lässt sich dieselbe Datei in beiden – und in ChatGPT – weiterverwenden. Gemini löst Skills außerdem automatisch aus: Wenn die Beschreibung des Skills zur Aufgabe passt, schaltet Gemini ihn von selbst ein und zeigt seinen Namen im Denkprozess an. Der Auslöser wechselt dabei von / zu @.",
    why: "Bislang musstest du jedem Assistenten bei jedem Anbieter neu erklären, wie er arbeiten soll. Mit einem Skill schreibst du die Anweisung einmal auf und nimmst sie mit. Das passt zum großen November-Thema: Auch Gemini ersetzt ab 17. November seine Gems durch Skills – die Idee „eigene Anweisung als wiederverwendbare Datei“ wird gerade zum Standard.",
    steps: [
      "Den gewohnten Assistenten bitten, einen Skill-Entwurf zu schreiben (Vorlage unten).",
      "Den Entwurf prüfen: Steht genau drin, was der Skill tun soll – und was nicht?",
      "Den Entwurf als Datei (SKILL.md) speichern. Der Skill-Name muss aus Kleinbuchstaben mit Bindestrichen bestehen (z. B. wochen-planer).",
      "In Gemini: Anpassen → Skills, die Datei (oder Ordner/ZIP) hochladen. In ChatGPT oder Claude: die Datei importieren bzw. hochladen.",
      "Die Beschreibung sorgfältig ausfüllen – sie ist der Auslöser: Steht dort „erstellt einen Wochenplan“, reicht später ein Prompt wie „Mach mir einen Wochenplan“, und Gemini aktiviert den Skill automatisch. Aufrufen geht auch von Hand: @Skill-Name im Chat.",
      "Mit echten Notizen testen und das Ergebnis prüfen: Sind Aufgaben, Entscheidungen und offene Fragen sauber getrennt? Erst wenn der Test sitzt, dieselbe Datei im nächsten Assistenten verwenden.",
    ],
    promptLabel: "Kopierfertige Vorlage, um den Skill erstellen zu lassen",
    prompt: `Erstelle mir einen Skill namens „Notizen ordnen" als Textdatei (SKILL.md).
Der Skill soll aus ungeordneten Notizen genau drei Gruppen machen:
1. Aufgaben – mit Verb am Anfang, z. B. „Anrufen: …"
2. Entscheidungen – was wurde entschieden, von wem, bis wann?
3. Offene Fragen – was ist noch unklar?
Regeln: Nichts erfinden, nichts weglassen. Wenn etwas unklar ist, schreibe es unter „Offene Fragen" statt es zu raten.
Schreibe den Skill so, dass ich ihn in ChatGPT, Gemini und Claude verwenden kann.
Gib mir am Ende den kompletten Text der Datei aus, damit ich ihn speichern kann.`,
    note: "Übertragen werden nur deine Arbeitsanweisungen – nicht automatisch deine bisherigen Chats oder persönlichen Erinnerungen. Änderungen synchronisieren sich auch nicht von selbst zwischen den Anbietern. Fremde Skills vor dem Übernehmen prüfen, besonders wenn sie zusätzliche Skripte oder Verbindungen zu anderen Diensten enthalten. Bis zu 100 Skills können gleichzeitig aktiv sein. Noch nicht alles geht: Skills funktionieren aktuell nicht mit Deep Research, Guided Learning, Canvas, Video- oder Musik-Erstellung. Frist: Gems werden am 17. November 2026 nur noch lesbar und am 17. Dezember 2026 endgültig gelöscht – wer eine Gem-Anleitung behalten will, sollte sie bis dahin als Text sichern.",
    sources: [
      {
        label:
          "Digitale Profis – Der wichtigste KI-Skill 2026 (01.11.2026)",
        url: "https://tsecurity.de/de/4312056/ai-ki-nachrichten/der-wichtigste-ki-skill-2026-das-funktioniert-in-chatgpt-claude-gemini-und-fast-allen-chatbots/",
      },
      {
        label:
          "BlazeTrends – Gemini Replaces Gems With Skills on Nov. 17, Supports Claude SKILL.md Files (Basis: XDA Developers Hands-on, 01.11.2026)",
        url: "https://blazetrends.com/gemini-replaces-gems-with-skills-on-nov-17-supports-claude-skillmd-files/",
      },
    ],
  },
  {
    id: 10,
    title: "Lass die KI deine eigene Antwort prüfen – zwei kleine Selbst-Checks",
    kind: "praxis",
    tool: "Allgemein",
    what: "Zwei frische Vorlagen drehen den Spieß um: Statt die KI alles schreiben zu lassen, lässt man sie die eigene Arbeit prüfen. Das ist besonders nützlich beim Lernen und bei Texten, die man selbst geschrieben hat – die KI wird zum Korrekturleser und strengen Prüfer, nicht zum Ghostwriter.",
    why: "Wer immer nur die fertige Antwort nimmt, lernt nichts – und merkt Fehler nicht. Wer die KI dagegen bittet, die eigene Antwort zu prüfen, muss selbst nachdenken und bekommt trotzdem ehrliches Feedback. Der Trick dabei: Ausdrücklich verbieten, dass die KI den Text einfach neu schreibt. Sonst bekommt man eine neue Version statt einer echten Prüfung.",
    steps: [
      "Zuerst selbst schreiben – auch wenn es holprig ist. Ein eigener Entwurf ist die Voraussetzung, sonst gibt es nichts zu prüfen.",
      "Den Entwurf mit einer der beiden Vorlagen unten an ChatGPT, Claude oder Gemini schicken.",
      "Beim Selbsttest: Die Kritik lesen, den Fehler selbst korrigieren und die neue Version nochmal zur Prüfung schicken – so entsteht eine echte Lernschleife.",
      "Bei der Bewertung: Die Punktzahl nicht als objektive Note nehmen – sie ist die Einschätzung des Modells. Entscheidend ist die Begründung: Steht dort etwas Konkretes (z. B. „zu lang“, „kein Beispiel“), ist die Kritik brauchbar; steht dort nur Lob, um eine schärfere Prüfung bitten („Sei strenger: Was ist der größte Schwachpunkt?“).",
    ],
    promptLabel: "Kopierfertige Vorlagen",
    prompt: `Selbsttest ohne Neuschreiben:
Prüfe meine Antwort auf diese Frage und sag mir, was fehlt oder
falsch ist – ohne sie für mich neu zu schreiben.

Frage: [z. B. Was ist der Unterschied zwischen Zinsen und Tilgung?]
Meine Antwort: [deine Antwort hier einfügen]

Nenne mir danach 2 Dinge, die ich verbessern sollte, und stelle mir
eine Nachfrage, mit der ich es selbst korrigieren kann.

Entwurf bewerten und verbessern lassen:
Bewerte diesen Entwurf von 1 bis 10 und verbessere ihn dann selbst
auf eine 10. Schreibe zuerst die Punktzahl mit einer kurzen
Begründung, dann die verbesserte Version.

Entwurf: [z. B. deine E-Mail, dein Anschreiben, dein Text hier]
Zielgruppe: [z. B. mein Chef / eine Kundin]`,
    note: "Die Punktzahl ist die Einschätzung des Modells, keine objektive Note.",
    unverified:
      "Die 1-bis-10-Vorlage stammt aus einem Community-Video, nicht aus einer redaktionellen Quelle.",
    sources: [
      {
        label:
          "AI Journal News – How to Write Better ChatGPT Prompts: 15 Templates (04.11.2026)",
        url: "https://www.aijournalnews.com/how-to-write-chatgpt-prompts/",
      },
      {
        label:
          "Facebook-Reel – 3 Prompts für bessere Antworten (Community, 03.11.2026)",
        url: "https://www.facebook.com/reel/1084288967761885/",
      },
    ],
  },
  {
    id: 13,
    title:
      "Aus der ersten Antwort mehr herausholen: der Vertiefungs-Prompt in 5 Schritten",
    kind: "praxis",
    tool: "Allgemein",
    what: "Die erste KI-Antwort ist fast immer nur die oberflächliche Version. Statt eine längere Antwort zu verlangen, bittet man die KI in fünf Schritten, ihre eigene Antwort zu vertiefen: mehr Tiefe statt mehr Text, die Lücken benennen, konkrete Methoden verlangen, Prüfkriterien liefern – und am Ende den eigenen Prompt neu schreiben lassen. Den Tipp teilt laut einem Instagram-Post vom 5. November 2026 ein Lead-Ingenieur von Anthropic (dem Unternehmen hinter Claude). Das funktioniert in ChatGPT, Claude und Gemini gleich gut.",
    why: "Der häufigste Anfängerfehler ist, die erste Antwort einfach zu übernehmen – sie klingt gut, bleibt aber oft allgemein („Erstelle einen Plan“, „Nutze Social Media“). Mit diesem einen Nachfolge-Prompt wird aus einer Allerwelts-Antwort ein konkreter Arbeitsplan mit Werkzeugen, Schritten und einer Möglichkeit, das Ergebnis zu überprüfen. Und man lernt nebenbei, was eine gute Anweisung ausmacht – weil die KI am Ende den verbesserten Prompt gleich mitliefert.",
    steps: [
      "Stelle deine Frage ganz normal – kurz und ohne lange Vorbereitung.",
      "Wenn die Antwort da ist und dir zu oberflächlich vorkommt, kopiere die Vorlage unten in denselben Chat.",
      "Lies vor allem Schritt 3 und 4 genau: Stehen dort konkrete Werkzeuge und prüfbare Kriterien, hat sich die Vertiefung gelohnt. Steht dort wieder nur Allgemeines, hake einmal nach: „Nenne mir ein konkretes Beispiel für Schritt 2.“",
      "Den neu geschriebenen Prompt aus Schritt 5 kopieren und für die nächste, ähnliche Aufgabe wiederverwenden – so wird aus einem Trick eine Gewohnheit.",
    ],
    promptLabel: "Kopierfertige Vorlage – als Nachfolge-Prompt nach einer ersten Antwort",
    prompt: `Deine Antwort ist ein guter Anfang, aber sie bleibt zu allgemein.
Schärfe sie bitte in 5 Schritten nach:

1. Tiefe statt Länge: Gib mir eine strategischere Antwort, keine
   längere. Was ist der wichtigste Punkt, den ich zuerst angehen
   sollte – und warum?
2. Lücken finden: Was würde eine erfahrene Fachperson bei dieser
   Aufgabe zusätzlich bedenken, was ich noch gar nicht bedacht habe?
3. Konkrete Methoden: Nenne mir für jeden Schritt ein konkretes
   Werkzeug, eine Technik oder einen Ablauf – keine allgemeinen
   Tipps wie „sei kreativ" oder „plane gut".
4. Prüfkriterien: Woran erkenne ich, ob das Ergebnis gut ist?
   Gib mir 3 einfache Kriterien, an denen ich es selbst prüfen kann.
5. Prompt neu schreiben: Schreibe danach meinen ursprünglichen
   Prompt so um, dass er von Anfang an diese Tiefe liefert.
   Ich will ihn für ähnliche Aufgaben wiederverwenden können.`,
    note: "Die deutsche Vorlage ist eine eigene Adaption der fünf Schritte aus dem Post; der Ingenieur wird im Post nicht namentlich genannt.",
    unverified:
      "Tipp aus einem Community-Post, nicht aus einer offiziellen Anthropic-Anleitung.",
    sources: [
      {
        label:
          "Instagram @stephcarvajalino – Anthropic-Ingenieur teilt Prompt für bessere Claude-/ChatGPT-Ergebnisse (05.11.2026)",
        url: "https://www.instagram.com/p/DfYgMcEFOrO/",
      },
    ],
  },
  {
    id: 14,
    title: "KI-Bilder: die 5 Fehler, die fast jeder Anfänger macht",
    kind: "praxis",
    tool: "Allgemein",
    what: "Ein deutscher Instagram-Beitrag vom 5. November 2026 fasst die fünf häufigsten Anfängerfehler beim Bilder-Erstellen mit KI zusammen – mit dem schönen Beweis, dass derselbe Bildwunsch je nach Prompt völlig anders aussieht. Die Fehler: Prompt zu kurz, kein Licht angegeben, keinen Stil genannt, nach dem ersten Versuch aufgeben, keine Perspektive angegeben. Der Lieblingsfehler der Autorin: Sie schrieb „camera lying on the asphalt“ – und die KI malte einfach eine Kamera auf die Straße, statt aus Bodennähe zu fotografieren.",
    why: "Bilder mit KI scheitern fast nie an der Technik, sondern an der Beschreibung. Wer die fünf Punkte einmal verinnerlicht, bekommt beim zweiten oder dritten Versuch Bilder, die aussehen wie geplant – statt nach dem ersten enttäuschenden Versuch aufzugeben. Die Bausteine funktionieren in ChatGPT, Gemini und jedem anderen Bild-Tool gleich: Motiv + Licht + Stil + Perspektive.",
    steps: [
      "Schreibe deinen Bildwunsch zuerst in einem Satz auf Deutsch: Was soll zu sehen sein, was passiert, wo spielt es?",
      "Ergänze die drei Bausteine: Licht (z. B. „warmes Abendlicht“), Stil (z. B. „fotorealistisch“) und Perspektive (z. B. „von unten“ oder „Nahaufnahme“).",
      "Schicke den Prompt an ChatGPT oder Gemini und vergleiche das Ergebnis mit deiner Vorstellung.",
      "Gefällt dir etwas nicht, ändere genau ein Wort (z. B. das Licht) und schicke ihn nochmal – so lernst du, welcher Baustein was bewirkt.",
      "Gute Prompts, die dir gefallen, in einer Notiz speichern – sie sind deine persönlichen Vorlagen fürs nächste Mal.",
    ],
    promptLabel: "Kopierfertige Vorlagen – zwei Beispiele aus dem Beitrag",
    prompt: `Hund im Abendlicht (Motiv + Licht + Stil + Perspektive):
Ein Golden Retriever mitten im Sprung, fängt einen roten Tennisball
mit dem Maul, Wassertropfen spritzen, in einem Stadtpark bei
Sonnenuntergang. Tief stehende goldene Sonne hinter dem Hund,
leuchtender Rand um sein Fell, unscharfer Hintergrund. Von unten
aus Bodennähe fotografiert, Sportfotografie, fotorealistisch.

Kaffee-Stillleben (Stimmung durch Licht):
Eine Keramik-Espressotasse auf einem rustikalen dunklen Eichentisch,
dünne Dampfwolken steigen auf. Ein einzelner warmer Sonnenstrahl
vom Fenster links lässt den Dampf leuchten, tiefe Schatten rechts.
Makro-Aufnahme, zurückhaltende Food-Fotografie, fotorealistisch.`,
    note: "Die 5 Fehler im Überblick: 1) zu kurzer Prompt, 2) kein Licht angegeben, 3) keinen Stil angegeben, 4) nach dem ersten Versuch aufgeben, 5) keine Perspektive angegeben. Die Beispiele stammen aus dem Beitrag; die Formel Motiv + Licht + Stil + Perspektive gilt für alle Bild-Tools.",
    unverified:
      "Praxis-Tipp aus einem kleinen Community-Account, nicht aus einer redaktionellen Quelle.",
    sources: [
      {
        label:
          "Instagram @machmalmitki – BILDER MIT KI: 5 FEHLER, DIE jeder ANFÄNGER MACHT (05.11.2026)",
        url: "https://www.instagram.com/p/DfXo7wUjGJM/",
      },
    ],
  },
];
