"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useTaskStore } from "@/store/useTaskStore";

export function AuthSection() {
  const router = useRouter();
  const profileName = useTaskStore((s) => s.profile.name);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (!isSupabaseConfigured()) return;
    setAuthLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } finally {
      setAuthLoading(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <section className="mb-8 rounded-xl border border-border/60 p-5">
        <h3 className="mb-2 text-sm font-medium">アカウント</h3>
        <p className="text-sm text-muted-foreground">
          Supabase の環境変数が未設定です。
        </p>
      </section>
    );
  }

  const displayName =
    profileName.trim() ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "";

  return (
    <section className="mb-8 rounded-xl border border-border/60 p-5">
      <h3 className="mb-4 text-sm font-medium">アカウント</h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">確認中...</p>
      ) : user ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={authLoading}
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" />
            ログアウト
          </Button>
        </div>
      ) : null}
    </section>
  );
}
