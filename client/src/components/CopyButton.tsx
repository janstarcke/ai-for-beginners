import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  /**
   * Tailwind-Klassen-Override. Konflikte mit dem Default-Style werden via
   * twMerge sauber aufgelöst — z.B. `className="bg-transparent text-[#c4704b]"`
   * überschreibt das Default-`bg-secondary text-muted-foreground`.
   */
  className?: string;
  /**
   * Visual-Variant. "default" = Standard mit Background, "ghost" = ohne
   * Background, nur Text — passt z.B. neben dunklem Code-Block.
   */
  variant?: "default" | "ghost";
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

  // 2026-05-13 Audit Finding #5/#15: Ghost-Variant nutzt CSS-Variablen statt
  // Hex-Hardcode. Werte in client/src/index.css definiert:
  //   --color-terracotta-deep        (Light-Default, ~4.5:1 auf hellem BG)
  //   --color-terracotta-deep-hover  (Light-Hover, dunkler)
  //   --color-terracotta-bright      (Dark-Default, hell auf dunklem BG)
  //   --color-terracotta-bright-hover (Dark-Hover, noch heller)
  const variantStyles =
    variant === "ghost"
      ? "bg-transparent hover:bg-transparent text-[var(--color-terracotta-deep)] hover:text-[var(--color-terracotta-deep-hover)] dark:text-[var(--color-terracotta-bright)] dark:hover:text-[var(--color-terracotta-bright-hover)]"
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
          variant === "ghost" && "px-2 py-1 min-h-0",
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
