import { useEffect, useState, useMemo } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  BookOpen,
  Palette,
  TrendingUp,
  Coins,
  Hash,
  ArrowRight,
} from "lucide-react";
import { skills } from "@/data/skills";
import { guideLevels } from "@/data/guide";

interface SearchItem {
  id: string;
  title: string;
  description: string;
  group: "skills" | "guide" | "pages";
  href: string;
  icon: React.ReactNode;
}

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // Skills
  skills.forEach((skill) => {
    items.push({
      id: `skill-${skill.id}`,
      title: `#${skill.id} ${skill.name}`,
      description: skill.description.slice(0, 80) + "…",
      group: "skills",
      href: "/#skills",
      icon: <Hash className="w-4 h-4 text-[var(--color-terracotta)]" />,
    });
  });

  // Guide steps
  guideLevels.forEach((level) => {
    level.steps.forEach((step) => {
      items.push({
        id: `guide-${step.id}`,
        title: `L${level.level}: ${step.title}`,
        description: step.description.slice(0, 80) + "…",
        group: "guide",
        href: `/guide#level-${level.level}`,
        icon: <BookOpen className="w-4 h-4 text-[#7a9b6d]" />,
      });
    });
  });

  // Static pages
  items.push(
    {
      id: "page-home",
      title: "Startseite — Wissensdatenbank",
      description: "Skill-Ranking, TL;DR, Workflow-Übersicht",
      group: "pages",
      href: "/",
      icon: <ArrowRight className="w-4 h-4 text-muted-foreground" />,
    },
    {
      id: "page-guide",
      title: "Beginner-to-Pro Guide",
      description: "4 Level Lernpfad, Plugins, Cheat Sheet",
      group: "pages",
      href: "/guide",
      icon: <BookOpen className="w-4 h-4 text-muted-foreground" />,
    },
    {
      id: "page-design",
      title: "Claude Design Guide",
      description: "Visuelles Prototyping, Slide Decks, Handoff",
      group: "pages",
      href: "/claude-design",
      icon: <Palette className="w-4 h-4 text-muted-foreground" />,
    },
    {
      id: "page-finance",
      title: "Financial Analyst Guide",
      description: "Multi-Agent Finanzanalyse, Setup, Managed Agents",
      group: "pages",
      href: "/financial-analyst",
      icon: <TrendingUp className="w-4 h-4 text-muted-foreground" />,
    },
    {
      id: "page-token-spar",
      title: "Token-Spar Guide",
      description: "13 Tricks gegen Limits, Kosten-Rechner, Modell-Vergleich",
      group: "pages",
      href: "/token-spar",
      icon: <Coins className="w-4 h-4 text-muted-foreground" />,
    }
  );

  return items;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const searchIndex = useMemo(() => buildSearchIndex(), []);

  // Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setOpen(false);
    // For hash links on the same page, use window.location
    if (item.href.includes("#")) {
      const [path, hash] = item.href.split("#");
      if (path === "" || path === "/" || window.location.pathname === path) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return;
        }
      }
    }
    navigate(item.href);
  };

  const groupLabels: Record<string, string> = {
    pages: "Seiten",
    skills: "Skills",
    guide: "Guide-Schritte",
  };

  return (
    <>
      {/* Floating search trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all text-sm text-muted-foreground hover:text-foreground"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Suche
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono text-muted-foreground border border-border">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Globale Suche"
        description="Durchsuche Skills, Guide-Schritte und Seiten"
      >
        <CommandInput placeholder="Suche nach Skills, Guides, Seiten…" />
        <CommandList>
          <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>

          {(["pages", "skills", "guide"] as const).map((group) => {
            const items = searchIndex.filter((item) => item.group === group);
            if (items.length === 0) return null;
            return (
              <CommandGroup key={group} heading={groupLabels[group]}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.description}`}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    {item.icon}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
