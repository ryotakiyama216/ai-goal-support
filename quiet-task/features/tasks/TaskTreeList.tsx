"use client";

import { useMemo } from "react";
import { Target } from "lucide-react";
import { TaskItem } from "@/features/tasks/TaskItem";
import {
  buildTaskTree,
  getTaskContextLabel,
  groupTasksByGoal,
} from "@/lib/taskTree";
import { partitionTasksByGoal } from "@/lib/taskOrder";
import type { TaskTreeNode } from "@/lib/taskTree";
import type { Goal, Task } from "@/types";

type TaskTreeListProps = {
  tasks: Task[];
  emptyMessage: string;
  goalTitleById: Record<string, string>;
  taskTitleById: Record<string, string>;
  standaloneSectionTitle: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onMoveTask: (id: string, direction: "up" | "down") => void;
  onScheduleToday?: (id: string) => void;
  onMoveToInbox?: (id: string) => void;
  goals: Goal[];
  onAssignToGoal: (taskId: string, goalId: string) => void;
};

type RenderContext = {
  goalTitleById: Record<string, string>;
  taskTitleById: Record<string, string>;
  activeInProgressId: string | null;
  hideGoalLabelOnRoot: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onMoveTask: (id: string, direction: "up" | "down") => void;
  onScheduleToday?: (id: string) => void;
  onMoveToInbox?: (id: string) => void;
  goals: Goal[];
  onAssignToGoal: (taskId: string, goalId: string) => void;
};

function renderNodes(
  nodes: TaskTreeNode[],
  depth: number,
  ctx: RenderContext
) {
  return nodes.map((node, index) => (
    <div key={node.task.id}>
      <TaskItem
        task={node.task}
        depth={depth}
        contextLabel={(() => {
          const label = getTaskContextLabel(
            node.task,
            ctx.goalTitleById,
            ctx.taskTitleById
          );
          if (!label) return undefined;
          if (
            ctx.hideGoalLabelOnRoot &&
            depth === 0 &&
            !node.task.parentTaskId
          ) {
            return undefined;
          }
          return label;
        })()}
        onToggle={ctx.onToggle}
        onDelete={ctx.onDelete}
        onStart={ctx.onStart}
        onStop={ctx.onStop}
        onMoveUp={(id) => ctx.onMoveTask(id, "up")}
        onMoveDown={(id) => ctx.onMoveTask(id, "down")}
        canMoveUp={index > 0}
        canMoveDown={index < nodes.length - 1}
        onScheduleToday={ctx.onScheduleToday}
        onMoveToInbox={ctx.onMoveToInbox}
        canStart={
          !ctx.activeInProgressId || ctx.activeInProgressId === node.task.id
        }
        goals={ctx.goals}
        onAssignToGoal={ctx.onAssignToGoal}
      />
      {node.children.length > 0 && (
        <div
          className="border-l border-border/70"
          style={{ marginLeft: `${24 + depth * 16}px` }}
        >
          {renderNodes(node.children, depth + 1, ctx)}
        </div>
      )}
    </div>
  ));
}

function TaskBlock({
  list,
  ctx,
  hideGoalLabelOnRoot,
}: {
  list: Task[];
  ctx: RenderContext;
  hideGoalLabelOnRoot: boolean;
}) {
  if (list.length === 0) return null;
  const tree = buildTaskTree(list);
  return renderNodes(tree, 0, { ...ctx, hideGoalLabelOnRoot });
}

function GoalGroupsSection({
  tasks,
  goalTitleById,
  ctx,
}: {
  tasks: Task[];
  goalTitleById: Record<string, string>;
  ctx: RenderContext;
}) {
  const groups = groupTasksByGoal(tasks, goalTitleById).filter(
    (g) => g.goalId !== null
  );
  if (groups.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Target className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
        <h3 className="text-sm font-semibold text-foreground">目標から</h3>
      </div>
      <div className="space-y-4">
        {groups.map((group) => (
          <div
            key={group.goalId}
            className="rounded-xl border border-border/60 bg-[#fafafa]/60 px-4 py-3"
          >
            <p className="mb-3 text-[13px] font-semibold leading-snug text-foreground">
              {group.title}
            </p>
            <TaskBlock
              list={group.tasks}
              ctx={ctx}
              hideGoalLabelOnRoot
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function StandaloneSection({
  tasks,
  title,
  ctx,
}: {
  tasks: Task[];
  title: string;
  ctx: RenderContext;
}) {
  if (tasks.length === 0) return null;

  return (
    <section>
      <div className="mb-3 px-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <TaskBlock list={tasks} ctx={ctx} hideGoalLabelOnRoot={false} />
    </section>
  );
}

export function TaskTreeList({
  tasks,
  emptyMessage,
  goalTitleById,
  taskTitleById,
  standaloneSectionTitle,
  onToggle,
  onDelete,
  onStart,
  onStop,
  onMoveTask,
  onScheduleToday,
  onMoveToInbox,
  goals,
  onAssignToGoal,
}: TaskTreeListProps) {
  const activeInProgressId = useMemo(
    () => tasks.find((t) => t.inProgress && !t.completed)?.id ?? null,
    [tasks]
  );

  const active = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <p className="px-2 py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    );
  }

  const ctx: RenderContext = {
    goalTitleById,
    taskTitleById,
    activeInProgressId,
    hideGoalLabelOnRoot: false,
    onToggle,
    onDelete,
    onStart,
    onStop,
    onMoveTask,
    onScheduleToday,
    onMoveToInbox,
    goals,
    onAssignToGoal,
  };

  const renderPartitioned = (list: Task[]) => {
    const { withGoal, standalone } = partitionTasksByGoal(list);
    return (
      <>
        <GoalGroupsSection
          tasks={withGoal}
          goalTitleById={goalTitleById}
          ctx={ctx}
        />
        <StandaloneSection
          tasks={standalone}
          title={standaloneSectionTitle}
          ctx={ctx}
        />
      </>
    );
  };

  return (
    <div className="space-y-1">
      {active.length > 0 && renderPartitioned(active)}

      {done.length > 0 && active.length > 0 && (
        <p className="px-3 pt-10 pb-2 text-xs font-medium text-muted-foreground">
          完了
        </p>
      )}

      {done.length > 0 && renderPartitioned(done)}
    </div>
  );
}
