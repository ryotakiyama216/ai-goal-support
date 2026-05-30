import { NextResponse } from "next/server";
import { chatWithAssistant } from "@/lib/ai";
import type { UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const { message, profile } = (await request.json()) as {
      message?: string;
      profile?: UserProfile;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "メッセージが空です" }, { status: 400 });
    }

    const reply = await chatWithAssistant(message.trim(), {
      name: profile?.name ?? "",
      role: profile?.role ?? "",
      focus: profile?.focus ?? "",
      notes: profile?.notes ?? "",
    });
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[ai/chat]", error);
    return NextResponse.json(
      { error: "チャット応答の生成に失敗しました" },
      { status: 500 }
    );
  }
}
