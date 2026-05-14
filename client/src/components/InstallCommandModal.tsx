/**
 * InstallCommandModal — Dialog mit Setup-Befehl für einen Skill.
 *
 * Erscheint, wenn ein Skill `installCommand` definiert hat und der Nutzer
 * auf den "Installieren"-Button auf der Karte klickt.
 *
 * Bewusst nicht-interaktiv: kein curl|sh, kein automatisches Ausführen.
 * Der Befehl wird nur angezeigt und kann kopiert werden — der User
 * entscheidet, ob/wann er ihn im eigenen Terminal ausführt.
 */

import { Package } from "lucide-react";
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

export function InstallCommandModal({
  open,
  onOpenChange,
  skillName,
  command,
  note,
}: InstallCommandModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--color-terracotta)]" />
            Installieren: {skillName}
          </DialogTitle>
          <DialogDescription>
            Kopiere diesen Befehl in dein Terminal, um den Skill in deinem
            Projekt zu aktivieren. Der Befehl wird hier nur angezeigt — nichts
            wird automatisch ausgeführt.
          </DialogDescription>
        </DialogHeader>

        <CodeBlock code={command} language="bash" filename="Terminal" />

        {note && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold">Hinweis:</span> {note}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
