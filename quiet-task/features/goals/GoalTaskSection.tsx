"use client";

import { FormEvent, useState } from "react";
import { ChevronRight, CornerDownRight, ListTodo, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoalTreeIllustration } from "@/features/goals/GoalTreeIllustration";
import { TaskOpenSurface } from "@/features/tasks/TaskOpenSurface";
import { buildTaskTree } from "@/lib/taskTree";
import { cn } from "@/lib/utils";
import type { TaskTreeNode } from "@/lib/taskTree";
import type { Task } from "@/types";

type GoalTaskSectionProps = {
  tasks: Task[];
  onAddRootTask: (title: string) => void;
  onAddChildTask: (parentTaskId: string, title: string) => void;
  onDeleteTask: (id: string) => void;
};

function RootAddForm({ onSubmit }: { onSubmit: (title: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-xl border border-dashed border-blue-200/80 bg-blue-50/30 px-3 py-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        <ListTodo className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-blue-700">ステップを追加</p>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="例: 企画書を書く"
          className="mt-1 h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
        />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={!value.trim()}
        className="shrink-0 rounded-full"
      >
        追加
      </Button>
    </form>
  );
}

function ChildAddRow({
  expanded,
  onExpand,
  onAdd,
}: {
  expanded: boolean;
  onExpand: () => void;
  onAdd: (title: string) => void;
}) {
  const [value, setValue] = useState("");

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="mt-1 flex w-full items-center gap-2 rounded-lg py-2 pl-1 text-left text-sm text-muted-foreground transition-colors hover:bg-white hover:text-foreground"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-border bg-white">
          <Plus className="h-3.5 w-3.5" />
        </span>
        <span>下にステップを追加</span>
      </button>
    );
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex items-center gap-2 rounded-lg border border-border/60 bg-white px-2 py-2"
    >
      <CornerDownRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="例: 目次を決める"
        className="h-8 flex-1 border-0 text-sm shadow-none focus-visible:ring-0"
        autoFocus
      />
      <Button type="submit" size="sm" disabled={!value.trim()} variant="outline">
        追加
      </Button>
    </form>
  );
}

function TaskNodeRow({
  node,
  index,
  depth,
  expandedTaskIds,
  toggleTask,
  expandTask,
  expandedAddForId,
  setExpandedAddForId,
  onAddChildTask,
  onDeleteTask,
}: {
  node: TaskTreeNode;
  index: number;
  depth: number;
  expandedTaskIds: Set<string>;
  toggleTask: (taskId: string) => void;
  expandTask: (taskId: string) => void;
  expandedAddForId: string | null;
  setExpandedAddForId: (id: string | null) => void;
  onAddChildTask: (parentTaskId: string, title: string) => void;
  onDeleteTask: (id: string) => void;
}) {
  const isExpanded = expandedTaskIds.has(node.task.id);
  const isChild = depth > 0;
  const childCount = node.children.length;

  return (
    <li className="list-none">
      <div
        className={cn(
          "group rounded-xl border border-border/50 bg-white shadow-sm transition-colors hover:bg-[#fafafa]",
          isChild && "border-border/40 shadow-none"
        )}
      >
        <div className="flex items-start gap-1 px-2 py-2">
          <button
            type="button"
            onClick={() => toggleTask(node.task.id)}
            className="flex min-w-0 flex-1 items-start gap-2 rounded-lg px-1 py-0.5 text-left"
            aria-expanded={isExpanded}
          >
            <ChevronRight
              className={cn(
                "mt-1.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                isExpanded && "rotate-90"
              )}
              strokeWidth={2}
            />
            <span
              className={cn(
                "flex shrink-0 items-center justify-center rounded-full font-semibold",
                isChild
                  ? "h-6 w-6 bg-muted text-xs text-muted-foreground"
                  : "h-8 w-8 bg-foreground text-xs text-background"
              )}
            >
              {index + 1}
            </span>
            <span className="relative min-w-0 flex-1 pt-0.5">
              <TaskOpenSurface taskId={node.task.id} title={node.task.title} />
              <span
                className={cn(
                  "pointer-events-none relative block leading-snug",
                  isChild ? "text-sm" : "text-[15px] font-medium"
                )}
              >
                {node.task.title}
              </span>
              {!isExpanded && childCount > 0 && (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {childCount} 件
                </span>
              )}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onDeleteTask(node.task.id)}
            className="relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
            aria-label="削除"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {isExpanded && (
          <div
            className="border-t border-border/40 px-3 pb-3 pt-1"
            style={{ marginLeft: depth > 0 ? 8 : 0 }}
          >
            {node.children.length > 0 && (
              <ul className="mb-2 space-y-2 border-l-2 border-border/50 pl-3">
                {node.children.map((child, childIndex) => (
                  <TaskNodeRow
                    key={child.task.id}
                    node={child}
                    index={childIndex}
                    depth={depth + 1}
                    expandedTaskIds={expandedTaskIds}
                    toggleTask={toggleTask}
                    expandTask={expandTask}
                    expandedAddForId={expandedAddForId}
                    setExpandedAddForId={setExpandedAddForId}
                    onAddChildTask={onAddChildTask}
                    onDeleteTask={onDeleteTask}
                  />
                ))}
              </ul>
            )}

            <ChildAddRow
              expanded={expandedAddForId === node.task.id}
              onExpand={() => setExpandedAddForId(node.task.id)}
              onAdd={(title) => {
                onAddChildTask(node.task.id, title);
                setExpandedAddForId(null);
                expandTask(node.task.id);
              }}
            />
          </div>
        )}
      </div>
    </li>
  );
}

export function GoalTaskSection({
  tasks,
  onAddRootTask,
  onAddChildTask,
  onDeleteTask,
}: GoalTaskSectionProps) {
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(
    () => new Set()
  );
  const [expandedAddForId, setExpandedAddForId] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setExpandedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const expandTask = (taskId: string) => {
    setExpandedTaskIds((prev) => new Set(prev).add(taskId));
  };

  const tree = buildTaskTree(tasks);
  const isEmpty = tree.length === 0;

  return (
    <section className="mt-4 space-y-4">
      {isEmpty ? (
        <div className="rounded-xl border border-border/50 bg-[#fafafa]/80 px-4 py-5 text-center">
          <GoalTreeIllustration className="mx-auto h-[100px] w-[180px]" />
          <p className="mt-3 text-sm text-muted-foreground">
            目標を達成するための<strong className="font-medium text-foreground">ステップ</strong>
            を書きます。必要なら、ステップの下にもさらに追加できます。
          </p>
        </div>
      ) : null}

      <RootAddForm onSubmit={onAddRootTask} />

      {tree.length > 0 && (
        <ul className="space-y-4">
          {tree.map((node, index) => (
            <TaskNodeRow
              key={node.task.id}
              node={node}
              index={index}
              depth={0}
              expandedTaskIds={expandedTaskIds}
              toggleTask={toggleTask}
              expandTask={expandTask}
              expandedAddForId={expandedAddForId}
              setExpandedAddForId={setExpandedAddForId}
              onAddChildTask={onAddChildTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
