"use client";

import { usePathname } from "next/navigation";
import { AuthHydrationGate } from "@/components/AuthHydrationGate";
import { Sidebar } from "@/components/layout/Sidebar";
import { AiChatLauncher } from "@/features/ai/AiChatLauncher";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <AuthHydrationGate>{children}</AuthHydrationGate>
      </main>
      <AiChatLauncher />
    </div>
  );
}
