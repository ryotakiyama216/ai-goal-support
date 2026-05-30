import { isToday } from "@/lib/date";
import { compareTasks } from "@/lib/taskOrder";
import type { Task } from "@/types";

export function isTaskForToday(task: Task): boolean {
  return isToday(task.scheduledDate) || isToday(task.dueDate);
}

export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return compareTasks(a, b);
  });
}

export function getTodayTasks(tasks: Task[]): Task[] {
  return sortTasks(tasks.filter(isTaskForToday));
}

export function getInboxTasks(tasks: Task[]): Task[] {
  return sortTasks(tasks.filter((task) => !isTaskForToday(task)));
}
