import { NextResponse } from "next/server";
import { generateGoalTasks } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY が設定されていません" },
        { status: 500 }
      );
    }

    const { goal } = (await request.json()) as { goal?: string };
    if (!goal?.trim()) {
      return NextResponse.json(
        { error: "目標が空です" },
        { status: 400 }
      );
    }

    const tasks = await generateGoalTasks(goal.trim());
    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("[ai/generate-goal-tasks]", error);
    return NextResponse.json(
      { error: "タスク生成に失敗しました" },
      { status: 500 }
    );
  }
}
