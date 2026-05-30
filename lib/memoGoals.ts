import type { Goal } from "@/types";

export const GOAL_MENTION_HREF_PREFIX = "goal:";

const GOAL_MENTION_RE = /\[@[^\]]*\]\(goal:([^)]+)\)/g;

export function formatGoalMention(goal: Goal): string {
  return `[@${goal.title}](goal:${goal.id})`;
}

export function parseGoalIdFromHref(href?: string): string | null {
  if (!href?.startsWith(GOAL_MENTION_HREF_PREFIX)) return null;
  return href.slice(GOAL_MENTION_HREF_PREFIX.length) || null;
}

export function extractGoalIdsFromContent(content: string): string[] {
  const ids = new Set<string>();
  let match: RegExpExecArray | null;
  const re = new RegExp(GOAL_MENTION_RE.source, "g");
  while ((match = re.exec(content)) !== null) {
    if (match[1]) ids.add(match[1]);
  }
  return Array.from(ids);
}

export function getActiveMentionQuery(
  content: string,
  cursor: number
): { query: string; start: number } | null {
  const before = content.slice(0, cursor);
  const match = before.match(/(?:^|[\s\n])@([^\s\n[@\]()]*?)$/);
  if (!match) return null;

  const atIndex = before.lastIndexOf("@");
  if (atIndex < 0) return null;

  return { query: match[1], start: atIndex };
}

export function filterGoalsByQuery(goals: Goal[], query: string): Goal[] {
  const q = query.trim().toLowerCase();
  if (!q) return goals;
  return goals.filter((goal) => goal.title.toLowerCase().includes(q));
}
