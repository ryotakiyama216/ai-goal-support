"use client";

import { FormEvent, useMemo, useState } from "react";
import { ChevronRight, Sparkles, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoalTaskSection } from "@/features/goals/GoalTaskSection";
import { GoalTreeIllustration } from "@/features/goals/GoalTreeIllustration";
import { generateGoalTasks } from "@/features/ai/parseNaturalLanguage";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";
import type { ParsedTask } from "@/types";

export function GoalsView() {
  const goals = useTaskStore((s) => s.goals);
  const addGoal = useTaskStore((s) => s.addGoal);
  const deleteGoal = useTaskStore((s) => s.deleteGoal);
  const tasks = useTaskStore((s) => s.tasks);
  const addTask = useTaskStore((s) => s.addTask);
  const addTasks = useTaskStore((s) => s.addTasks);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [title, setTitle] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
    Record<string, ParsedTask[]>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [expandedGoalIds, setExpandedGoalIds] = useState<Set<string>>(
    () => new Set()
  );

  const goalTasksByGoalId = useMemo(() => {
    return goals.reduce<Record<string, typeof tasks>>((acc, goal) => {
      acc[goal.id] = tasks.filter((task) => task.goalId === goal.id);
      return acc;
    }, {});
  }, [goals, tasks]);

  const toggleGoal = (goalId: string) => {
    setExpandedGoalIds((prev) => {
      const next = new Set(prev);
      if (next.has(goalId)) next.delete(goalId);
      else next.add(goalId);
      return next;
    });
  };

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const goal = addGoal(trimmed);
    setExpandedGoalIds((prev) => new Set(prev).add(goal.id));
    setTitle("");
  };

  const handleGenerate = async (goalId: string, goalTitle: string) => {
    setLoadingId(goalId);
    setError(null);
    try {
      const generated = await generateGoalTasks(goalTitle);
      setSuggestions((prev) => ({ ...prev, [goalId]: generated }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddSuggestions = (goalId: string) => {
    const list = suggestions[goalId];
    if (!list?.length) return;
    addTasks(list.map((task) => ({ ...task, goalId })));
    setSuggestions((prev) => {
      const next = { ...prev };
      delete next[goalId];
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <header className="mb-10">
        <h2 className="text-4xl font-semibold tracking-tight">Goals</h2>
      </header>

      {goals.length === 0 && (
        <div className="mb-10 rounded-2xl border border-border/60 bg-[#fafafa] px-6 py-8 text-center">
          <GoalTreeIllustration className="mx-auto h-[110px] w-[200px]" />
          <p className="mt-4 text-sm text-muted-foreground">
            まず目標を1つ追加してください。
            <br />
            そのあと、達成のためのステップを並べていきます。
          </p>
        </div>
      )}

      <form onSubmit={handleAddGoal} className="mb-10 flex gap-2">
        <div className="relative flex-1">
          <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="目標を書く（例: アプリをリリースする）"
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={!title.trim()}>
          追加
        </Button>
      </form>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <ul className="space-y-3">
        {goals.map((goal) => {
          const goalTasks = goalTasksByGoalId[goal.id] ?? [];
          const rootCount = goalTasks.filter((t) => !t.parentTaskId).length;
          const expanded = expandedGoalIds.has(goal.id);

          return (
            <li
              key={goal.id}
              className="overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm"
            >
              <div className="flex items-center gap-1 bg-[#fafafa] px-3 py-3">
                <button
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-1 text-left transition-colors hover:bg-white/80"
                  aria-expanded={expanded}
                >
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                      expanded && "rotate-90"
                    )}
                    strokeWidth={2}
                  />
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Target className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold leading-snug">
                      {goal.title}
                    </span>
                    {!expanded && rootCount > 0 && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {rootCount} ステップ
                      </span>
                    )}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground"
                  onClick={() => deleteGoal(goal.id)}
                  aria-label="目標を削除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {expanded && (
                <div className="border-t border-border/40 px-5 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loadingId === goal.id}
                    onClick={() => handleGenerate(goal.id, goal.title)}
                    className="mb-1"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
                    {loadingId === goal.id ? "生成中..." : "AIで候補を見る"}
                  </Button>

                  <GoalTaskSection
                    tasks={goalTasks}
                    onAddRootTask={(t) => addTask({ title: t, goalId: goal.id })}
                    onAddChildTask={(parentId, t) =>
                      addTask({
                        title: t,
                        goalId: goal.id,
                        parentTaskId: parentId,
                      })
                    }
                    onDeleteTask={deleteTask}
                  />

                  {suggestions[goal.id]?.length ? (
                    <div className="mt-6 rounded-xl border border-dashed border-border/80 bg-[#fafafa] p-4">
                      <p className="mb-3 text-xs font-medium text-muted-foreground">
                        AI候補
                      </p>
                      <ul className="space-y-2">
                        {suggestions[goal.id].map((task, i) => (
                          <li
                            key={`${goal.id}-${i}`}
                            className="rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                          >
                            {task.title}
                          </li>
                        ))}
                      </ul>
                      <Button
                        size="sm"
                        className="mt-3"
                        onClick={() => handleAddSuggestions(goal.id)}
                      >
                        ステップとして Inbox へ入れる
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
