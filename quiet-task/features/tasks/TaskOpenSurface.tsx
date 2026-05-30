"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type TaskOpenSurfaceProps = {
  taskId: string;
  title: string;
  className?: string;
};

/** 行のタイトル領域をタップして詳細へ。下線なし・行ホバーと相性よし */
export function TaskOpenSurface({
  taskId,
  title,
  className,
}: TaskOpenSurfaceProps) {
  return (
    <Link
      href={`/tasks/${taskId}`}
      className={cn(
        "absolute inset-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10",
        className
      )}
      aria-label={`${title}の詳細`}
    />
  );
}
