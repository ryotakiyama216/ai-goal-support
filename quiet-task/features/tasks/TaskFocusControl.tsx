"use client";

import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

type TaskFocusControlProps = {
  task: Task;
  canStart: boolean;
  onStart: () => void;
  onStop: () => void;
  onComplete: () => void;
};

export function TaskFocusControl({
  task,
  canStart,
  onStart,
  onStop,
  onComplete,
}: TaskFocusControlProps) {
  const inProgress = task.inProgress && !task.completed;
  const completed = task.completed;

  if (completed) {
    return (
      <button
        type="button"
        onClick={onComplete}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
        aria-label="完了を取り消す"
      >
        <Check className="h-4 w-4" strokeWidth={2.5} />
      </button>
    );
  }

  if (inProgress) {
    return (
      <div
        className="flex shrink-0 items-center gap-1.5 animate-[focusSplit_0.2s_ease-out]"
        role="group"
        aria-label="着手中の操作"
      >
        <button
          type="button"
          onClick={onComplete}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600 transition-transform hover:scale-105 active:scale-95"
          aria-label="完了"
        >
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={onStop}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-400 bg-red-50 text-red-600 transition-transform hover:scale-105 hover:bg-red-100 active:scale-95"
          aria-label="着手をやめる"
        >
          <Minus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      disabled={!canStart}
      className={cn(
        "h-8 w-8 shrink-0 rounded-full border-2 transition-all",
        canStart
          ? "border-foreground/20 hover:border-blue-400 hover:bg-blue-50/50 active:scale-95"
          : "cursor-not-allowed border-foreground/10 opacity-40"
      )}
      aria-label={canStart ? "着手する" : "別のタスクが着手中です"}
    />
  );
}
