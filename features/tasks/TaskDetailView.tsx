"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Inbox,
  Target,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TaskNavRow } from "@/features/tasks/TaskNavRow";
import { isTaskForToday } from "@/lib/tasks";
import { formatDateLabel, formatPriority } from "@/lib/taskFormat";
import {
  getTaskChildren,
  getTaskSiblings,
} from "@/lib/taskTree";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";

type TaskDetailViewProps = {
  taskId: string;
};

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
  const router = useRouter();
  const hydrated = useTaskStore((s) => s.hydrated);
  const tasks = useTaskStore((s) => s.tasks);
  const goals = useTaskStore((s) => s.goals);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const scheduleForToday = useTaskStore((s) => s.scheduleForToday);
  const moveToInbox = useTaskStore((s) => s.moveToInbox);
  const assignTaskToGoal = useTaskStore((s) => s.assignTaskToGoal);
  const detachTaskFromGoal = useTaskStore((s) => s.detachTaskFromGoal);

  const task = useMemo(
    () => tasks.find((t) => t.id === taskId),
    [tasks, taskId]
  );

  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);

  const displayTitle = titleDraft ?? task?.title ?? "";
  const displayNote = noteDraft ?? task?.note ?? "";

  const goal = useMemo(
    () => goals.find((g) => g.id === task?.goalId),
    [goals, task?.goalId]
  );

  const parentTask = useMemo(
    () =>
      task?.parentTaskId
        ? tasks.find((t) => t.id === task.parentTaskId)
        : undefined,
    [tasks, task?.parentTaskId]
  );

  const siblings = useMemo(
    () => (task ? getTaskSiblings(tasks, task) : []),
    [tasks, task]
  );

  const children = useMemo(
    () => (task ? getTaskChildren(tasks, task.id) : []),
    [tasks, task]
  );

  const siblingTotal = useMemo(() => {
    if (!task) return 0;
    const parentKey = task.parentTaskId ?? null;
    return tasks.filter(
      (t) =>
        (t.parentTaskId ?? null) === parentKey && t.goalId === task.goalId
    ).length;
  }, [tasks, task]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-xl px-10 py-12">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="mx-auto max-w-xl px-10 py-12">
        <p className="text-sm text-muted-foreground">
          タスクが見つかりませんでした。
        </p>
        <Link
          href="/inbox"
          className="mt-4 inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium hover:bg-accent"
        >
          Inbox へ戻る
        </Link>
      </div>
    );
  }

  const onToday = isTaskForToday(task);
  const priorityLabel = formatPriority(task.priority);
  const dueLabel = formatDateLabel(task.dueDate);
  const commitTitle = () => {
    const trimmed = displayTitle.trim();
    if (!trimmed || trimmed === task.title) {
      setTitleDraft(null);
      return;
    }
    updateTask(task.id, { title: trimmed });
    setTitleDraft(null);
  };

  const commitNote = () => {
    const next = displayNote.trim();
    const prev = task.note?.trim() ?? "";
    if (next === prev) {
      setNoteDraft(null);
      return;
    }
    updateTask(task.id, { note: next || undefined });
    setNoteDraft(null);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.push("/inbox");
  };

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <header className="mb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          戻る
        </button>

        <div className="flex items-start gap-3">
          <Input
            value={displayTitle}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitTitle();
                (e.target as HTMLInputElement).blur();
              }
            }}
            className={cn(
              "min-w-0 flex-1 border-0 bg-transparent px-0 text-2xl font-semibold leading-snug shadow-none focus-visible:ring-0",
              task.completed && "text-muted-foreground line-through"
            )}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs",
              onToday
                ? "bg-sky-50 text-sky-700"
                : "bg-[#f6f7fb] text-muted-foreground"
            )}
          >
            {onToday ? "Today" : "Inbox"}
          </span>
          {priorityLabel && (
            <span className="rounded-full bg-[#f6f7fb] px-2.5 py-0.5 text-xs text-muted-foreground">
              優先度 {priorityLabel}
            </span>
          )}
          {dueLabel && (
            <span className="rounded-full bg-[#f6f7fb] px-2.5 py-0.5 text-xs text-muted-foreground">
              期限 {dueLabel}
            </span>
          )}
        </div>
      </header>

      <section className="mb-8 rounded-xl border border-border/60 bg-[#fafafa]/60 p-4">
        <h3 className="mb-3 text-xs font-medium text-muted-foreground">
          文脈
        </h3>
        <dl className="space-y-3 text-sm">
          {goal ? (
            <div>
              <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Target className="h-3 w-3" />
                目標
              </dt>
              <dd className="mt-0.5 font-medium leading-snug">{goal.title}</dd>
            </div>
          ) : (
            <div>
              <dt className="text-[11px] text-muted-foreground">目標</dt>
              <dd className="mt-0.5 text-muted-foreground">なし</dd>
            </div>
          )}

          {parentTask ? (
            <div>
              <dt className="text-[11px] text-muted-foreground">親タスク</dt>
              <dd className="mt-0.5">
                <Link
                  href={`/tasks/${parentTask.id}`}
                  className="group inline-flex max-w-full items-center gap-1 rounded-md py-0.5 pr-1 font-medium leading-snug transition-colors hover:bg-white/80 active:bg-white"
                >
                  <span className="truncate">{parentTask.title}</span>
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground"
                    strokeWidth={1.75}
                  />
                </Link>
              </dd>
            </div>
          ) : task.parentTaskId ? (
            <div>
              <dt className="text-[11px] text-muted-foreground">親タスク</dt>
              <dd className="mt-0.5 text-muted-foreground">削除済み</dd>
            </div>
          ) : null}

          {(task.parentTaskId || task.goalId) && (
            <div>
              <dt className="text-[11px] text-muted-foreground">他タスク</dt>
              <dd className="mt-0.5 text-foreground">
                {siblingTotal <= 1
                  ? "このタスクのみ"
                  : `全 ${siblingTotal} 件（他 ${siblings.length} 件）`}
              </dd>
            </div>
          )}
        </dl>

        {siblings.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-border/50 pt-3">
            {siblings.map((sibling) => (
              <li key={sibling.id}>
                <TaskNavRow
                  taskId={sibling.id}
                  title={sibling.title}
                  completed={sibling.completed}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h3 className="mb-2 text-xs font-medium text-muted-foreground">
          メモ
        </h3>
        <Textarea
          value={displayNote}
          onChange={(e) => setNoteDraft(e.target.value)}
          onBlur={commitNote}
          placeholder="詳細や考えを書く"
          className="min-h-[120px] resize-y border-border/60 bg-white shadow-none"
        />
      </section>

      {children.length > 0 && (
        <section className="mb-8">
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">
            下のステップ
          </h3>
          <ul className="space-y-1 rounded-xl border border-border/60 bg-white p-2">
            {children.map((child) => (
              <li key={child.id}>
                <TaskNavRow
                  taskId={child.id}
                  title={child.title}
                  completed={child.completed}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-wrap items-center gap-2 border-t border-border/40 pt-6">
        {!task.goalId && goals.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">目標に移す</span>
            <select
              className="h-8 max-w-[200px] rounded-md border border-border/60 bg-white px-2 text-sm"
              defaultValue=""
              onChange={(e) => {
                const goalId = e.target.value;
                if (!goalId) return;
                assignTaskToGoal(task.id, goalId);
                e.target.value = "";
              }}
            >
              <option value="">選択...</option>
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        )}
        {task.goalId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => detachTaskFromGoal(task.id)}
          >
            他タスクに移す
          </Button>
        )}
        {!task.completed && !onToday && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => scheduleForToday(task.id)}
          >
            <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
            Today に入れる
          </Button>
        )}
        {!task.completed && onToday && (
          <Button variant="outline" size="sm" onClick={() => moveToInbox(task.id)}>
            <Inbox className="mr-1.5 h-3.5 w-3.5" />
            Inbox に戻す
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          className="ml-auto text-muted-foreground hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          削除
        </Button>
      </section>
    </div>
  );
}
