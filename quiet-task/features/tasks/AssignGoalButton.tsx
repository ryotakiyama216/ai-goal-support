"use client";

import { useEffect, useRef, useState } from "react";
import { Target } from "lucide-react";
import type { Goal } from "@/types";

type AssignGoalButtonProps = {
  goals: Goal[];
  onAssign: (goalId: string) => void;
};

export function AssignGoalButton({ goals, onAssign }: AssignGoalButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (goals.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-60 transition-opacity hover:bg-blue-50 hover:text-blue-600 group-hover:opacity-100"
        aria-label="目標に移す"
        title="目標に移す"
      >
        <Target className="h-4 w-4" strokeWidth={1.75} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 min-w-[160px] max-w-[220px] rounded-lg border border-border/80 bg-white py-1 shadow-lg">
          <p className="px-3 py-1.5 text-[10px] font-medium text-muted-foreground">
            目標に移す
          </p>
          {goals.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => {
                onAssign(goal.id);
                setOpen(false);
              }}
              className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-[#fafafa]"
            >
              {goal.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
