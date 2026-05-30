import { compareTasks } from "@/lib/taskOrder";
import type { Task } from "@/types";

export type TaskTreeNode = {
  task: Task;
  children: TaskTreeNode[];
};

export function buildTaskTree(tasks: Task[]): TaskTreeNode[] {
  const nodeMap = new Map<string, TaskTreeNode>();

  for (const task of tasks) {
    nodeMap.set(task.id, { task, children: [] });
  }

  const roots: TaskTreeNode[] = [];

  for (const task of tasks) {
    const node = nodeMap.get(task.id);
    if (!node) continue;

    const parentId = task.parentTaskId;
    const parent = parentId ? nodeMap.get(parentId) : undefined;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (nodes: TaskTreeNode[]) => {
    nodes.sort((a, b) => compareTasks(a.task, b.task));
    nodes.forEach((node) => sortNodes(node.children));
  };

  sortNodes(roots);
  return roots;
}

/** 大タスクは目標名、それ以外は直上の親タスク名 */
export function getTaskContextLabel(
  task: Task,
  goalTitleById: Record<string, string>,
  taskTitleById: Record<string, string>
): string | undefined {
  if (task.parentTaskId) {
    return taskTitleById[task.parentTaskId];
  }
  if (task.goalId) {
    return goalTitleById[task.goalId];
  }
  return undefined;
}

export function collectDescendantIds(tasks: Task[], rootId: string): string[] {
  const ids = new Set<string>([rootId]);
  let added = true;
  while (added) {
    added = false;
    for (const task of tasks) {
      if (
        task.parentTaskId &&
        ids.has(task.parentTaskId) &&
        !ids.has(task.id)
      ) {
        ids.add(task.id);
        added = true;
      }
    }
  }
  return Array.from(ids);
}

export function getTaskSiblings(tasks: Task[], task: Task): Task[] {
  const parentKey = task.parentTaskId ?? null;
  return tasks.filter(
    (t) =>
      (t.parentTaskId ?? null) === parentKey &&
      t.goalId === task.goalId &&
      t.id !== task.id
  );
}

export function getTaskChildren(tasks: Task[], taskId: string): Task[] {
  return tasks
    .filter((t) => t.parentTaskId === taskId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function groupTasksByGoal(
  tasks: Task[],
  goalTitleById: Record<string, string>
): { goalId: string | null; title: string | null; tasks: Task[] }[] {
  const groups = new Map<string | null, Task[]>();

  for (const task of tasks) {
    const key = task.goalId ?? null;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(task);
  }

  const result: { goalId: string | null; title: string | null; tasks: Task[] }[] =
    [];

  for (const [goalId, groupTasks] of Array.from(groups.entries())) {
    result.push({
      goalId,
      title: goalId ? goalTitleById[goalId] ?? "目標" : null,
      tasks: groupTasks,
    });
  }

  result.sort((a, b) => {
    if (a.goalId === null) return 1;
    if (b.goalId === null) return -1;
    return (a.title ?? "").localeCompare(b.title ?? "", "ja");
  });

  return result;
}
