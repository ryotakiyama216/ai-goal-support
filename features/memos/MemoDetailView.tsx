"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Target, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemoEditor } from "@/features/memos/MemoEditor";
import { MemoMarkdown } from "@/features/memos/MemoMarkdown";
import { MemoMarkdownHelpButton } from "@/features/memos/MemoMarkdownCheatSheet";
import { extractGoalIdsFromContent } from "@/lib/memoGoals";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";

type MemoDetailViewProps = {
  memoId: string;
};

type ViewMode = "edit" | "preview";

export function MemoDetailView({ memoId }: MemoDetailViewProps) {
  const router = useRouter();
  const hydrated = useTaskStore((s) => s.hydrated);
  const memos = useTaskStore((s) => s.memos);
  const goals = useTaskStore((s) => s.goals);
  const updateMemo = useTaskStore((s) => s.updateMemo);
  const deleteMemo = useTaskStore((s) => s.deleteMemo);

  const memo = useMemo(
    () => memos.find((m) => m.id === memoId),
    [memos, memoId]
  );

  const [titleDraft, setTitleDraft] = useState<string | null>(null);
  const [contentDraft, setContentDraft] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");

  const displayTitle = titleDraft ?? memo?.title ?? "";
  const displayContent = contentDraft ?? memo?.content ?? "";

  const linkedGoals = useMemo(() => {
    const ids = extractGoalIdsFromContent(displayContent);
    return ids
      .map((id) => goals.find((g) => g.id === id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g));
  }, [displayContent, goals]);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-xl px-10 py-12">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!memo) {
    return (
      <div className="mx-auto max-w-xl px-10 py-12">
        <p className="text-sm text-muted-foreground">
          メモが見つかりませんでした。
        </p>
        <Link
          href="/memo"
          className="mt-4 inline-flex h-8 items-center rounded-md border border-border px-3 text-xs font-medium hover:bg-accent"
        >
          Memo へ戻る
        </Link>
      </div>
    );
  }

  const commitTitle = () => {
    const trimmed = displayTitle.trim();
    if (!trimmed || trimmed === memo.title) {
      setTitleDraft(null);
      return;
    }
    updateMemo(memo.id, { title: trimmed });
    setTitleDraft(null);
  };

  const commitContent = () => {
    if (displayContent === memo.content) {
      setContentDraft(null);
      return;
    }
    updateMemo(memo.id, { content: displayContent });
    setContentDraft(null);
  };

  const handleDelete = () => {
    deleteMemo(memo.id);
    router.push("/memo");
  };

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <header className="mb-8">
        <Link
          href="/memo"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
          Memo
        </Link>

        <Input
          value={displayTitle}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={commitTitle}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitTitle();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="border-0 bg-transparent px-0 text-2xl font-semibold leading-snug shadow-none focus-visible:ring-0"
        />

        {linkedGoals.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {linkedGoals.map((goal) => (
              <Link
                key={goal.id}
                href="/goals"
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                <Target className="h-3 w-3" />
                {goal.title}
              </Link>
            ))}
          </div>
        )}
      </header>

      <MemoMarkdownHelpButton className="mb-2" />

      <div className="mb-3 flex gap-1 rounded-lg bg-[#fafafa] p-1">
        {(["edit", "preview"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => {
              if (mode === "preview") commitContent();
              setViewMode(mode);
            }}
            className={cn(
              "flex-1 rounded-md py-1.5 text-xs font-medium transition-colors",
              viewMode === mode
                ? "bg-white text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {mode === "edit" ? "編集" : "プレビュー"}
          </button>
        ))}
      </div>

      {viewMode === "edit" ? (
        <MemoEditor
          value={displayContent}
          onChange={setContentDraft}
          onBlur={commitContent}
          placeholder={"# 見出し\n\n@ で目標をメンションできます。"}
          className="min-h-[420px] resize-y border-border/60 bg-white font-mono text-sm leading-relaxed shadow-none"
        />
      ) : (
        <article className="min-h-[420px] rounded-xl border border-border/60 bg-white px-5 py-4">
          {displayContent.trim() ? (
            <MemoMarkdown content={displayContent} />
          ) : (
            <p className="text-sm text-muted-foreground">内容がありません。</p>
          )}
        </article>
      )}

      <section className="mt-6 flex justify-end border-t border-border/40 pt-6">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          削除
        </Button>
      </section>
    </div>
  );
}
