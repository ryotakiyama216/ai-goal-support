"use client";

import { useMemo } from "react";
import { AddTaskForm } from "@/features/tasks/AddTaskForm";
import { TaskTreeList } from "@/features/tasks/TaskTreeList";
import { getInboxTasks } from "@/lib/tasks";
import { useTaskStore } from "@/store/useTaskStore";

export function InboxView() {
  const tasks = useTaskStore((s) => s.tasks);
  const goals = useTaskStore((s) => s.goals);
  const addTask = useTaskStore((s) => s.addTask);
  const toggleComplete = useTaskStore((s) => s.toggleComplete);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const scheduleForToday = useTaskStore((s) => s.scheduleForToday);
  const startTask = useTaskStore((s) => s.startTask);
  const stopTask = useTaskStore((s) => s.stopTask);
  const moveTask = useTaskStore((s) => s.moveTask);
  const assignTaskToGoal = useTaskStore((s) => s.assignTaskToGoal);

  const inboxTasks = useMemo(() => getInboxTasks(tasks), [tasks]);
  const goalTitleById = useMemo(
    () => Object.fromEntries(goals.map((goal) => [goal.id, goal.title])),
    [goals]
  );
  const taskTitleById = useMemo(
    () => Object.fromEntries(tasks.map((task) => [task.id, task.title])),
    [tasks]
  );

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <header className="mb-12">
        <h2 className="text-4xl font-semibold tracking-tight">Inbox</h2>
      </header>

      <section className="mb-8 border-b border-border/40 pb-6">
        <AddTaskForm onAdd={(title) => addTask({ title })} />
      </section>

      <TaskTreeList
        tasks={inboxTasks}
        emptyMessage="Inboxは空です"
        goalTitleById={goalTitleById}
        taskTitleById={taskTitleById}
        onToggle={toggleComplete}
        onDelete={deleteTask}
        onStart={startTask}
        onStop={stopTask}
        onMoveTask={moveTask}
        onScheduleToday={scheduleForToday}
        goals={goals}
        onAssignToGoal={assignTaskToGoal}
        standaloneSectionTitle="他タスク"
      />
    </div>
  );
}
