import type { Task } from "@/types";

export function taskSortKey(task: Task): number {
  return task.sortOrder ?? new Date(task.createdAt).getTime();
}

/** 値が大きいほどリストの上 */
export function compareTasks(a: Task, b: Task): number {
  return taskSortKey(b) - taskSortKey(a);
}

export function getSiblings(tasks: Task[], task: Task): Task[] {
  const parentKey = task.parentTaskId ?? null;
  const goalKey = task.goalId ?? null;
  return tasks
    .filter(
      (t) =>
        (t.parentTaskId ?? null) === parentKey && (t.goalId ?? null) === goalKey
    )
    .sort(compareTasks);
}

export function nextSortOrder(
  tasks: Task[],
  input: { goalId?: string; parentTaskId?: string }
): number {
  const parentKey = input.parentTaskId ?? null;
  const goalKey = input.goalId ?? null;
  const siblings = tasks.filter(
    (t) =>
      (t.parentTaskId ?? null) === parentKey && (t.goalId ?? null) === goalKey
  );
  if (siblings.length === 0) return Date.now();
  return Math.max(...siblings.map(taskSortKey)) + 1;
}

export function partitionTasksByGoal(tasks: Task[]) {
  const withGoal = tasks.filter((t) => t.goalId);
  const standalone = tasks.filter((t) => !t.goalId);
  return { withGoal, standalone };
}
