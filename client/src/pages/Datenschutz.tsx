import LegalLayout, { LegalH2 } from "@/components/LegalLayout";
import { useConsent } from "@/contexts/ConsentContext";
import { Button } from "@/components/ui/button";

export default function Datenschutz() {
  const { openSettings } = useConsent();
  return (
    <LegalLayout
      kicker="§03 · Datenschutz"
      title="Datenschutzerklärung"
      updated="22. Mai 2026"
    >
      <LegalH2>1. Verantwortlicher</LegalH2>
      <p>
        Jan Starcke, Heidblick 4a, 21149 Hamburg.
        <br />
        Kontakt: <a href="mailto:jan@starcke.io">jan@starcke.io</a>
      </p>

      <LegalH2>2. Charakter der Website</LegalH2>
      <p>
        Diese Website ist eine rein informative, statische Wissensdatenbank. Es
        gibt keine Benutzerkonten, keine Anmeldung, keine Kommentar- oder
        Upload-Funktionen und keine kommerziellen Angebote. Webanalyse mit
        Google Analytics 4 wird ausschließlich nach ausdrücklicher
        Einwilligung über das Cookie-Banner aktiviert (siehe §7).
      </p>

      <LegalH2>3. Server-Logfiles</LegalH2>
      <p>
        Beim Aufruf der Seiten werden durch den Webserver automatisch technische
        Zugriffsdaten verarbeitet (IP-Adresse, Datum/Uhrzeit, abgerufene URL,
        Referrer, User-Agent). Diese Daten sind technisch erforderlich, um die
        Website auszuliefern und ihre Stabilität und Sicherheit zu
        gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
        (berechtigtes Interesse am sicheren Betrieb). Eine Zusammenführung mit
        anderen Daten oder eine Profilbildung findet nicht statt; die Logs
        werden kurzfristig automatisch gelöscht.
      </p>

      <LegalH2>4. Hosting</LegalH2>
      <p>
        Die Website wird bei der Hetzner Online GmbH, Industriestr. 25, 91710
        Gunzenhausen, Deutschland, auf Servern innerhalb der EU betrieben. Es
        besteht ein Auftragsverarbeitungsvertrag (AVV) gemäß Art. 28 DSGVO. Ein
        Drittlandtransfer findet im Rahmen des Hostings nicht statt.
      </p>

      <LegalH2>5. Schriftarten</LegalH2>
      <p>
        Die verwendeten Schriftarten „Playfair Display“ und „DM Sans“ werden
        ausschließlich lokal vom Server dieser Website ausgeliefert (selbst
        gehostet). Es besteht keine Verbindung zu Servern von Google oder
        anderen Dritten, und es werden keine Daten – insbesondere nicht die
        IP-Adresse des Besuchers – an Google oder Dritte übertragen.
      </p>

      <LegalH2>6. Cookies & lokale Speicherung</LegalH2>
      <p>
        Technisch notwendige Funktionen (Hell-/Dunkel-Modus,
        Lese-/Fortschritts-Markierungen, Ausblenden von Hinweisen, Speichern
        der Cookie-Entscheidung) nutzen ausschließlich den lokalen Speicher des
        Browsers (localStorage). Diese Daten verbleiben auf dem Gerät, werden
        nicht an den Server oder Dritte übertragen; eine Einwilligung ist nach
        § 25 Abs. 2 TTDSG nicht erforderlich.
      </p>
      <p>
        Optionale Cookies (Google Analytics, siehe §7) werden ausschließlich
        nach ausdrücklicher Einwilligung gesetzt und tragen Namen wie{" "}
        <code>_ga</code> und <code>_ga_*</code>. Bei Ablehnung oder Widerruf
        werden diese Cookies sofort gelöscht.
      </p>

      <LegalH2>7. Webanalyse (Google Analytics 4)</LegalH2>
      <p>
        Diese Website nutzt Google Analytics 4 (Anbieter: Google Ireland Ltd.,
        Gordon House, Barrow Street, Dublin 4, Irland) zur statistischen
        Analyse des Nutzungsverhaltens — ausschließlich nach Ihrer
        ausdrücklichen Einwilligung über das Cookie-Banner. Rechtsgrundlage ist
        Art. 6 Abs. 1 lit. a DSGVO sowie § 25 Abs. 1 TTDSG.
      </p>
      <p>
        Verarbeitet werden anonymisierte technische Daten zur Seitennutzung
        (besuchte Seiten, Verweildauer, gekürzte IP-Adresse via{" "}
        <code>anonymize_ip</code>). Eine Zusammenführung mit personenbezogenen
        Daten findet nicht statt. Ohne Einwilligung wird kein Google-Skript
        geladen und kein Cookie gesetzt (Google Consent Mode v2 deny-by-default).
      </p>
      <p>
        Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
        widerrufen:
      </p>
      <p>
        <Button
          onClick={openSettings}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          Cookie-Einstellungen ändern
        </Button>
      </p>
      <p className="mt-3">
        Da Google ein US-Anbieter ist, kann es zu einem Drittlandtransfer in
        die USA kommen. Google ist unter dem EU-U.S. Data Privacy Framework
        zertifiziert (Angemessenheitsbeschluss der EU-Kommission vom
        10.07.2023, Art. 45 DSGVO). Weitere Informationen:{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          policies.google.com/privacy
        </a>
        .
      </p>

      <LegalH2>8. Externe Links</LegalH2>
      <p>
        Diese Website verlinkt auf externe Seiten (z. B. Dokumentationen,
        GitHub-Repositories). Beim Anklicken solcher Links gelten die
        Datenschutzbestimmungen der jeweiligen Anbieter; auf deren
        Datenverarbeitung besteht kein Einfluss.
      </p>

      <LegalH2>9. Betroffenenrechte</LegalH2>
      <p>
        Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art.
        16), Löschung (Art. 17), Einschränkung (Art. 18),
        Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21). Anfragen
        richten Sie bitte an{" "}
        <a href="mailto:jan@starcke.io">jan@starcke.io</a>.
      </p>

      <LegalH2>10. Beschwerderecht</LegalH2>
      <p>
        Sie können sich bei der zuständigen Aufsichtsbehörde beschweren: Der
        Hamburgische Beauftragte für Datenschutz und Informationsfreiheit,
        Ludwig-Erhard-Str. 22, 20459 Hamburg.
      </p>

      <LegalH2>11. Stand</LegalH2>
      <p>22. Mai 2026.</p>
    </LegalLayout>
  );
}
