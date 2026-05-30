export function memoPreview(content: string): string {
  return content
    .replace(/\[@[^\]]*\]\(goal:[^)]+\)/g, "")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
