import { AuthForm } from "@/features/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Quiet
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Task</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          タスク・目標・メモはクラウドに保存されます
        </p>

        <div className="mt-8">
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
