import { useEffect, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  GitCommit as GitCommitIcon,
  Sparkles,
  Wrench,
  RotateCcw,
  Plus,
  Youtube,
  Github,
  Link as LinkIcon,
  FileText,
  Globe,
  EyeOff,
  Hash,
} from "lucide-react";
import {
  gitHistory,
  gitHistoryGeneratedAt,
  type GitCommit,
} from "@/data/gitHistory.generated";
import { importHistory, type ImportEntry, type ImportType } from "@/data/importHistory";

/*
 * Hidden Import-History — /secret-import-history
 *
 * Reverse-chronological timeline der Inhalts-Imports. Datenquellen:
 *  - gitHistory.generated.ts  (auto: aus git log)
 *  - importHistory.ts          (kuratiert: Quelle, Channel, Notes)
 * Join über shortHash. Wenn keine kuratierten Daten vorliegen, fällt der
 * Eintrag auf reine Git-Metadaten zurück.
 *
 * Diese Seite ist absichtlich nirgendwo verlinkt. Robots noindex via
 * useEffect-meta-tag-Injection.
 */

const GITHUB_REPO = "https://github.com/jansta1/ai-for-beginners";

interface MergedEntry {
  commit: GitCommit;
  meta?: ImportEntry;
}

function typeStyle(type: ImportType | undefined) {
  switch (type) {
    case "new":
      return {
        label: "Neu",
        icon: Plus,
        className: "bg-terracotta text-white",
      };
    case "extend":
      return {
        label: "Erweitert",
        icon: Sparkles,
        className: "bg-sage text-espresso",
      };
    case "refactor":
      return {
        label: "Überarbeitet",
        icon: RotateCcw,
        className: "bg-sage-light text-espresso",
      };
    case "meta":
      return {
        label: "Meta",
        icon: Wrench,
        className: "bg-espresso text-cream",
      };
    default:
      return {
        label: "Commit",
        icon: GitCommitIcon,
        className: "bg-muted text-muted-foreground",
      };
  }
}

