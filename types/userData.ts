import type { Goal, Memo, Task, UserProfile } from "@/types";

export type UserDataPayload = {
  tasks: Task[];
  goals: Goal[];
  memos: Memo[];
  profile: UserProfile;
};

export const emptyUserDataPayload = (): UserDataPayload => ({
  tasks: [],
  goals: [],
  memos: [],
  profile: {
    name: "",
    role: "",
    focus: "",
    notes: "",
  },
});

export function isUserDataPayload(value: unknown): value is UserDataPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as UserDataPayload;
  return (
    Array.isArray(v.tasks) &&
    Array.isArray(v.goals) &&
    Array.isArray(v.memos) &&
    typeof v.profile === "object" &&
    v.profile !== null
  );
}
