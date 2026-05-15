import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  /**
   * Tailwind-Klassen-Override. Konflikte mit dem Default-Style werden via
   * twMerge sauber aufgelöst — z.B. `className="bg-transparent text-[var(--color-terracotta-deep)]"`
   * überschreibt das Default-`bg-secondary text-muted-foreground`.
   */
  className?: string;
  /**
   * Visual-Variant (Audit #29c):
   * - "default"   = Standard mit sichtbarem Background.
   * - "ghost"     = ohne Background, nur Text, in einem THEME-folgenden
   *                 Container (z.B. `bg-[#faf8f5] dark:bg-card`-Card) →
   *                 theme-aware Farben (deep@light / bright@dark).
   * - "ghost-dark" = ohne Background, in einem IMMER-dunklen Container
   *                 (Code-Block, `bg-black/30`, `bg-[#3a2f28]`) →
   *                 theme-UNABHÄNGIGE on-dark-Farben. Vorher fälschlich
   *                 auch "ghost" → Light-Mode-Pfad (deep) auf dunklem
   *                 Code-bg = CR 2.7 (fail).
   */
  variant?: "default" | "ghost" | "ghost-dark";
}

export function CopyButton({ text, className, variant = "default" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Audit #29c: Zwei ghost-Kontexte sauber getrennt.
  //  - ghost      → theme-aware (Card folgt Document-Theme): deep@light,
  //                 bright@dark. Korrekt für `bg-[#faf8f5] dark:bg-card`.
  //  - ghost-dark → theme-UNABHÄNGIG (Code-bg immer dunkel): on-dark-
  //                 Tokens, CR ≥4.98 auf #3a2f28..#29211c.
  // Werte in client/src/index.css.
  const variantStyles =
    variant === "ghost"
      ? "bg-transparent hover:bg-transparent text-[var(--color-terracotta-deep)] hover:text-[var(--color-terracotta-deep-hover)] dark:text-[var(--color-terracotta-bright)] dark:hover:text-[var(--color-terracotta-bright-hover)]"
      : variant === "ghost-dark"
        ? "bg-transparent hover:bg-transparent text-[var(--color-terracotta-on-dark)] hover:text-[var(--color-terracotta-on-dark-hover)]"
        : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground";

  // 2026-05-13 Audit Finding #6: aria-label + visually-hidden live-region
  // damit Screen-Reader den Wechsel von "Kopieren" zu "Kopiert!" mitbekommen
  // (title-Attribut wird nicht universell von SRs gelesen).
  // Audit Finding #12: Touch-Target ≥36px (kompromiss zwischen WCAG AA-Min
  // 24px und AAA-Empfehlung 44px). Ghost-Variant bleibt schmal weil dort
  // der Akzent-Look gewollt ist (FinancialAnalyst-Inline-Pattern).
  return (
    <>
      <button
        onClick={handleCopy}
        type="button"
        aria-label={copied ? "Text wurde kopiert" : "In Zwischenablage kopieren"}
        className={cn(
          "inline-flex items-center justify-center gap-1 px-3 py-1.5 min-h-[36px] rounded text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-1",
          (variant === "ghost" || variant === "ghost-dark") && "px-2 py-1 min-h-0",
          copied
            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
            : variantStyles,
          className,
        )}
        title="In Zwischenablage kopieren"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" aria-hidden="true" />
            Kopiert!
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" aria-hidden="true" />
            Kopieren
          </>
        )}
      </button>
      {/* Visually-hidden status region für Screen-Reader-Announce */}
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "In Zwischenablage kopiert" : ""}
      </span>
    </>
  );
}