function sourceIcon(kind: string) {
  switch (kind) {
    case "youtube":
      return Youtube;
    case "github":
      return Github;
    case "web":
      return Globe;
    case "docs":
      return FileText;
    default:
      return LinkIcon;
  }
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dayBucket(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function ImportHistory() {
  // noindex injection — defensive even though there are no links to this page
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Import History — privat";

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, []);

  const merged: MergedEntry[] = useMemo(() => {
    const metaByCommit = new Map<string, ImportEntry>();
    for (const m of importHistory) {
      metaByCommit.set(m.commit, m);
    }
    return gitHistory.map((commit) => ({
      commit,
      meta: metaByCommit.get(commit.shortHash),
    }));
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, MergedEntry[]>();
    for (const entry of merged) {
      const key = dayBucket(entry.commit.date);
      const arr = map.get(key) ?? [];
      arr.push(entry);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [merged]);

  const stats = useMemo(() => {
    const newCount = merged.filter((m) => m.meta?.type === "new").length;
    const extendCount = merged.filter(
      (m) => m.meta?.type === "extend" || m.meta?.type === "refactor"
    ).length;
    const newSkills = merged.flatMap((m) => m.meta?.newSkillIds ?? []).length;
    const extendedSkills = merged.flatMap((m) => m.meta?.extendedSkillIds ?? []).length;
    return { commits: merged.length, newCount, extendCount, newSkills, extendedSkills };
  }, [merged]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden-page indicator strip */}
      <div className="bg-espresso text-cream py-2 text-center text-xs tracking-wide flex items-center justify-center gap-2">
        <EyeOff className="h-3.5 w-3.5" />
        <span>Private Seite · nicht im Menü verlinkt · nicht für Bots indexiert</span>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pt-10 pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Zur Startseite
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold leading-tight font-[var(--font-display)]">
          Import-Chronik
        </h1>
        <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Wann ist was in die Wissensdatenbank gewandert? Zeitstrahl aller
          Content-Commits, kombiniert mit kuratierten Quellen-Metadaten aus dem{" "}
          <code className="font-mono text-sm bg-muted px-1 py-0.5 rounded">import-content</code>{" "}
          Skill.
        </p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Commits" value={stats.commits} accent="terracotta" />
          <StatCard label="Neu hinzugefügt" value={stats.newCount} accent="sage" />
          <StatCard label="Erweitert" value={stats.extendCount} accent="sage" />
          <StatCard
            label="Skills (neu / erw.)"
            value={`${stats.newSkills} / ${stats.extendedSkills}`}
            accent="terracotta"
          />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Git-Daten zuletzt regeneriert: {formatDate(gitHistoryGeneratedAt)} · Regenerieren via{" "}
          <code className="font-mono bg-muted px-1 py-0.5 rounded">pnpm history:update</code>
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 pb-20">
        {groups.map(([day, entries], groupIdx) => (
          <div key={day} className="mt-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-3">
              {day}
            </h2>
            <div className="space-y-3">
              {entries.map((entry, idx) => (
                <motion.div
                  key={entry.commit.hash}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: (groupIdx * 0.04 + idx * 0.02) }}
                >
                  <TimelineCard entry={entry} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {merged.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground py-12 border border-dashed border-border rounded-lg">
            Noch keine Imports erfasst. Sobald{" "}
            <code className="font-mono bg-muted px-1 py-0.5 rounded">pnpm history:update</code>{" "}
            lief, erscheinen die Einträge hier.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: "terracotta" | "sage";
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div
        className={`text-2xl font-semibold ${
          accent === "terracotta" ? "text-terracotta" : "text-sage"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function TimelineCard({ entry }: { entry: MergedEntry }) {
  const { commit, meta } = entry;
  const style = typeStyle(meta?.type);
  const Icon = style.icon;

  const title = meta?.title ?? commit.subject;
  const time = new Date(commit.date).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="rounded-lg border border-border bg-card p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shrink-0 ${style.className}`}
        >
          <Icon className="h-3 w-3" />
          {style.label}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug">
              {title}
            </h3>
            <span className="text-xs text-muted-foreground tabular-nums">{time}</span>
          </div>

          {meta?.title && meta.title !== commit.subject && (
            <p className="mt-1 text-xs text-muted-foreground italic font-mono truncate">
              {commit.subject}
            </p>
          )}

          {meta?.notes && (
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{meta.notes}</p>
          )}

          {/* Skill IDs */}
          {(meta?.newSkillIds?.length || meta?.extendedSkillIds?.length) && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {meta?.newSkillIds?.map((id) => (
                <span
                  key={`new-${id}`}
                  className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta px-2 py-0.5 rounded"
                >
                  <Plus className="h-3 w-3" />#{id}
                </span>
              ))}
              {meta?.extendedSkillIds?.map((id) => (
                <span
                  key={`ext-${id}`}
                  className="inline-flex items-center gap-1 bg-sage/15 text-espresso px-2 py-0.5 rounded"
                >
                  <Sparkles className="h-3 w-3" />#{id}
                </span>
              ))}
            </div>
          )}

          {/* Categories */}
          {meta?.categories && meta.categories.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
              {meta.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 rounded border border-border text-muted-foreground"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {/* Sources */}
          {meta?.sources && meta.sources.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {meta.sources.map((src, i) => {
                const SrcIcon = sourceIcon(src.kind);
                const label = src.channel ?? src.url ?? src.kind;
                const content = (
                  <span className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                    <SrcIcon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                );
                return src.url ? (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    {content}
                  </a>
                ) : (
                  <span key={i}>{content}</span>
                );
              })}
            </div>
          )}

          {/* Files */}
          {commit.files.length > 0 && (
            <details className="mt-3 text-xs">
              <summary className="cursor-pointer text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {commit.files.length} {commit.files.length === 1 ? "Datei" : "Dateien"}
              </summary>
              <ul className="mt-1.5 pl-4 space-y-0.5 text-muted-foreground font-mono">
                {commit.files.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </details>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <a
              href={`${GITHUB_REPO}/commit/${commit.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono hover:text-foreground transition-colors"
              title="Commit auf GitHub öffnen"
            >
              <Hash className="h-3 w-3" />
              {commit.shortHash}
            </a>
            <span className="text-border">·</span>
            <span>{commit.author}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
