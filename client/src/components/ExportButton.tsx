import { Download } from "lucide-react";
import { skills } from "@/data/skills";
import { guideLevels } from "@/data/guide";

interface ExportButtonProps {
  isCompleted: (id: string) => boolean;
}

export function ExportButton({ isCompleted }: ExportButtonProps) {
  const handleExport = () => {
    const lines: string[] = [];
    const now = new Date().toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    lines.push("# AI & Vibe-Coding Wissensdatenbank — Fortschritt");
    lines.push(`\n_Exportiert am ${now}_\n`);

    // Skills section
    const completedSkills = skills.filter((s) =>
      isCompleted(`skill-${s.id}`)
    );
    const pendingSkills = skills.filter(
      (s) => !isCompleted(`skill-${s.id}`)
    );

    lines.push(`## Skills (${completedSkills.length} / ${skills.length} erledigt)\n`);

    if (completedSkills.length > 0) {
      lines.push("### ✅ Erledigt\n");
      completedSkills.forEach((s) => {
        lines.push(`- [x] **#${s.id} ${s.name}** — ${s.description}`);
      });
      lines.push("");
    }

    if (pendingSkills.length > 0) {
      lines.push("### ⬜ Offen\n");
      pendingSkills.forEach((s) => {
        lines.push(`- [ ] **#${s.id} ${s.name}** — ${s.description}`);
      });
      lines.push("");
    }

    // Guide section
    const allGuideSteps = guideLevels.flatMap((l) =>
      l.steps.map((s) => ({ ...s, level: l.level, levelTitle: l.title }))
    );
    const completedGuide = allGuideSteps.filter((s) =>
      isCompleted(`guide-${s.id}`)
    );
    const pendingGuide = allGuideSteps.filter(
      (s) => !isCompleted(`guide-${s.id}`)
    );

    lines.push(
      `## Guide-Schritte (${completedGuide.length} / ${allGuideSteps.length} erledigt)\n`
    );

    if (completedGuide.length > 0) {
      lines.push("### ✅ Erledigt\n");
      completedGuide.forEach((s) => {
        lines.push(
          `- [x] **L${s.level}: ${s.title}** — ${s.description.slice(0, 100)}…`
        );
      });
      lines.push("");
    }

    if (pendingGuide.length > 0) {
      lines.push("### ⬜ Nächste Schritte\n");
      pendingGuide.forEach((s) => {
        lines.push(
          `- [ ] **L${s.level}: ${s.title}** — ${s.description.slice(0, 100)}…`
        );
      });
      lines.push("");
    }

    // Summary
    const totalCompleted = completedSkills.length + completedGuide.length;
    const totalItems = skills.length + allGuideSteps.length;
    const percentage = Math.round((totalCompleted / totalItems) * 100);

    lines.push("---");
    lines.push(
      `\n**Gesamtfortschritt:** ${totalCompleted} / ${totalItems} (${percentage}%)`
    );

    // Create and download file
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wissensdatenbank-fortschritt-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      title="Fortschritt als Markdown exportieren"
    >
      <Download className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Export</span>
    </button>
  );
}
