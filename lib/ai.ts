import OpenAI from "openai";
import type { ParsedTask, UserProfile } from "@/types";

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY が設定されていません");
  }
  return new OpenAI({ apiKey });
}

const PARSE_SYSTEM = `あなたは静かなタスク整理アシスタントです。
ユーザーの自然言語を、行動可能なタスクに分解してください。

ルール:
- タスクは最大5件
- 各タスクは短く具体的に（20文字以内を目安）
- 不要なタスクを増やさない
- 期限が読み取れる場合は dueDate (YYYY-MM-DD) を設定
- 今日やるべきものは scheduledDate (YYYY-MM-DD) を今日の日付に
- priority は low / medium / high のいずれかか省略

JSONのみ返答:
{"tasks":[{"title":"string","priority?":"low|medium|high","dueDate?":"YYYY-MM-DD","scheduledDate?":"YYYY-MM-DD"}]}`;

const GOAL_SYSTEM = `あなたは静かなタスク整理アシスタントです。
ユーザーの目標から、最初に取り組むべき行動可能なタスク候補を生成してください。

ルール:
- タスクは3〜5件
- 行動可能な粒度（「調査する」「書く」「決める」など）
- タスク墓場を作らない（細かすぎない、大きすぎない）
- 各タスクは短く（25文字以内を目安）

JSONのみ返答:
{"tasks":[{"title":"string"}]}`;

const CHAT_SYSTEM = `あなたは静かなタスク伴走アシスタントです。
ユーザーが1つのタスクに集中できるように、短く実行可能な提案を返してください。

ルール:
- 回答は3文以内
- 曖昧な励ましだけで終わらせない
- 必要なら最初の1アクションを1つ示す`;

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1].trim() : trimmed;
  return JSON.parse(raw);
}

export async function parseNaturalLanguage(
  input: string,
  today: string
): Promise<ParsedTask[]> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    messages: [
      { role: "system", content: PARSE_SYSTEM },
      {
        role: "user",
        content: `今日の日付: ${today}\n\n入力:\n${input}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("AI response empty");

  const parsed = extractJson(content) as { tasks?: ParsedTask[] };
  return (parsed.tasks ?? []).slice(0, 5);
}

export async function generateGoalTasks(goal: string): Promise<ParsedTask[]> {
  const openai = getOpenAIClient();
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: GOAL_SYSTEM },
      { role: "user", content: `目標:\n${goal}` },
    ],
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("AI response empty");

  const parsed = extractJson(content) as { tasks?: ParsedTask[] };
  return (parsed.tasks ?? []).slice(0, 5);
}

export async function chatWithAssistant(
  message: string,
  profile: UserProfile
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "AIキー未設定のためローカルモードです。Settingsの基本情報を保存し、要望を1行で送る運用がおすすめです。";
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    messages: [
      { role: "system", content: CHAT_SYSTEM },
      {
        role: "user",
        content: `ユーザー基本情報:
名前: ${profile.name || "未設定"}
役割: ${profile.role || "未設定"}
重点: ${profile.focus || "未設定"}
補足: ${profile.notes || "未設定"}

相談:
${message}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() ?? "応答を生成できませんでした。";
}
