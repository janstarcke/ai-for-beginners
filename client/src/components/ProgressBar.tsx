import { useEffect, useState } from "react";

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  colorClass?: string;
}

export function ProgressBar({
  completed,
  total,
  label,
  colorClass = "bg-[var(--color-terracotta)]",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Animate-from-0-on-mount: erst nach 1 Frame die Target-Width setzen,
  // sodass die CSS-transition triggert (statt sofortigem Snap zur Endwidth).
  const [animatedWidth, setAnimatedWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimatedWidth(percentage));
    return () => cancelAnimationFrame(id);
  }, [percentage]);

  if (completed === 0) return null;

  return (
    <div className="flex items-center gap-3 w-full">
      {label && (
        <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
          {label}
        </span>
      )}
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        {/* CSS-transition statt Framer: width animiert auf percentage-Änderung. */}
        <div
          className={`h-full rounded-full transition-[width] duration-600 ease-out motion-reduce:transition-none ${colorClass}`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap tabular-nums">
        {percentage}%
      </span>
    </div>
  );
}
