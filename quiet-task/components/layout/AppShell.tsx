import { Sidebar } from "@/components/layout/Sidebar";
import { AiChatLauncher } from "@/features/ai/AiChatLauncher";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <AiChatLauncher />
    </div>
  );
}
