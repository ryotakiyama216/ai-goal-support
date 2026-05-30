# ai-goal-support# Quiet Task

Thingsライクな、静かなAIタスク管理アプリ（PoC）

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に OPENAI_API_KEY を設定
npm run dev
```

http://localhost:3000 で起動（`/today` にリダイレクト）

## 機能

- **Today** — 今日やるタスク
- **Inbox** — タスクの追加・完了・削除、AI自然言語入力
- **Goals** — 目標からタスク候補をAI生成（最大5件）

## 技術スタック

Next.js 14 · TypeScript · Tailwind CSS · Zustand · OpenAI API · localStorage
