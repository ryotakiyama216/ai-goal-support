"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAuthError } from "@/lib/authErrors";
import { createClient, isSupabaseConfigured, supabaseConfigHint } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const switchMode = (next: AuthMode) => {
    setMode(next);
    resetFeedback();
    setPasswordConfirm("");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;

    setLoading(true);
    resetFeedback();
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(formatAuthError(authError.message, authError.code));
        return;
      }

      window.location.assign("/today");
    } catch {
      setError("ログインに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return;

    if (password.length < 6) {
      setError("パスワードは6文字以上にしてください");
      return;
    }

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }

    setLoading(true);
    resetFeedback();
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            display_name: displayName.trim() || undefined,
          },
        },
      });

      if (authError) {
        setError(formatAuthError(authError.message, authError.code));
        return;
      }

      if (data.session) {
        window.location.assign("/today");
        return;
      }

      setMessage(
        "確認メールを送信しました。メール内のリンクを開いてからログインしてください。"
      );
      setMode("login");
      setPassword("");
      setPasswordConfirm("");
    } catch {
      setError("登録に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-muted-foreground">{supabaseConfigHint()}</p>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex gap-1 rounded-lg bg-[#fafafa] p-1">
        {(["login", "signup"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => switchMode(tab)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
              mode === tab
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab === "login" ? "ログイン" : "新規登録"}
          </button>
        ))}
      </div>

      <form
        onSubmit={mode === "login" ? handleLogin : handleSignup}
        className="space-y-4 text-left"
      >
        {mode === "signup" && (
          <label className="block space-y-2">
            <span className="text-sm font-medium">表示名（任意）</span>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="例: りょうた"
              autoComplete="name"
            />
          </label>
        )}

        <label className="block space-y-2">
          <span className="text-sm font-medium">メールアドレス</span>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">パスワード</span>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "6文字以上" : ""}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
            minLength={mode === "signup" ? 6 : undefined}
          />
        </label>

        {mode === "signup" && (
          <label className="block space-y-2">
            <span className="text-sm font-medium">パスワード（確認）</span>
            <Input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "処理中..."
            : mode === "login"
              ? "ログイン"
              : "アカウントを作成"}
        </Button>
      </form>
    </div>
  );
}
