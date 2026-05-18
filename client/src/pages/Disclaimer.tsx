import LegalLayout, { LegalH2 } from "@/components/LegalLayout";

export default function Disclaimer() {
  return (
    <LegalLayout
      kicker="§02 · Disclaimer"
      title="Nutzungshinweis"
      updated="18. Mai 2026"
    >
      <LegalH2>Bildungs- und Showcase-Charakter</LegalH2>
      <p>
        „AI for Beginners“ ist ein privates, nicht-kommerzielles Bildungs- und
        Showcase-Projekt. Die Inhalte dienen ausschließlich Informations- und
        Lernzwecken sowie als Referenz für die Tätigkeit des Betreibers im
        Bereich KI.
      </p>

      <LegalH2>Kein offizielles Anthropic-Angebot</LegalH2>
      <p>
        Diese Website steht in keiner Verbindung zu Anthropic und wird nicht von
        Anthropic betrieben, autorisiert oder unterstützt. „Claude“, „Claude
        Code“ und weitere genannte Produkt- und Markennamen sind Eigentum der
        jeweiligen Rechteinhaber und werden hier ausschließlich beschreibend
        verwendet.
      </p>

      <LegalH2>Keine Gewähr für Inhalte</LegalH2>
      <p>
        Die Inhalte werden mit Sorgfalt erstellt, beziehen sich jedoch auf
        sich schnell verändernde Werkzeuge und Schnittstellen. Für
        Vollständigkeit, Aktualität und Richtigkeit wird keine Gewähr
        übernommen. Befehle, Konfigurationen und Empfehlungen sind vor dem
        Einsatz eigenverantwortlich zu prüfen.
      </p>

      <LegalH2>Haftung für externe Links</LegalH2>
      <p>
        Trotz sorgfältiger inhaltlicher Kontrolle wird keine Haftung für die
        Inhalte externer Links übernommen. Für den Inhalt der verlinkten Seiten
        sind ausschließlich deren Betreiber verantwortlich.
      </p>

      <LegalH2>Haftung</LegalH2>
      <p>
        Eine Haftung für Schäden oder Entscheidungen, die auf Basis der hier
        bereitgestellten Informationen getroffen werden, ist – soweit gesetzlich
        zulässig – ausgeschlossen.
      </p>
    </LegalLayout>
  );
}
