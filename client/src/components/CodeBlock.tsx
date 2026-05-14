/**
 * CodeBlock — Multi-line Code-Snippet mit Syntax-Highlighting + Copy-Button.
 *
 * Verwendung:
 *   <CodeBlock code="pnpm install\npnpm dev" language="bash" filename="terminal" />
 *
 * Sprachen: bash | tsx | ts | json | jsx | js | markup
 * Default-Sprache: "bash"
 *
 * Theme: eigenes Inline-Theme mit Sepia/Espresso-Tokens (Light + Dark via Tailwind).
 * Bewusst kein prism-react-renderer-Theme, weil Default-Themes nicht zum Vintage-Look passen.
 */

import { Highlight, type PrismTheme } from "prism-react-renderer";
import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  language?: "bash" | "tsx" | "ts" | "json" | "jsx" | "js" | "markup";
  filename?: string;
  className?: string;
}

/**
 * Sepia-Theme für Light-Mode. Im Dark-Mode überschreibt Tailwind den
 * Hintergrund — die Token-Farben sind warm genug, um in beiden Modi
 * lesbar zu sein.
 */
const sepiaTheme: PrismTheme = {
  plain: {
    color: "#3a2f28",
    backgroundColor: "transparent",
  },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#a89a8a", fontStyle: "italic" } },
    { types: ["punctuation"], style: { color: "#7a6a5a" } },
    { types: ["property", "tag", "boolean", "number", "constant", "symbol", "deleted"], style: { color: "#b8542a" } },
    { types: ["selector", "attr-name", "string", "char", "builtin", "inserted"], style: { color: "#7a8a4a" } },
    { types: ["operator", "entity", "url", "variable"], style: { color: "#b8542a" } },
    { types: ["atrule", "attr-value", "keyword"], style: { color: "#a04030" } },
    { types: ["function", "class-name"], style: { color: "#a04030", fontWeight: "bold" } },
    { types: ["regex", "important"], style: { color: "#b8542a" } },
  ],
};

export function CodeBlock({ code, language = "bash", filename, className = "" }: CodeBlockProps) {
  const trimmed = code.replace(/^\n+|\n+$/g, "");

  return (
    <div
      className={`group relative my-3 overflow-hidden rounded-lg border border-[#3a2f28]/10 dark:border-[#f5f0eb]/10 bg-[#f5f0eb]/40 dark:bg-[#3a2f28]/40 ${className}`}
    >
      {(filename || true) && (
        <div className="flex items-center justify-between border-b border-[#3a2f28]/10 dark:border-[#f5f0eb]/10 px-3 py-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#3a2f28]/50 dark:text-[#f5f0eb]/50">
            {filename ?? language}
          </span>
          <CopyButton text={trimmed} />
        </div>
      )}
      <Highlight code={trimmed} language={language} theme={sepiaTheme}>
        {({ className: prismClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${prismClass} overflow-x-auto p-3 text-xs leading-relaxed`}
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
