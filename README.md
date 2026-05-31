# Quiet Task

Thingsライクな、静かなAIタスク管理アプリ（PoC）

## セットアップ

```bash
npm install
cp .env.example .env.local
# .env.local に OPENAI_API_KEY / Supabase のキーを設定
npm run dev
```

http://localhost:3000 で起動（未ログイン時は `/login` へ）

## Supabase（データ保存・メール認証）

1. [Supabase](https://supabase.com) でプロジェクトを作成（**Paused 状態の場合は Dashboard から再開**）
2. **SQL Editor** で [`supabase/migrations/001_user_data.sql`](supabase/migrations/001_user_data.sql) を実行
3. **Authentication → Providers → Email** を有効化（デフォルトで ON）
4. **開発中は「Confirm email」をオフ推奨**（確認メール送信のレート制限を避け、登録後すぐログイン可能）
5. **Project Settings → API** から URL と `anon` key をコピー

### ローカル（`.env.local`）

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
```

### Vercel デプロイ

`.env.local` は Vercel にアップロードされません。**Dashboard で環境変数を設定**してください。

1. [Vercel Dashboard](https://vercel.com) → 対象プロジェクト → **Settings** → **Environment Variables**
2. 以下を追加（Environment は **Production** / **Preview** / **Development** すべてにチェック推奨）

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase の Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase の anon public key |
| `OPENAI_API_KEY` | OpenAI API キー（AI 機能を使う場合） |

3. **Deployments** → 最新デプロイの **⋯** → **Redeploy**（環境変数追加後は再デプロイ必須）

4. Supabase → **Authentication → URL Configuration** に本番 URL を追加:
   - `https://<your-vercel-domain>/auth/callback`

**ログイン必須**です。メールアドレスで新規登録・ログインし、タスク・目標・メモ・プロフィールは Supabase に自動保存されます。

### トラブルシュート

- **`email rate limit exceeded`** … 確認メールの送信上限（無料枠は厳しめ）。**Confirm email だけオフ**にするか、1時間ほど待ってから再試行。
- **`Email signups are disabled`** … Email プロバイダー自体がオフ。**Enable Email provider** と **Enable sign ups** はオン、**Confirm email** だけオフにする。
- **`.env.local` を設定してください`（Vercel 上）** … Vercel の **Environment Variables** に Supabase の 2 変数を設定し、**Redeploy** する。

## 機能

- **Today** — 今日やるタスク
- **Inbox** — タスクの追加・完了・削除、AI自然言語入力
- **Goals** — 目標からタスク候補をAI生成（最大5件）
- **Memo** — マークダウンメモ、目標の @ メンション
- **Settings** — プロフィール、ログアウト

## 技術スタック

Next.js 14 · TypeScript · Tailwind CSS · Zustand · Supabase · OpenAI API
