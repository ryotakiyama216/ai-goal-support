"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { FileText, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memoPreview } from "@/lib/memoFormat";
import { useTaskStore } from "@/store/useTaskStore";

export function MemosView() {
  const router = useRouter();
  const hydrated = useTaskStore((s) => s.hydrated);
  const memos = useTaskStore((s) => s.memos);
  const addMemo = useTaskStore((s) => s.addMemo);
  const deleteMemo = useTaskStore((s) => s.deleteMemo);

  const sortedMemos = useMemo(
    () =>
      [...memos].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [memos]
  );

  const handleAdd = () => {
    const memo = addMemo();
    router.push(`/memo/${memo.id}`);
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-xl px-10 py-12">
        <p className="text-sm text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <header className="mb-10 flex items-center justify-between gap-4">
        <h2 className="text-4xl font-semibold tracking-tight">Memo</h2>
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          新規
        </Button>
      </header>

      {sortedMemos.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-[#fafafa] px-6 py-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            メモはまだありません。
            <br />
            思いついたことをマークダウンで残せます。
          </p>
          <Button size="sm" className="mt-5" onClick={handleAdd}>
            メモを作成
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {sortedMemos.map((memo) => {
            const preview = memoPreview(memo.content);
            return (
              <li key={memo.id}>
                <div className="flex items-center gap-1 rounded-xl border border-border/60 bg-white shadow-sm transition-colors hover:bg-[#fafafa]">
                  <Link
                    href={`/memo/${memo.id}`}
                    className="min-w-0 flex-1 px-4 py-3.5"
                  >
                    <p className="text-[15px] font-medium leading-snug">
                      {memo.title}
                    </p>
                    {preview && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {preview}
                      </p>
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 h-8 w-8 shrink-0 text-muted-foreground"
                    onClick={() => deleteMemo(memo.id)}
                    aria-label="メモを削除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
