import { type ReactNode, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

type Props = {
  kicker: string;
  title: string;
  updated: string;
  children: ReactNode;
};

const LEGAL_LINKS = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export function LegalH2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-semibold mt-10 mb-3 text-foreground">
      {children}
    </h2>
  );
}

export default function LegalLayout({ kicker, title, updated, children }: Props) {
  useEffect(() => {
    document.title = `${title} — AI for Beginners`;
  }, [title]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-3xl w-full mx-auto px-4 md:px-6 pt-10 pb-6 flex-1">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zur Startseite
        </Link>

        <p className="text-xs font-mono tracking-wider uppercase mb-4 text-terracotta-deep dark:text-terracotta-bright">
          {kicker}
        </p>
        <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-bold leading-tight tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Stand: {updated}</p>

        <div className="mt-8 text-base leading-relaxed text-foreground/90 [&_a]:text-terracotta-deep [&_a]:underline dark:[&_a]:text-terracotta-bright [&_p]:mb-4">
          {children}
        </div>
      </div>

      <footer className="border-t border-border bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Rechtliches">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Jan Starcke
          </p>
        </div>
      </footer>
    </div>
  );
}
