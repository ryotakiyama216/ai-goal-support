"use client";

import { useEffect, useState } from "react";
import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

const CHEAT_ITEMS = [
  { syntax: "# 見出し", label: "大見出し" },
  { syntax: "## 見出し", label: "中見出し" },
  { syntax: "### 見出し", label: "小見出し" },
  { syntax: "**太字**", label: "太字" },
  { syntax: "*斜体*", label: "斜体" },
  { syntax: "- 項目", label: "箇条書き" },
  { syntax: "1. 項目", label: "番号付きリスト" },
  { syntax: "> 引用", label: "引用" },
  { syntax: "`コード`", label: "インラインコード" },
  { syntax: "```\nコード\n```", label: "コードブロック" },
  { syntax: "[表示名](URL)", label: "リンク" },
  { syntax: "@", label: "目標をメンション" },
] as const;

type MemoMarkdownHelpButtonProps = {
  className?: string;
};

export function MemoMarkdownHelpButton({ className }: MemoMarkdownHelpButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className={cn("relative flex justify-end", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="マークダウン早見表"
        aria-expanded={open}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border border-border/60 bg-white text-muted-foreground shadow-sm transition-colors hover:bg-[#fafafa] hover:text-foreground",
          open && "border-foreground/20 text-foreground"
        )}
      >
        <Hash className="h-3.5 w-3.5" strokeWidth={2} />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="閉じる"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full z-20 mt-2 w-[300px] overflow-hidden rounded-xl border border-border/80 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="border-b border-border/60 bg-[#fafafa] px-3 py-2.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                マークダウン早見表
              </p>
            </div>

            <dl className="max-h-72 space-y-2.5 overflow-y-auto px-3 py-3">
              {CHEAT_ITEMS.map(({ syntax, label }) => (
                <div key={label} className="flex min-w-0 items-start gap-2.5">
                  <dt className="min-w-0 flex-1">
                    <code className="block whitespace-pre-wrap rounded-md bg-[#fafafa] px-2 py-1 font-mono text-[11px] leading-snug text-foreground">
                      {syntax}
                    </code>
                  </dt>
                  <dd className="w-16 shrink-0 pt-1 text-right text-[11px] text-muted-foreground">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="border-t border-border/50 px-3 py-2">
              <p className="text-[11px] text-muted-foreground">
                Esc または外側をクリックで閉じる
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
