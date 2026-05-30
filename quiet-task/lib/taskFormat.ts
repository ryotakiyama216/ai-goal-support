import type { Priority } from "@/types";

const PRIORITY_LABEL: Record<Priority, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export function formatPriority(priority?: Priority): string | undefined {
  return priority ? PRIORITY_LABEL[priority] : undefined;
}

export function formatDateLabel(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const date = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}
