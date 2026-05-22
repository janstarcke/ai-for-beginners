import { useConsent } from '@/contexts/ConsentContext';
import { Button } from '@/components/ui/button';

/**
 * DSGVO-konformer Opt-in-Cookie-Banner. Erscheint nur wenn ConsentContext.bannerVisible
 * = true. Über useConsent.openSettings() jederzeit re-öffenbar (Footer-Button).
 *
 * Styling nutzt shadcn/Tailwind-Tokens — wird in beiden Themes (Light + Dark) sauber.
 */
export default function ConsentBanner() {
  const { bannerVisible, accept, decline, closeSettings, decided } =
    useConsent();
  if (!bannerVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einwilligung"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 rounded-xl border bg-card text-card-foreground shadow-lg p-4 sm:p-5"
    >
      {decided && (
        <button
          onClick={closeSettings}
          aria-label="Schließen"
          className="absolute top-2 right-3 text-muted-foreground hover:text-foreground transition-colors text-sm leading-none"
          type="button"
        >
          ✕
        </button>
      )}
      <p className="text-sm leading-relaxed">
        Wir nutzen Google Analytics, um die Nutzung dieser Seite anonymisiert
        zu verstehen — nur mit deiner Einwilligung. Details in der{' '}
        <a
          href="/datenschutz"
          className="text-primary underline underline-offset-2"
        >
          Datenschutzerklärung
        </a>
        .
      </p>
      <div className="mt-4 flex gap-2 flex-wrap">
        <Button onClick={accept} size="sm">
          Akzeptieren
        </Button>
        <Button onClick={decline} size="sm" variant="outline">
          Ablehnen
        </Button>
      </div>
    </div>
  );
}
