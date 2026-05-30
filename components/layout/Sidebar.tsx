"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, FileText, Inbox, Settings, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/memo", label: "Memo", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-border/60 bg-[#fafafa] px-4 py-8">
      <div className="mb-10 px-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Quiet
        </p>
        <h1 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
          Task
        </h1>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            pathname.startsWith(`${href}/`) ||
            (href === "/inbox" && pathname.startsWith("/tasks/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
