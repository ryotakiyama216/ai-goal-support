"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type TaskNavRowProps = {
  taskId: string;
  title: string;
  completed?: boolean;
  className?: string;
};

/** 詳細画面内の関連タスク行（下線なし・背景ホバー） */
export function TaskNavRow({
  taskId,
  title,
  completed,
  className,
}: TaskNavRowProps) {
  return (
    <Link
      href={`/tasks/${taskId}`}
      className={cn(
        "group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors hover:bg-white/80 active:bg-white",
        className
      )}
    >
      <span
        className={cn(
          "min-w-0 truncate",
          completed && "text-muted-foreground line-through"
        )}
      >
        {title}
      </span>
      <ChevronRight
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground"
        strokeWidth={1.75}
      />
    </Link>
  );
}
