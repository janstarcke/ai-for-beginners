import LegalLayout, { LegalH2 } from "@/components/LegalLayout";

export default function Impressum() {
  return (
    <LegalLayout kicker="§01 · Impressum" title="Impressum" updated="18. Mai 2026">
      <LegalH2>Angaben gemäß § 5 DDG</LegalH2>
      <p>
        Jan Starcke
        <br />
        Heidblick 4a
        <br />
        21149 Hamburg
        <br />
        Deutschland
      </p>

      <LegalH2>Kontakt</LegalH2>
      <p>
        E-Mail: <a href="mailto:jan@starcke.io">jan@starcke.io</a>
      </p>

      <LegalH2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</LegalH2>
      <p>Jan Starcke (Anschrift wie oben)</p>

      <LegalH2>Hinweis</LegalH2>
      <p>
        „AI for Beginners“ ist ein privates, nicht-kommerzielles Bildungs- und
        Showcase-Projekt — eine kuratierte Wissensdatenbank rund um Claude Code
        und KI-gestütztes Arbeiten. Es handelt sich nicht um ein offizielles
        Angebot von Anthropic. „Claude“ und „Claude Code“ sind Marken von
        Anthropic; die Verwendung erfolgt rein beschreibend.
      </p>
    </LegalLayout>
  );
}
