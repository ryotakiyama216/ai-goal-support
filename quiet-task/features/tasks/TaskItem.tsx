"use client";

import { CalendarDays, ChevronDown, ChevronUp, Inbox, Trash2 } from "lucide-react";
import { AssignGoalButton } from "@/features/tasks/AssignGoalButton";
import { TaskFocusControl } from "@/features/tasks/TaskFocusControl";
import { TaskOpenSurface } from "@/features/tasks/TaskOpenSurface";
import { cn } from "@/lib/utils";
import type { Goal, Task } from "@/types";

type TaskItemProps = {
  task: Task;
  depth?: number;
  contextLabel?: string;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onStart?: (id: string) => void;
  onStop?: (id: string) => void;
  onScheduleToday?: (id: string) => void;
  onMoveToInbox?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  canStart?: boolean;
  goals?: Goal[];
  onAssignToGoal?: (taskId: string, goalId: string) => void;
};

export function TaskItem({
  task,
  depth = 0,
  contextLabel,
  onToggle,
  onDelete,
  onStart,
  onStop,
  onScheduleToday,
  onMoveToInbox,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  canStart = true,
  goals,
  onAssignToGoal,
}: TaskItemProps) {
  const inProgress = task.inProgress && !task.completed;
  const isChild = depth > 0;

  return (
    <div
      className={cn(
        "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors",
        inProgress && "bg-sky-50/80 ring-1 ring-sky-100",
        !inProgress && "hover:bg-[#fafafa]",
        task.completed && "opacity-55"
      )}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      {onStart && onStop && (
        <div className="relative z-10 shrink-0">
          <TaskFocusControl
          task={task}
          canStart={canStart}
          onStart={() => onStart(task.id)}
          onStop={() => onStop(task.id)}
          onComplete={() => onToggle(task.id)}
          />
        </div>
      )}

      <div className="relative min-w-0 flex-1">
        <TaskOpenSurface taskId={task.id} title={task.title} />
        <div className="pointer-events-none relative">
          {contextLabel && (
            <p className="mb-0.5 truncate text-[11px] text-muted-foreground">
              {contextLabel}
            </p>
          )}
          <p
            className={cn(
              "leading-snug text-foreground",
              isChild ? "text-sm" : "text-[15px]",
              task.completed && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-0.5">
        {(onMoveUp || onMoveDown) && (
          <div className="mr-0.5 flex flex-col opacity-50 transition-opacity group-hover:opacity-100">
            {onMoveUp && (
              <button
                type="button"
                onClick={() => onMoveUp(task.id)}
                disabled={!canMoveUp}
                className="flex h-5 w-6 items-center justify-center rounded text-muted-foreground hover:bg-white hover:text-foreground disabled:opacity-25"
                aria-label="上に移動"
              >
                <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            )}
            {onMoveDown && (
              <button
                type="button"
                onClick={() => onMoveDown(task.id)}
                disabled={!canMoveDown}
                className="flex h-5 w-6 items-center justify-center rounded text-muted-foreground hover:bg-white hover:text-foreground disabled:opacity-25"
                aria-label="下に移動"
              >
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            )}
          </div>
        )}
        {!task.goalId && goals && onAssignToGoal && goals.length > 0 && (
          <AssignGoalButton
            goals={goals}
            onAssign={(goalId) => onAssignToGoal(task.id, goalId)}
          />
        )}
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
            aria-label="削除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
        {!task.completed && onScheduleToday && (
          <button
            type="button"
            onClick={() => onScheduleToday(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-white hover:text-foreground group-hover:opacity-100"
            aria-label="Todayに移す"
          >
            <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
        {!task.completed && onMoveToInbox && (
          <button
            type="button"
            onClick={() => onMoveToInbox(task.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-white hover:text-foreground group-hover:opacity-100"
            aria-label="Inboxに戻す"
          >
            <Inbox className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  );
}
