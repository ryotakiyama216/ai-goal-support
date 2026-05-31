export function formatAuthError(message: string, errorCode?: string): string {
  if (
    message.toLowerCase().includes("email signups are disabled") ||
    errorCode === "signup_disabled"
  ) {
    return "メールでの新規登録がオフです。Supabase → Authentication → Providers → Email で「Enable Email provider」と「Enable sign ups」をオンにしてください（Confirm email だけオフ）。";
  }

  if (
    errorCode === "email_rate_limit_exceeded" ||
    message.toLowerCase().includes("rate limit")
  ) {
    return "確認メールの送信上限に達しました。しばらく待つか、Supabase で「Confirm email」をオフにしてください。";
  }

  if (message === "Invalid login credentials") {
    return "メールアドレスまたはパスワードが正しくありません";
  }

  if (errorCode === "email_not_confirmed") {
    return "メールアドレスの確認が完了していません。届いたメールのリンクを開いてください。";
  }

  return message;
}
