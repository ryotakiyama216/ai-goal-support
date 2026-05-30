"use client";

import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { parseNaturalLanguage } from "@/features/ai/parseNaturalLanguage";
import { useTaskStore } from "@/store/useTaskStore";

export function NaturalLanguageInput() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addTasks = useTaskStore((s) => s.addTasks);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);
    try {
      const tasks = await parseNaturalLanguage(trimmed);
      if (tasks.length === 0) {
        setError("タスクを認識できませんでした");
        return;
      }
      addTasks(tasks);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-10 rounded-xl border border-dashed border-border/80 bg-[#fafafa]/50 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
        <span>自然言語で追加（静かなAI）</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="例: 明日までにnote書いて病院予約"
          className="min-h-[72px] border-0 bg-white shadow-none"
          disabled={loading}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button
          type="submit"
          variant="outline"
          size="sm"
          disabled={!input.trim() || loading}
        >
          {loading ? "整理中..." : "タスクに分解"}
        </Button>
      </form>
    </section>
  );
}
