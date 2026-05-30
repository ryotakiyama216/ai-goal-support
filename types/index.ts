export type Priority = "low" | "medium" | "high";

export type Task = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  inProgress?: boolean;
  priority?: Priority;
  dueDate?: string;
  scheduledDate?: string;
  goalId?: string;
  parentTaskId?: string;
  sortOrder?: number;
  createdAt: string;
};

export type Goal = {
  id: string;
  title: string;
  createdAt: string;
};

export type UserProfile = {
  name: string;
  role: string;
  focus: string;
  notes: string;
};

export type ParsedTask = {
  title: string;
  priority?: Priority;
  dueDate?: string;
  scheduledDate?: string;
};

export type Memo = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};
