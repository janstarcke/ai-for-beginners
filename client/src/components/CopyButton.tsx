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

  // 2026-05-13 Audit Finding #5: Ghost-Default-Text war #c4704b (3.22:1 auf
  // hellem BG, WCAG AA fail). Auf #a85d3e angehoben (≈4.5:1). Hover-State
  // bleibt im Bereich, aber noch dunkler für taktiles Feedback.
  const variantStyles =
    variant === "ghost"
      ? "bg-transparent hover:bg-transparent text-[#a85d3e] hover:text-[#8a4830] dark:text-[#d4825a] dark:hover:text-[#e89b76]"
      : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground";

  // 2026-05-13 Audit Finding #6: aria-label + visually-hidden live-region
  // damit Screen-Reader den Wechsel von "Kopieren" zu "Kopiert!" mitbekommen
  // (title-Attribut wird nicht universell von SRs gelesen).
  return (
    <>
      <button
        onClick={handleCopy}
        type="button"
        aria-label={copied ? "Text wurde kopiert" : "In Zwischenablage kopieren"}
        className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-offset-1",
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
