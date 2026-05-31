"use client";

import { usePathname } from "next/navigation";
import { useTaskStore } from "@/store/useTaskStore";

export function AuthHydrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hydrated = useTaskStore((s) => s.hydrated);

  if (pathname === "/login") {
    return <>{children}</>;
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
