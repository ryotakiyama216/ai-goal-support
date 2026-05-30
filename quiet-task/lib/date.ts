export function toDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === toDateString();
}

export function formatTodayHeader(date: Date = new Date()): string {
  const weekday = date.toLocaleDateString("ja-JP", { weekday: "long" });
  const monthDay = date.toLocaleDateString("ja-JP", {
    month: "long",
    day: "numeric",
  });
  return `${monthDay} · ${weekday}`;
}
