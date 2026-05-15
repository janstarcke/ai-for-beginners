import { Checkbox } from "@/components/ui/checkbox";

interface ProgressCheckboxProps {
  id: string;
  checked: boolean;
  onToggle: (id: string) => void;
  label?: string;
  /**
   * Accessible name für Screen-Reader, wenn kein sichtbares `label`
   * gerendert wird (Audit: button-name). Fällt auf einen generischen
   * Text zurück, sollte aber kontextuell gesetzt werden (z.B. Skill-Name).
   */
  ariaLabel?: string;
}

export function ProgressCheckbox({ id, checked, onToggle, label, ariaLabel }: ProgressCheckboxProps) {
  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        id={`progress-${id}`}
        checked={checked}
        onCheckedChange={() => onToggle(id)}
        // button-name: Radix-Checkbox hat ohne sichtbares <label> keinen
        // accessible name → aria-label.
        // target-size: das interaktive Element selbst muss ≥24×24px sein
        // (axe/Lighthouse misst die Element-boundingRect, NICHT CSS-Pseudo-
        // Elemente — ein ::before-Trick greift hier nicht). size-6 = 24px;
        // das Häkchen-Icon bleibt klein + zentriert, nur die Klick-Box wächst.
        aria-label={label ? undefined : (ariaLabel ?? "Als erledigt markieren")}
        className="size-6 data-[state=checked]:bg-[var(--color-terracotta)] data-[state=checked]:border-[var(--color-terracotta)]"
      />
      {label && (
        <label
          htmlFor={`progress-${id}`}
          className={`text-xs cursor-pointer select-none transition-colors ${
            checked
              ? "text-muted-foreground line-through"
              : "text-muted-foreground"
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
