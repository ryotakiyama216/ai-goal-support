import { NextResponse } from "next/server";
import { parseNaturalLanguage } from "@/lib/ai";
import { toDateString } from "@/lib/date";

export async function POST(request: Request) {
  try {
    const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
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
        hypothesisId: "H3",
        location: "app/api/ai/parse/route.ts:7",
        message: "api parse route entered",
        data: { hasApiKey },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!hasApiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const { input } = (await request.json()) as { input?: string };
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
        hypothesisId: "H4",
        location: "app/api/ai/parse/route.ts:30",
        message: "api parse payload received",
        data: { inputLength: input?.trim().length ?? 0 },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (!input?.trim()) {
      return NextResponse.json(
        { error: "入力が空です" },
        { status: 400 }
      );
    }

    const tasks = await parseNaturalLanguage(input.trim(), toDateString());
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[ai/parse]", error);
    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      typeof (error as { status?: unknown }).status === "number"
        ? ((error as { status: number }).status as number)
        : null;
    const code =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      typeof (error as { code?: unknown }).code === "string"
        ? ((error as { code: string }).code as string)
        : null;
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
        hypothesisId: "H5",
        location: "app/api/ai/parse/route.ts:45",
        message: "api parse route exception",
        data: {
          status,
          code,
          errorName: error instanceof Error ? error.name : "Unknown",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    if (status === 429 || code === "insufficient_quota") {
      // #region agent log
      fetch("http://127.0.0.1:7806/ingest/6ae0e873-cbdd-4198-91dc-762ce047c00b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "3713b0",
        },
        body: JSON.stringify({
          sessionId: "3713b0",
          runId: "post-fix",
          hypothesisId: "H6",
          location: "app/api/ai/parse/route.ts:81",
          message: "api parse mapped insufficient quota error",
          data: { status, code },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return NextResponse.json(
        {
          error:
            "OpenAI APIの利用上限に達しています。課金設定または利用上限をご確認ください。",
        },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "AIの解析に失敗しました" },
      { status: 500 }
    );
  }
}
