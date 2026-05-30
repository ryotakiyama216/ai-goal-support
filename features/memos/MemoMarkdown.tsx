"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Target } from "lucide-react";
import { parseGoalIdFromHref } from "@/lib/memoGoals";
import { useTaskStore } from "@/store/useTaskStore";

type MemoMarkdownProps = {
  content: string;
};

export function MemoMarkdown({ content }: MemoMarkdownProps) {
  const goals = useTaskStore((s) => s.goals);
  const goalTitleById = Object.fromEntries(goals.map((g) => [g.id, g.title]));

  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className="mb-4 text-2xl font-semibold">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-3 mt-6 text-xl font-semibold">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-2 mt-4 text-lg font-medium">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 text-sm leading-relaxed">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pl-5 text-sm">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="mb-3 border-l-2 border-border pl-3 text-sm text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ className, children }) => {
          const inline = !className;
          if (inline) {
            return (
              <code className="rounded bg-[#fafafa] px-1 py-0.5 font-mono text-[13px]">
                {children}
              </code>
            );
          }
          return (
            <code className="block overflow-x-auto rounded-lg bg-[#fafafa] p-3 font-mono text-[13px] leading-relaxed">
              {children}
            </code>
          );
        },
        pre: ({ children }) => (
          <pre className="mb-3 overflow-x-auto">{children}</pre>
        ),
        a: ({ href, children }) => {
          const goalId = parseGoalIdFromHref(href);
          if (goalId) {
            const title = goalTitleById[goalId] ?? String(children);
            return (
              <Link
                href="/goals"
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-sm font-medium text-blue-700 no-underline transition-colors hover:bg-blue-100"
              >
                <Target className="h-3 w-3 shrink-0" />
                {title}
              </Link>
            );
          }
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 underline underline-offset-2"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
