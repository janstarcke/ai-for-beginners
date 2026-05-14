/**
 * CodeBlock — Multi-line Code-Snippet mit Syntax-Highlighting + Copy-Button.
 *
 * Verwendung:
 *   <CodeBlock code="pnpm install\npnpm dev" language="bash" filename="terminal" />
 *
 * Sprachen: bash | tsx | ts | json | jsx | js | markup
 * Default-Sprache: "bash"
 *
 * Theme: zwei eigene Inline-Themes (light = Sepia, dark = Cream-on-Espresso).
 * Bewusst kein prism-react-renderer-Default-Theme, weil keines zum Vintage-
 * Look passt. Dark-Theme nutzt warm-cream Töne, damit Kontrast auf dem
 * Espresso-Hintergrund stark genug ist (das initiale Sepia-Theme war im
 * Nachtmodus praktisch unlesbar — dunkles Braun auf dunklem Braun).
 */

import { Highlight, type PrismTheme } from "prism-react-renderer";
import { useTheme } from "@/contexts/ThemeContext";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: "bash" | "tsx" | "ts" | "json" | "jsx" | "js" | "markup";
  filename?: string;
  className?: string;
}

/** Light-Mode: dunkle Token auf hellem Sepia-Background. */
const lightTheme: PrismTheme = {
  plain: {
    color: "#3a2f28",
    backgroundColor: "transparent",
  },
  styles: [
    // 2026-05-13 Audit Finding #4: Comment-Token von #a89a8a (2.42:1) auf #7a6a5a
    // (4.59:1) angehoben — WCAG AA für Normal-Text auf hellem Sepia-BG.
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#7a6a5a", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#5a4a3a" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"], style: { color: "#b8542a" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#4a5a30" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#b8542a" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#a04030" } },
    { types: ["function", "class-name"], style: { color: "#a04030", fontWeight: "bold" } },
    { types: ["regex", "important"], style: { color: "#b8542a" } },
  ],
};

/** Dark-Mode: helle Cream-Töne auf dunklem Espresso-Background. */
const darkTheme: PrismTheme = {
  plain: {
    color: "#f0e6d6",
    backgroundColor: "transparent",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#9a8e7a", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#c0b4a0" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"], style: { color: "#f0a070" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#b8d088" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#f0a070" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#ff8870" } },
    { types: ["function", "class-name"], style: { color: "#ff8870", fontWeight: "bold" } },
    { types: ["regex", "important"], style: { color: "#f0a070" } },
  ],
};

export function CodeBlock({ code, language = "bash", filename, className = "" }: CodeBlockProps) {
  const { theme } = useTheme();
  const trimmed = code.replace(/^\n+|\n+$/g, "");
  const activeTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <div
      className={`group relative my-3 overflow-hidden rounded-lg border border-[#3a2f28]/10 dark:border-[#f5f0eb]/15 bg-[#f5f0eb]/40 dark:bg-[#1a1512]/80 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#3a2f28]/10 dark:border-[#f5f0eb]/15 px-3 py-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#3a2f28]/75 dark:text-[#f0e6d6]/70">
          {filename ?? language}
        </span>
        <CopyButton text={trimmed} />
      </div>
      <Highlight code={trimmed} language={language} theme={activeTheme}>
        {({ className: prismClass, style, tokens, getLineProps, getTokenProps }) => (
          // Audit Finding #23: tabIndex=0 + role="region" + aria-label
          // damit Keyboard-User den scrollbaren Container fokussieren und
          // horizontal scrollen können (WCAG 2.1.1 Keyboard-Operable).
          <pre
            tabIndex={0}
            role="region"
            aria-label={`Code-Block: ${filename ?? language}`}
            className={`${prismClass} overflow-x-auto p-3 text-xs leading-relaxed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-terracotta)] focus-visible:ring-inset`}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
