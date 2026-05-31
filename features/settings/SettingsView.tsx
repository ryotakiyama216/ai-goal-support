"use client";

import { AuthSection } from "@/features/settings/AuthSection";
import { useTaskStore } from "@/store/useTaskStore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SettingsView() {
  const profile = useTaskStore((s) => s.profile);
  const updateProfile = useTaskStore((s) => s.updateProfile);

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <header className="mb-10">
        <h2 className="text-4xl font-semibold tracking-tight">Settings</h2>
      </header>

      <AuthSection />

      <div className="space-y-5 rounded-xl border border-border/60 p-5">
        <label className="block space-y-2">
          <p className="text-sm font-medium">名前</p>
          <Input
            value={profile.name}
            onChange={(e) => updateProfile({ name: e.target.value })}
            placeholder="例: りょうた"
          />
        </label>

        <label className="block space-y-2">
          <p className="text-sm font-medium">役割</p>
          <Input
            value={profile.role}
            onChange={(e) => updateProfile({ role: e.target.value })}
            placeholder="例: 個人開発者 / 会社員"
          />
        </label>

        <label className="block space-y-2">
          <p className="text-sm font-medium">今の重点</p>
          <Input
            value={profile.focus}
            onChange={(e) => updateProfile({ focus: e.target.value })}
            placeholder="例: 仕事と開発の両立"
          />
        </label>

        <label className="block space-y-2">
          <p className="text-sm font-medium">補足メモ</p>
          <Textarea
            value={profile.notes}
            onChange={(e) => updateProfile({ notes: e.target.value })}
            placeholder="例: 平日は夜1時間だけ作業できる"
            className="min-h-[96px]"
          />
        </label>
      </div>
    </div>
  );
}
