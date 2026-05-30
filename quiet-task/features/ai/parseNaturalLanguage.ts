import type { ParsedTask } from "@/types";

export async function parseNaturalLanguage(
  input: string
): Promise<ParsedTask[]> {
  // #region agent log
  fetch("http://127.0.0.1:7806/ingest/6ae0e873-cbdd-4198-91dc-762ce047c00b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "3713b0",
    },
    body: JSON.stringify({
      sessionId: "3713b0",
      runId: "initial",
      hypothesisId: "H1",
      location: "features/ai/parseNaturalLanguage.ts:6",
      message: "client parse request start",
      data: { inputLength: input.length },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  const res = await fetch("/api/ai/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    // #region agent log
    fetch("http://127.0.0.1:7806/ingest/6ae0e873-cbdd-4198-91dc-762ce047c00b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "3713b0",
      },
      body: JSON.stringify({
        sessionId: "3713b0",
        runId: "initial",
        hypothesisId: "H2",
        location: "features/ai/parseNaturalLanguage.ts:17",
        message: "client parse request failed",
        data: { status: res.status, error: data?.error ?? null },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    throw new Error(data.error ?? "AIの解析に失敗しました");
  }

  const data = (await res.json()) as { tasks: ParsedTask[] };
  return data.tasks;
}

export async function generateGoalTasks(goal: string): Promise<ParsedTask[]> {
  const res = await fetch("/api/ai/generate-goal-tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "タスク生成に失敗しました");
  }

  const data = (await res.json()) as { tasks: ParsedTask[] };
  return data.tasks;
}
