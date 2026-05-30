"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toDateString } from "@/lib/date";
import { getSiblings, nextSortOrder, taskSortKey } from "@/lib/taskOrder";
import { collectDescendantIds } from "@/lib/taskTree";
import type { Goal, Task, UserProfile } from "@/types";

type TaskInput = {
  title: string;
  priority?: Task["priority"];
  dueDate?: string;
  scheduledDate?: string;
  goalId?: string;
  parentTaskId?: string;
};

type TaskStore = {
  tasks: Task[];
  goals: Goal[];
  profile: UserProfile;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  addTask: (input: TaskInput) => Task;
  addTasks: (inputs: TaskInput[]) => Task[];
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  startTask: (id: string) => void;
  stopTask: (id: string) => void;
  scheduleForToday: (id: string) => void;
  moveToInbox: (id: string) => void;
  moveTask: (id: string, direction: "up" | "down") => void;
  assignTaskToGoal: (id: string, goalId: string) => void;
  detachTaskFromGoal: (id: string) => void;
  addGoal: (title: string) => Goal;
  deleteGoal: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
};

function createTask(input: TaskInput, sortOrder: number): Task {
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    completed: false,
    priority: input.priority,
    dueDate: input.dueDate,
    scheduledDate: input.scheduledDate,
    goalId: input.goalId,
    parentTaskId: input.parentTaskId,
    sortOrder,
    createdAt: new Date().toISOString(),
  };
}

function createGoal(title: string): Goal {
  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    createdAt: new Date().toISOString(),
  };
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      goals: [],
      profile: {
        name: "",
        role: "",
        focus: "",
        notes: "",
      },
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      addTask: (input) => {
        let task!: Task;
        set((state) => {
          const order = nextSortOrder(state.tasks, input);
          task = createTask(input, order);
          return { tasks: [task, ...state.tasks] };
        });
        return task;
      },
      addTasks: (inputs) => {
        const tasks: Task[] = [];
        set((state) => {
          let current = [...state.tasks];
          for (const input of inputs.filter((i) => i.title.trim())) {
            const order = nextSortOrder(current, input);
            const task = createTask(input, order);
            tasks.push(task);
            current = [task, ...current];
          }
          return { tasks: [...tasks, ...state.tasks] };
        });
        return tasks;
      },
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),
      deleteTask: (id) =>
        set((state) => {
          const removeIds = new Set(collectDescendantIds(state.tasks, id));
          return {
            tasks: state.tasks.filter((task) => !removeIds.has(task.id)),
          };
        }),
      toggleComplete: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  inProgress: task.completed ? task.inProgress : false,
                }
              : task
          ),
        })),
      startTask: (id) =>
        set((state) => {
          const alreadyInProgress = state.tasks.some(
            (task) => task.inProgress && task.id !== id
          );
          if (alreadyInProgress) return state;
          return {
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, inProgress: true, completed: false } : task
            ),
          };
        }),
      stopTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, inProgress: false } : task
          ),
        })),
      scheduleForToday: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, scheduledDate: toDateString() }
              : task
          ),
        })),
      moveToInbox: (id) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, scheduledDate: undefined } : task
          ),
        })),
      moveTask: (id, direction) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const siblings = getSiblings(state.tasks, task);
          const index = siblings.findIndex((t) => t.id === id);
          const targetIndex = direction === "up" ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= siblings.length) return state;

          const other = siblings[targetIndex];
          const taskOrder = taskSortKey(task);
          const otherOrder = taskSortKey(other);

          return {
            tasks: state.tasks.map((t) => {
              if (t.id === task.id) return { ...t, sortOrder: otherOrder };
              if (t.id === other.id) return { ...t, sortOrder: taskOrder };
              return t;
            }),
          };
        }),
      assignTaskToGoal: (id, goalId) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const descendantIds = new Set(collectDescendantIds(state.tasks, id));
          const order = nextSortOrder(state.tasks, {
            goalId,
            parentTaskId: undefined,
          });

          return {
            tasks: state.tasks.map((t) => {
              if (t.id === id) {
                return {
                  ...t,
                  goalId,
                  parentTaskId: undefined,
                  sortOrder: order,
                };
              }
              if (descendantIds.has(t.id)) {
                return { ...t, goalId };
              }
              return t;
            }),
          };
        }),
      detachTaskFromGoal: (id) =>
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const descendantIds = new Set(collectDescendantIds(state.tasks, id));
          const order = nextSortOrder(state.tasks, {});

          return {
            tasks: state.tasks.map((t) => {
              if (t.id === id) {
                return {
                  ...t,
                  goalId: undefined,
                  parentTaskId: undefined,
                  sortOrder: order,
                };
              }
              if (descendantIds.has(t.id)) {
                return { ...t, goalId: undefined };
              }
              return t;
            }),
          };
        }),
      addGoal: (title) => {
        const goal = createGoal(title);
        set((state) => ({ goals: [goal, ...state.goals] }));
        return goal;
      },
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),
      updateProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
    }),
    {
      name: "quiet-task-storage",
      partialize: (state) => ({
        tasks: state.tasks,
        goals: state.goals,
        profile: state.profile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
