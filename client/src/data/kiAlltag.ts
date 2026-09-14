/**
 * KI im Alltag — Consumer-KI-Themen für absolute Einsteiger.
 *
 * Bewusst getrennt von `skills.ts`: Dort leben Claude-Code- und Vibe-Coding-
 * Skills (zeitlos, ohne Datum, ohne Quellenangabe). Hier leben Alltags-Themen
 * rund um ChatGPT, Gemini und die Claude-Apps — datiert, mit Quelle, und für
 * Leser ohne Entwickler-Hintergrund.
 *
 * Redaktionsregeln für diese Datei:
 * 1. `kind: "news"` bekommt IMMER ein Datum und mindestens eine Quelle mit URL.
 *    Keine Quelle verifizierbar → das Thema wird nicht als News geführt.
 * 2. `kind: "fundus"` (zeitlose Prompt-Idee) und `kind: "praxis"` (allgemeine
 *    Technik) tragen kein Datum und werden nie als Neuigkeit dargestellt.
 * 3. Fehlt eine belastbare Quelle, steht das als `unverified`-Hinweis sichtbar
 *    auf der Karte. Es werden keine Quellen erfunden und keine leeren
 *    Platzhalter veröffentlicht.
 * 4. Prompts stehen in `prompt` und werden als kopierfertiger Codeblock
 *    gerendert — nie als Fließtext.
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
  /** Optional: sichtbarer Hinweis, dass keine belastbare Quelle existiert. */
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
    title: "GPT-6 Astra: neues ChatGPT-Modell",
    kind: "news",
    tool: "ChatGPT",
    date: "2026-09-03",
    dateLabel: "03.09.2026",
    what: "OpenAI hat Anfang September das Modell GPT-6 Astra vorgestellt und in Stufen ausgerollt: erst für ausgewählte Organisationen, dann für die zahlenden ChatGPT-Pläne Plus, Pro, Business und Enterprise. OpenAI nennt es das bislang leistungsfähigste Modell des Hauses.",
    why: "Wenn du ein Abo hast, musst du nichts installieren — das Modell taucht von selbst in der Modell-Auswahl oben im Chat auf. Ein Klick, und du arbeitest mit der neuesten Version.",
    steps: [
      "ChatGPT öffnen und oben auf den Modell-Namen tippen.",
      "Erscheint „GPT-6 Astra“ in der Liste, auswählen.",
      "Taucht es noch nicht auf: ein paar Tage warten — der Rollout läuft gestaffelt.",
    ],
    note: "Im Gratis-Konto ist das Modell nicht enthalten. Der Rollout begann am 3. September für einen kleinen Kreis, die breite Verfügbarkeit folgte in den Tagen danach.",
    sources: [
      {
        label: "Axios: OpenAI releases new model GPT-6 Astra",
        url: "https://www.axios.com/2026/09/03/openai-astra-gpt-6-agi-brockman",
      },
      {
        label: "CNBC: OpenAI announces rollout of GPT-6 Astra model",
        url: "https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html",
      },
    ],
  },
  {
    id: 2,
    title: "ChatGPT Images 2.5: Bilder aus einer Skizze",
    kind: "news",
    tool: "ChatGPT",
    date: "2026-09-08",
    dateLabel: "08.09.2026",
    what: "OpenAI hat das Bildmodell auf Images 2.5 aktualisiert. Neu ist Sketch: Du tippst @Sketch in den Chat, zeichnest direkt in ChatGPT eine grobe Skizze, und das Modell nimmt diese Zeichnung als Vorlage für das fertige Bild. Dazu kommen natürlicheres Licht, bessere Ähnlichkeit bei Personen aus hochgeladenen Fotos und zuverlässigeres Nachbearbeiten über mehrere Runden.",
    why: "Du musst kein Prompt-Profi sein. Wenn dir die Worte fehlen, zeichnest du eben, wo was hin soll — ein paar Striche reichen als Ausgangspunkt.",
    steps: [
      "In ChatGPT einen neuen Chat öffnen.",
      "@Sketch tippen — die Zeichenfläche öffnet sich.",
      "Grob skizzieren, was wohin gehört.",
      "In einem Satz beschreiben, was daraus werden soll.",
      "Ergebnis anschauen und einzelne Details per Nachfrage ändern.",
    ],
    note: "Die Aktualisierung gilt für alle Stufen in ChatGPT, ChatGPT Work und Codex — auf Desktop, Mobil und im Web.",
    sources: [
      {
        label: "OpenAI: Introducing ChatGPT Images 2.5",
        url: "https://openai.com/index/introducing-chatgpt-images-2-5/",
      },
    ],
  },
  {
    id: 3,
    title: "ChatGPT liest direkt aus Dropbox, Box und SharePoint",
    kind: "news",
    tool: "ChatGPT",
    date: "2026-09-10",
    dateLabel: "10.09.2026",
    what: "Neben Google Drive lassen sich jetzt auch Box, Dropbox und SharePoint mit der ChatGPT-Bibliothek verbinden. Du durchsuchst deinen Cloud-Speicher direkt im Chat und holst Dateien oder ganze Ordner über „Aus Bibliothek hinzufügen“ oder eine @-Erwähnung ins Gespräch — ohne sie vorher herunter- und wieder hochzuladen.",
    why: "Der lästige Umweg entfällt. Verträge, PDFs, Rechnungen und Präsentationen bleiben liegen, wo sie liegen. Die Datei öffnet sich neben der Unterhaltung, und ChatGPT kann sie zusammenfassen, analysieren, vergleichen oder über einen ganzen Ordner hinweg arbeiten — mit Verweisen, die zurück zur Originaldatei führen.",
    steps: [
      "ChatGPT im Browser öffnen → Einstellungen → verbundene Apps bzw. Bibliothek.",
      "Box, Dropbox oder SharePoint verbinden und den Zugriff erlauben.",
      "Im Chat auf „Datei hinzufügen“ → „Aus Bibliothek hinzufügen“ — oder die App per @-Erwähnung ansprechen.",
      "Datei oder Ordner auswählen und einfach fragen.",
    ],
    promptLabel: "Zwei Fragen zum Ausprobieren",
    prompt: `Fasse dieses PDF in 5 Stichpunkten zusammen.

Vergleiche diese beiden Verträge und zeige mir die
Unterschiede in einer Tabelle.`,
    note: "Der Rollout läuft im Web (Chat und Work) für die Pläne Go, Plus, Pro, Business, Edu, Healthcare und Enterprise. Mobile Unterstützung folgt. Bestehende Dateirechte bleiben unverändert gültig. Siehst du die Option noch nicht, warte ein paar Tage — die Verfügbarkeit kann je nach Region abweichen.",
    sources: [
      {
        label: "OpenAI Help Center: ChatGPT Release Notes",
        url: "https://help.openai.com/en/articles/6825453-chatgpt-release-notes",
      },
    ],
  },
  {
    id: 4,
    title: "Gemini als Windows-App: Alt + Leertaste",
    kind: "news",
    tool: "Gemini",
    date: "2026-09-10",
    dateLabel: "10.09.2026",
    what: "Google hat eine eigene Gemini-App für Windows 10 und 11 veröffentlicht; für macOS gab es sie schon länger. Sie ist kostenlos. Ein Tastendruck — Alt + Leertaste — legt Gemini als kleines Fenster über alles, was gerade offen ist: Text prüfen, Entwurf aufpolieren, Ideen sammeln, Bilder mit Nano Banana erzeugen. Alles synchronisiert sich über dein Google-Konto mit Handy und Web.",
    why: "Kein Browser-Tab mehr, kein Fenster-Wechsel. Du bleibst in dem Dokument, an dem du gerade arbeitest, und holst dir Hilfe per Tastenkürzel dazu.",
    steps: [
      "Auf gemini.google/desktop gehen und „Download for Windows“ wählen.",
      "Die heruntergeladene Datei installieren.",
      "Mit deinem Google-Konto anmelden.",
      "Alt + Leertaste drücken — Gemini erscheint über dem aktuellen Fenster.",
      "Frage stellen, zum Beispiel: „Fasse diesen Text in drei Sätzen zusammen.“",
    ],
    note: "Der Agent „Gemini Spark“ für Mehr-Schritt-Aufträge fehlt in der Windows-App vollständig — er läuft nur in der Mobil-App, der Mac-App und im Web, und ist im Europäischen Wirtschaftsraum, in der Schweiz, in Großbritannien und in Nigeria ohnehin nicht verfügbar. Die normale Chat-Funktion läuft ohne Abo. Und: Die App rechnet in Googles Cloud, nicht auf deinem Rechner.",
    sources: [
      {
        label: "Google: The Gemini app is now available for Windows",
        url: "https://blog.google/innovation-and-ai/products/gemini-app/gemini-app-now-on-windows/",
      },
      {
        label: "Google Workspace Updates: Gemini desktop app for Windows",
        url: "https://workspaceupdates.googleblog.com/2026/09/the-gemini-desktop-app-is-now-available-for-Windows.html",
      },
      {
        label: "Notebookcheck: Gemini for Windows launches without Spark",
        url: "https://www.notebookcheck.net/Gemini-for-Windows-launches-without-Google-s-Spark-agent.1396835.0.html",
      },
    ],
  },
  {
    id: 5,
    title: "Gemini Daily Brief wird für Gratis-Konten geöffnet",
    kind: "news",
    tool: "Gemini",
    date: "2026-09-08",
    dateLabel: "08.09.2026",
    what: "Die morgendliche Zusammenfassung von Gemini fasst Termine, E-Mails und offene Punkte aus Gmail, Google Kalender und deinen Gemini-Chats zusammen. Bisher war dafür ein Abo nötig (Google AI Plus, Pro oder Ultra) — Google hat diese Hürde jetzt entfernt.",
    why: "Ein Blick am Morgen statt drei Apps durchklicken: was heute ansteht, was dringend ist, was als Nächstes sinnvoll wäre.",
    note: "Wichtig für deutsche Leser: Die Öffnung gilt vorerst nur für Konten in den USA und nur auf Englisch. In Deutschland ist die Funktion aktuell nicht nutzbar — auch nicht mit Abo. Der Rollout läuft zudem schrittweise.",
    sources: [
      {
        label: "9to5Google: Gemini app makes Daily Brief free in the US",
        url: "https://9to5google.com/2026/09/08/gemini-daily-brief-free/",
      },
    ],
  },
  {
    id: 6,
    title: "Gemini merkt sich, wo du Dinge hingelegt hast",
    kind: "news",
    tool: "Gemini",
    date: "2026-09-01",
    dateLabel: "01.09.2026",
    what: "Mit dem September-Update für Android können Gemini und die App „Find Hub“ sich Ablageorte merken — auch für Dinge ohne Tracker-Anhänger. Du sagst es per Sprachbefehl, optional mit Foto, und findest den Eintrag später im neuen Reiter „Gemerkt“ in Find Hub wieder oder fragst einfach per Sprache nach.",
    why: "Eine Gedächtnisstütze für genau die Sachen, die man ein Mal im Jahr braucht und nie wiederfindet: Reisepass, Zweitschlüssel, Ladekabel. Ganz ohne Tippen.",
    promptLabel: "So sprichst du es ein",
    prompt: `Hey Google, merk dir in Find Hub, dass mein Reisepass
in der Schreibtischschublade liegt.

Hey Google, wo liegt mein Reisepass?`,
    note: "Der Zusatz „in Find Hub“ gehört in den Satz — sonst landet die Notiz nicht am richtigen Ort. Voraussetzung ist Android 16 oder neuer, in Ländern, in denen sowohl Gemini als auch Find Hub verfügbar sind.",
    sources: [
      {
        label: "9to5Google: September 2026 Android Drop",
        url: "https://9to5google.com/2026/09/01/september-2026-android-drop/",
      },
    ],
  },
  {
    id: 7,
    title: "Gemini-Seitenleiste arbeitet app-übergreifend",
    kind: "news",
    tool: "Gemini",
    date: "2026-09-02",
    dateLabel: "ab 02.09.2026",
    what: "Bisher konnte die Gemini-Seitenleiste in jeder Google-App nur das, wofür die App da war: Dokumente in Docs, Tabellen in Sheets. Jetzt beherrschen alle Seitenleisten dasselbe — in Gmail, Docs, Drive, Slides und Chat. Du kannst aus Gmail heraus ein Strategiepapier als Dokument anlegen oder aus Docs heraus eine E-Mail zur Abstimmung verschicken.",
    why: "Weniger Hin-und-her-Kopieren zwischen Apps. Du bleibst dort, wo die Aufgabe entstanden ist, statt vorher in die „richtige“ App zu wechseln.",
    note: "Das betrifft Google-Workspace-Konten mit Zugriff auf die Gemini-Seitenleiste bzw. „Ask Gemini“ — nicht die privaten Abos Google AI Pro oder Ultra. Der Rollout läuft schrittweise.",
    sources: [
      {
        label:
          "9to5Google: Google upgrades all Gemini side panels in Workspace",
        url: "https://9to5google.com/2026/09/09/gemini-workspace-side-panel-upgrade/",
      },
    ],
  },
  {
    id: 8,
    title: "Claude läuft jetzt auf Apple CarPlay",
    kind: "news",
    tool: "Claude",
    date: "2026-09-04",
    dateLabel: "04.09.2026",
    what: "Die Claude-App fürs iPhone unterstützt CarPlay. Im Auto tippst du auf das Claude-Symbol im Display, startest eine freihändige Unterhaltung und sprichst mit Claude — mit Anzeige, wann zugehört und wann gesprochen wird, plus Knöpfen für stumm schalten und beenden. Claude ist damit nach ChatGPT, Perplexity, Grok und Meta AI der fünfte Chatbot im CarPlay-Angebot.",
    why: "Fragen stellen oder Gedanken sortieren, ohne aufs Handy zu schauen — zum Beispiel auf dem Weg zum Termin.",
    note: "Claude kann dort ausschließlich sprechen: Fahrzeug- oder iPhone-Funktionen steuert es nicht, und ein Weckwort gibt es nicht — du musst die App im CarPlay-Menü selbst öffnen. Voraussetzung ist iOS 26.4 oder neuer, denn erst damit hat Apple fremde Chatbots in CarPlay erlaubt.",
    sources: [
      {
        label: "MacRumors: Anthropic's Claude Comes to CarPlay",
        url: "https://www.macrumors.com/2026/09/04/anthropics-claude-is-coming-to-carplay/",
      },
      {
        label: "9to5Mac: CarPlay now works with five major chatbot apps",
        url: "https://9to5mac.com/2026/09/04/carplay-now-works-with-five-major-chatbot-apps/",
      },
    ],
  },
  {
    id: 9,
    title: "Claude Fable 5.1 ist allgemein verfügbar",
    kind: "news",
    tool: "Claude",
    date: "2026-09-01",
    dateLabel: "01.09.2026",
    what: "Anthropic hat Claude Fable 5.1 freigegeben — die aktuelle Spitzen-Version, verfügbar über die Claude-API und die großen Cloud-Anbieter. Sie versteht Text und Bilder und arbeitet mit einem sehr großen Kontextfenster. Für Vielnutzer interessant: Das erneute Lesen bereits verarbeiteter Inhalte („Cache-Reads“) wurde um 75 Prozent günstiger.",
    why: "Für Einsteiger vor allem eine Einordnung: Fable 5.1 ist die stärkste und teuerste Stufe. Für Alltagsfragen ist sie selten nötig — dafür reichen die kleineren Modelle, die im Abo enthalten sind.",
    note: "Häufig falsch wiedergegeben: Fable 5.1 sei die Version „mit weniger Sicherheitsfiltern“. Das stimmt nicht — genau umgekehrt. Fable 5.1 ist die allgemein verfügbare Version mit den vollen Schutzmechanismen. Die Variante mit gelockerten Einschränkungen heißt Mythos 5.1 und ist ausschließlich für geprüfte Organisationen aus Cybersicherheit und Biowissenschaften zugänglich, nicht für Privatpersonen.",
    sources: [
      {
        label: "Anthropic: Introducing Claude Fable 5.1 and Claude Mythos 5.1",
        url: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
      },
    ],
  },
  {
    id: 10,
    title: "Der 1980er-Foto-Trend mit ChatGPT",
    kind: "news",
    tool: "ChatGPT",
    date: "2026-09-09",
    dateLabel: "Anfang September 2026",
    what: "Über Instagram-Reels und „Add Yours“-Sticker verbreitete sich Anfang September ein Trend: ein aktuelles Selfie hochladen und daraus ein Porträt im Stil der 1980er machen lassen — Frisur, Kleidung, Licht und Filmkorn ändern sich, das Gesicht bleibt. Der entscheidende Teil des Prompts ist die Anweisung, die Gesichtszüge unangetastet zu lassen.",
    why: "Der einfachste denkbare Einstieg in KI-Bildbearbeitung: ein Foto, ein Satz, fertig. Und man sieht sofort, wie stark eine einzelne präzise Anweisung das Ergebnis steuert.",
    promptLabel: "Prompt zum Kopieren",
    prompt: `Make me look like in 1980s without changing any facial features
and facial geometry`,
    note: "Bevor du loslegst: Ein hochgeladenes Selfie verlässt dein Gerät und wird beim Anbieter verarbeitet. Lade nur Bilder hoch, bei denen dir das recht ist — und keine Fotos anderer Personen ohne deren Einverständnis.",
    unverified:
      "Social-Media-Trend ohne offizielle Ankündigung — die Beobachtung stützt sich auf die Verbreitung auf Instagram, nicht auf eine Mitteilung von OpenAI.",
    sources: [],
  },

  /* ---------------------------------------------------------------- */
  /*  Zeitlos — Fundus- und Praxis-Tipps, ausdrücklich keine News      */
  /* ---------------------------------------------------------------- */
  {
    id: 11,
    title: "Die „Geheim-Codes“ für ChatGPT — was wirklich dahintersteckt",
    kind: "praxis",
    tool: "Allgemein",
    what: "Immer wieder gehen Reels und Infografiken viral, die geheime Codes für ChatGPT versprechen: TRUTHMODE, ELI10, REDTEAM, /human und so weiter. Offizielle Funktionen sind das nicht — OpenAI hat nie eine solche Befehlsliste veröffentlicht, und es wird nichts Verborgenes freigeschaltet. Sie wirken trotzdem oft, aber aus einem banalen Grund: Es sind schlicht kurze, klare Anweisungen. Genau deshalb kannst du sie auch einfach auf Deutsch ausschreiben.",
    why: "Anfänger glauben, ihnen fehle ein Trick. Tatsächlich reicht ein klarer Satz — und der funktioniert zuverlässiger als ein Codewort, das die KI vielleicht anders versteht als du.",
    table: {
      head: ["Statt Code …", "… schreib einfach"],
      rows: [
        [
          "TRUTHMODE",
          "Sei ehrlich und direkt. Kein Marketing-Sprech, keine Floskeln.",
        ],
        [
          "ELI5 / ELI10",
          "Erkläre es mir, als wäre ich zehn Jahre alt. Einfache Worte, ein Beispiel.",
        ],
        ["ALT 3", "Gib mir drei verschiedene Varianten zur Auswahl."],
        ["/PLAIN", "Antworte in einfachem Deutsch, ohne Fachbegriffe."],
        [
          "/HUMAN",
          "Schreib natürlich und menschlich, nicht wie ein Werbetext.",
        ],
        [
          "EXTENDTHINKING",
          "Nimm dir Zeit und denke Schritt für Schritt nach, bevor du antwortest.",
        ],
        [
          "REDTEAM / DEBATE",
          "Nenn mir die stärksten Gegenargumente und beide Seiten.",
        ],
        [
          "SWOT",
          "Zeig mir Stärken, Schwächen, Chancen und Risiken im Überblick.",
        ],
      ],
    },
    note: "Zwei Anweisungen sind besonders wertvoll, weil sie der KI die übliche Höflichkeit abgewöhnen: „Was übersehe ich dabei?“ und „Was ist der schlimmste Fall?“ — ans Ende der Frage gehängt.",
    unverified:
      "Praxis-Tipp ohne belastbare Einzelquelle. Die Codes stammen aus viralen Social-Media-Beiträgen, nicht aus der Dokumentation eines Anbieters.",
    sources: [],
  },
  {
    id: 12,
    title: "Delegieren statt halbe Fragen stellen",
    kind: "praxis",
    tool: "Allgemein",
    what: "Die wirksamste Grundregel beim Prompten: Gib der KI einen klaren Auftrag mit Rolle, Regeln, Grenzen und Ziel — statt eine halbe Frage zu stellen. Wer nur „Wie verdiene ich nebenbei Geld?“ fragt, bekommt eine Liste aus dem Internet. Wer vorher Fähigkeiten, verfügbare Stunden und Grenzen nennt, bekommt Vorschläge, die zu ihm passen.",
    why: "Eine der wenigen Techniken, die bei jedem Anbieter und jedem Thema sofort wirkt — und du merkst den Unterschied an der ersten Antwort.",
    promptLabel: "Die Grundformel",
    prompt: `Du bist mein [ROLLE]. Dein Job: [AUFGABE]. Regeln: [REGELN].
Grenzen: [GRENZEN]. Ziel: [GEWÜNSCHTES ERGEBNIS].
Frag nach, wenn dir Infos fehlen.`,
    note: "Der letzte Satz ist der wichtigste: Er erlaubt der KI, nachzufragen, statt zu raten.",
    sources: [],
  },
  {
    id: 13,
    title: "Angewandt: KI als Stratege für Nebeneinkünfte",
    kind: "praxis",
    tool: "Allgemein",
    what: "Eine Community-Vorlage, die die Delegier-Regel konkret macht. Die KI fragt dich zuerst aus — Fähigkeiten, Zeit, Grenzen — und schlägt danach genau drei Ideen vor, die du in dieser Woche starten kannst: je mit Kurzbeschreibung, wo der erste Kunde herkommt, einer ehrlichen Einschätzung der Nachfrage, einem Plan für Woche 1 und einer Messgröße.",
    why: "Ein gutes Übungsstück: Du siehst direkt, wie viel besser Antworten werden, wenn die KI erst Kontext bekommt — und das Ergebnis ist sofort umsetzbar.",
    promptLabel: "Vorlage zum Kopieren",
    prompt: `Agiere als mein Karriere-Stratege für Nebeneinkünfte.
Stelle mir zuerst diese Fragen und warte auf meine Antworten:
1. Meine beruflichen Fähigkeiten, Branche und Jahre an Erfahrung
2. Informelle Fähigkeiten, die ich im Job nutze (z. B. Kommunikation,
   Verhandeln, Verkaufen)
3. Informelle Fähigkeiten außerhalb des Jobs (z. B. Kochen, Musik,
   Schreiben, Malen)
4. Sprachen, Stadt, und wie viele Stunden pro Woche ich zur Verfügung habe
5. Was ich gerne lernen möchte und welche Grenzen ich habe
   (z. B. Familie, keine Sichtbarkeit in Social Media)

Schlage mir danach genau 3 Nebeneinkommens-Ideen vor, die ich noch diese
Woche starten kann. Zu jeder Idee liefere: eine einzeilige Beschreibung,
wo ich den ersten Kunden finde, eine ehrliche Einschätzung der Nachfrage,
einen konkreten Plan für Woche 1 und wie ich meinen Fortschritt messe.`,
    note: "Sei bei den Grenzen ehrlich („maximal 5 Stunden pro Woche, nichts mit Video“) — dann bleiben die Vorschläge realistisch. Und prüfe rechtliche und steuerliche Fragen selbst nach; die KI kennt deine Situation nicht.",
    unverified:
      "Community-Vorlage. Eine belastbare Einzelquelle ließ sich nicht verifizieren.",
    sources: [],
  },
  {
    id: 14,
    title: "Mach die KI zu deinem Privatlehrer",
    kind: "fundus",
    tool: "ChatGPT",
    what: "Ein viel geteilter Lern-Prompt: Statt sich alles auf einmal erklären zu lassen, wird die KI zum Tutor. Sie fragt erst, was du schon weißt, wie tief es gehen soll und wie viel Zeit du hast — und holt dich dann Schritt für Schritt ab, mit Quizfragen zwischendurch.",
    why: "Perfekt für alle, die ein Thema wirklich verstehen wollen, statt nur eine Antwort zu kopieren. Das Nachfragen am Anfang macht den Unterschied.",
    promptLabel: "Vorlage zum Kopieren",
    prompt: `Agiere als mein privater Tutor zum Thema [THEMA EINFÜGEN].
Frage mich zuerst: Was weiß ich schon darüber? Wie tief soll es gehen?
Und wie viel Zeit habe ich? Erstelle dann einen Lernplan und erkläre
Schritt für Schritt. Stelle mir zwischendurch Quizfragen und warte mit
dem nächsten Schritt, bis ich sage, dass ich bereit bin.`,
    sources: [
      {
        label: "Tom's Guide: This viral ChatGPT prompt can teach you anything",
        url: "https://www.tomsguide.com/ai/this-viral-chatgpt-prompt-can-teach-you-anything-and-im-officially-hooked",
      },
    ],
  },
  {
    id: 15,
    title: "Bessere KI-Bilder: Struktur schlägt Länge",
    kind: "praxis",
    tool: "Allgemein",
    what: "Bei Bild-Prompts entscheidet nicht die Länge über die Qualität, sondern die Gliederung. Ein strukturierter, in Schichten aufgebauter Prompt schlägt sowohl den knappen Zweiwort-Prompt als auch den langen Textwust. Und jeder Bildgenerator hat seine Eigenheiten: Midjourney mag kurze Stichworte mit Parametern, Nano Banana in Gemini ganze Sätze wie eine Kameraliste, der Bildgenerator in ChatGPT beschriftete Abschnitte.",
    why: "Statt „eine Katze“ beschreibst du strukturiert — und bekommst reproduzierbare Ergebnisse statt Zufallstreffer. Die Formel funktioniert überall gleich.",
    promptLabel: "Die 5-Schichten-Formel",
    prompt: `1. Motiv:    Wer oder was ist zu sehen? (konkret, z. B. "Mann Mitte 30,
             runde Brille")
2. Aktion:   Was tut die Person? (Pose, Ausdruck, z. B. "lächelt in die
             Kamera")
3. Umgebung: Wo, wann? (z. B. "Wohnzimmer, Abendlicht durchs Fenster")
4. Technik:  Kamera, Licht, Format (z. B. "Nahaufnahme,
             weiches Licht, 4:3")
5. Stil/No:  Wie soll es aussehen, was nicht? (z. B. "echtes 80er-Foto,
             körnig, keine Neon-Effekte, keine VHS-Störungen")`,
    note: "Die fünf Zeilen der Reihe nach ausfüllen und als Fließtext abschicken — in ChatGPT gern zusammen mit einem hochgeladenen Foto. Danach einzelne Schichten gezielt ändern: „Behalte alles, ändere nur das Licht auf Mittagssonne.“",
    sources: [
      {
        label: "Tech Insider: AI Image Prompts — 12-Step Guide for 5 Models",
        url: "https://tech-insider.org/how-to-write-ai-image-prompts-2026/",
      },
    ],
  },
  {
    id: 16,
    title: "Selbstreflexions-Prompts",
    kind: "fundus",
    tool: "Allgemein",
    what: "Zwei Fragen, die zeigen, was passiert, wenn eine KI sich an frühere Gespräche erinnert. Sie funktionieren nur dann interessant, wenn du den Dienst schon eine Weile nutzt und das Erinnerungs-Feature eingeschaltet ist.",
    why: "Ein anschaulicher Einstieg in das Thema Gedächtnis und Kontext — man begreift in einer Minute, was die KI über einen weiß und was nicht.",
    promptLabel: "Zwei Fragen zum Ausprobieren",
    prompt: `Was weißt du über mich, was ich selbst nicht weiß?

Stelle mir 5 Fragen, die mein zukünftiges Ich mir stellen würde.`,
    note: "Nimm die Antworten als Denkanstoß, nicht als Diagnose: Die KI liest aus vergangenen Chats und rät den Rest. Wenn du sehen willst, worauf sie sich stützt, frag direkt nach: „Woher weißt du das?“",
    unverified:
      "Zeitloser Fundus-Tipp ohne Quelle — eine Prompt-Idee, keine Neuigkeit.",
    sources: [],
  },
  {
    id: 17,
    title: "Anti-Ja-Sager: Widerspruch dauerhaft einstellen",
    kind: "fundus",
    tool: "Allgemein",
    what: "KI-Assistenten neigen zur Zustimmung. Statt das in jedem Chat neu zu bekämpfen, hinterlegst du es einmal dauerhaft in den persönlichen Anweisungen („Custom Instructions“) deines Dienstes — dann gilt es für jede künftige Unterhaltung.",
    why: "Schützt vor der üblichen Höflichkeits-Schleife und liefert ehrlichere Antworten. Der Unterschied zum Steuerwort: Das hier wirkt dauerhaft, nicht nur in einer Frage.",
    promptLabel: "In die persönlichen Anweisungen eintragen",
    prompt: `Widersprich mir, wenn du anderer Meinung bist. Spiele bewusst den
Teufelsadvokaten und nenne mir die stärksten Gegenargumente, bevor du
zustimmst. Sag mir offen, wenn eine Idee schwach ist oder wenn dir
Informationen fehlen. Keine Komplimente, keine Floskeln.`,
    note: "Zu finden meist unter Einstellungen → Personalisierung bzw. „Benutzerdefinierte Anweisungen“. Ergänzt sich gut mit den kurzen Steuerwörtern aus dem Geheim-Code-Thema.",
    unverified:
      "Zeitloser Fundus-Tipp ohne Quelle — eine Einstellungs-Idee, keine Neuigkeit.",
    sources: [],
  },
];
