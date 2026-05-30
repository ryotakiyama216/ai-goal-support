"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  GoalMentionPicker,
  PICKER_WIDTH,
} from "@/features/memos/GoalMentionPicker";
import {
  filterGoalsByQuery,
  formatGoalMention,
  getActiveMentionQuery,
} from "@/lib/memoGoals";
import { getTextareaCaretCoordinates } from "@/lib/textareaCaret";
import { useTaskStore } from "@/store/useTaskStore";
import type { Goal } from "@/types";

type MemoEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  placeholder?: string;
  className?: string;
};

type PickerPosition = {
  top: number;
  left: number;
};

const PICKER_HEIGHT_ESTIMATE = 280;

export function MemoEditor({
  value,
  onChange,
  onBlur,
  placeholder,
  className,
}: MemoEditorProps) {
  const goals = useTaskStore((s) => s.goals);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [mentionQuery, setMentionQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pickerPosition, setPickerPosition] = useState<PickerPosition | null>(
    null
  );

  const showMentionPicker = mentionStart !== null;
  const filteredGoals = filterGoalsByQuery(goals, mentionQuery);

  const updatePickerPosition = useCallback(() => {
    const textarea = textareaRef.current;
    const container = containerRef.current;
    if (!textarea || !container || mentionStart === null) {
      setPickerPosition(null);
      return;
    }

    const cursor = textarea.selectionStart;
    const caret = getTextareaCaretCoordinates(textarea, cursor);
    const containerWidth = container.clientWidth;

    let top = caret.top + caret.height + 10;
    let left = caret.left;

    left = Math.max(8, Math.min(left, containerWidth - PICKER_WIDTH - 8));

    if (top + PICKER_HEIGHT_ESTIMATE > textarea.clientHeight) {
      top = Math.max(8, caret.top - PICKER_HEIGHT_ESTIMATE - 6);
    }

    setPickerPosition({ top, left });
  }, [mentionStart]);

  useLayoutEffect(() => {
    if (!showMentionPicker) {
      setPickerPosition(null);
      return;
    }
    updatePickerPosition();
  }, [showMentionPicker, mentionQuery, value, selectedIndex, updatePickerPosition]);

  const syncMentionState = (content: string, cursor: number) => {
    const active = getActiveMentionQuery(content, cursor);
    if (!active) {
      setMentionStart(null);
      setMentionQuery("");
      setSelectedIndex(0);
      setPickerPosition(null);
      return;
    }
    setMentionStart(active.start);
    setMentionQuery(active.query);
    setSelectedIndex(0);
  };

  const insertMention = (goal: Goal) => {
    if (mentionStart === null) return;

    const textarea = textareaRef.current;
    const cursor = textarea?.selectionStart ?? value.length;
    const mention = formatGoalMention(goal);
    const next =
      value.slice(0, mentionStart) + mention + value.slice(cursor);

    onChange(next);
    setMentionStart(null);
    setMentionQuery("");
    setSelectedIndex(0);
    setPickerPosition(null);

    requestAnimationFrame(() => {
      if (!textarea) return;
      const nextCursor = mentionStart + mention.length;
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    syncMentionState(next, e.target.selectionStart);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!showMentionPicker) return;

    if (e.key === "Escape") {
      setMentionStart(null);
      setMentionQuery("");
      setPickerPosition(null);
      return;
    }

    if (filteredGoals.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filteredGoals.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (i) => (i - 1 + filteredGoals.length) % filteredGoals.length
      );
      return;
    }

    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insertMention(filteredGoals[selectedIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onBlur={() => {
          setMentionStart(null);
          setPickerPosition(null);
          onBlur();
        }}
        onKeyDown={handleKeyDown}
        onScroll={updatePickerPosition}
        onClick={(e) => {
          syncMentionState(value, e.currentTarget.selectionStart);
          requestAnimationFrame(updatePickerPosition);
        }}
        placeholder={placeholder}
        className={className}
      />

      {showMentionPicker && pickerPosition && (
        <GoalMentionPicker
          top={pickerPosition.top}
          left={pickerPosition.left}
          goals={filteredGoals}
          selectedIndex={selectedIndex}
          query={mentionQuery}
          hasGoals={goals.length > 0}
          onSelect={insertMention}
          onHover={setSelectedIndex}
        />
      )}
    </div>
  );
}
