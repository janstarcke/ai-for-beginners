/**
 * InstallCommandModal — Dialog mit Setup-Befehl für einen Skill.
 *
 * Erscheint, wenn ein Skill `installCommand` definiert hat und der Nutzer
 * auf den "Installieren"-Button auf der Karte klickt.
 *
 * Bewusst nicht-interaktiv: kein curl|sh, kein automatisches Ausführen.
 * Der Befehl wird nur angezeigt und kann kopiert werden — der User
 * entscheidet, ob/wann er ihn im eigenen Terminal ausführt.
 *
 * Audit Finding #22: Erkennt automatisch, ob der Befehl ein Slash-Command
 * (im Claude-Chat auszuführen) oder Shell-Befehl (im Terminal) ist und
 * passt den Modal-Header + die DialogDescription entsprechend an.
 */

import { Package, MessageSquare, Terminal as TerminalIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CodeBlock } from "./CodeBlock";

interface InstallCommandModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
  command: string;
  note?: string;
}

/**
 * Audit Finding #19: Renders inline `code`-Backticks in installNote-Strings
 * als <code>-Elemente. Vorher wurden Backticks als Literal-Zeichen angezeigt.
 * Splittet den Text in alternierende plain/code Segmente per Regex.
 */
function renderInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="font-mono text-[0.85em] bg-secondary px-1 py-0.5 rounded"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function InstallCommandModal({
  open,
  onOpenChange,
  skillName,
  command,
  note,
}: InstallCommandModalProps) {
  // Audit Finding #22: Slash-Command (in Claude-Chat) vs Shell-Command
  // (im Terminal) — wird automatisch erkannt anhand des ersten Zeichens.
  const isSlashCommand = command.trimStart().startsWith("/");
  const ContextIcon = isSlashCommand ? MessageSquare : TerminalIcon;
  const contextLabel = isSlashCommand
    ? "In einer laufenden Claude-Code-Session ausführen"
    : "Im Terminal ausführen";
  const codeFilename = isSlashCommand ? "Claude-Chat" : "Terminal";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--color-terracotta)]" aria-hidden="true" />
            Installieren: {skillName}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1.5">
            <ContextIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{contextLabel} — wird nicht automatisch ausgeführt.</span>
          </DialogDescription>
        </DialogHeader>

        <CodeBlock code={command} language="bash" filename={codeFilename} />

        {note && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold">Hinweis:</span> {renderInlineCode(note)}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
