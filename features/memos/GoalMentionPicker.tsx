"use client";

import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Goal } from "@/types";

const PICKER_WIDTH = 272;

type GoalMentionPickerProps = {
  top: number;
  left: number;
  goals: Goal[];
  selectedIndex: number;
  query: string;
  hasGoals: boolean;
  onSelect: (goal: Goal) => void;
  onHover: (index: number) => void;
};

export function GoalMentionPicker({
  top,
  left,
  goals,
  selectedIndex,
  query,
  hasGoals,
  onSelect,
  onHover,
}: GoalMentionPickerProps) {
  return (
    <div
      className="pointer-events-auto absolute z-20 w-[272px] overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
      style={{ top, left, width: PICKER_WIDTH }}
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="border-b border-border/60 bg-[#fafafa] px-3 py-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          目標をリンク
        </p>
        {query && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            @{query}
          </p>
        )}
      </div>

      {goals.length === 0 ? (
        <p className="px-3 py-3 text-sm leading-relaxed text-muted-foreground">
          {!hasGoals
            ? "目標がありません。Goals から追加してください。"
            : "一致する目標がありません"}
        </p>
      ) : (
        <ul className="max-h-52 overflow-y-auto py-1">
          {goals.map((goal, index) => (
            <li key={goal.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(goal);
                }}
                onMouseEnter={() => onHover(index)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                  index === selectedIndex
                    ? "bg-blue-50 text-foreground"
                    : "text-foreground hover:bg-[#fafafa]"
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Target className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  {goal.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t border-border/50 px-3 py-2">
        <p className="text-[11px] text-muted-foreground">
          ↑↓ 選択 · Enter で確定 · Esc で閉じる
        </p>
      </div>
    </div>
  );
}

export { PICKER_WIDTH };
