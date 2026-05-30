"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AddTaskFormProps = {
  placeholder?: string;
  onAdd: (title: string) => void;
};

export function AddTaskForm({
  placeholder = "新しいタスク",
  onAdd,
}: AddTaskFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        className="border-0 bg-transparent px-2 shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="shrink-0 text-muted-foreground"
        disabled={!title.trim()}
        aria-label="追加"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
