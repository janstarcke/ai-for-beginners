import { Checkbox } from "@/components/ui/checkbox";

interface ProgressCheckboxProps {
  id: string;
  checked: boolean;
  onToggle: (id: string) => void;
  label?: string;
}

export function ProgressCheckbox({ id, checked, onToggle, label }: ProgressCheckboxProps) {
  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        id={`progress-${id}`}
        checked={checked}
        onCheckedChange={() => onToggle(id)}
        className="data-[state=checked]:bg-[var(--color-terracotta)] data-[state=checked]:border-[var(--color-terracotta)]"
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
