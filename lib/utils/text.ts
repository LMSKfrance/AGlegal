export function truncateChars(text: string | null | undefined, maxChars: number): string {
  if (!text) return "";
  const trimmed = text.trim();
  if (trimmed.length <= maxChars) return trimmed;
  return `${trimmed.slice(0, maxChars - 1).trimEnd()}…`;
}

export function oneWord(text: string | null | undefined): string {
  if (!text) return "";
  return text.trim().split(/\s+/)[0] ?? "";
}

