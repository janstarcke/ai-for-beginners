import LegalLayout, { LegalH2 } from "@/components/LegalLayout";

export default function Datenschutz() {
  return (
    <LegalLayout
      kicker="§03 · Datenschutz"
      title="Datenschutzerklärung"
      updated="18. Mai 2026"
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
        Upload-Funktionen und keine kommerziellen Angebote. Es werden keine
        Tracking-, Analyse- oder Werbe-Technologien eingesetzt.
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
        Es werden keine Cookies gesetzt. Für reine Komfortfunktionen
        (Hell-/Dunkel-Modus, Lese-/Fortschritts-Markierungen, Ausblenden von
        Hinweisen) wird ausschließlich der lokale Speicher des Browsers
        (localStorage) genutzt. Diese Daten verbleiben auf dem Gerät, werden
        nicht an den Server oder Dritte übertragen und sind technisch notwendig
        für die jeweilige Funktion; eine Einwilligung ist nach § 25 Abs. 2 TTDSG
        nicht erforderlich.
      </p>

      <LegalH2>7. Webanalyse / Tracking</LegalH2>
      <p>
        Es findet keine Webanalyse und kein Tracking statt. Sollte dies künftig
        eingesetzt werden, wird diese Erklärung vorher aktualisiert und – sofern
        erforderlich – eine Einwilligung eingeholt.
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
      <p>18. Mai 2026.</p>
    </LegalLayout>
  );
}
