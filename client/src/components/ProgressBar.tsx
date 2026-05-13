import { motion } from "framer-motion";

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

  if (completed === 0) return null;

  return (
    <div className="flex items-center gap-3 w-full">
      {label && (
        <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
          {label}
        </span>
      )}
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
      <span className="text-xs font-semibold text-foreground whitespace-nowrap tabular-nums">
        {percentage}%
      </span>
    </div>
  );
}
