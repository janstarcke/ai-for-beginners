import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "ai-for-beginners-progress";

interface ProgressState {
  [key: string]: boolean;
}

function loadProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveProgress(state: ProgressState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // silently fail if localStorage is full
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress);

  // Sync to localStorage whenever progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const isCompleted = useCallback(
    (id: string) => !!progress[id],
    [progress]
  );

  const toggle = useCallback((id: string) => {
    setProgress((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;

  const reset = useCallback(() => {
    setProgress({});
  }, []);

  return { isCompleted, toggle, completedCount, reset };
}
