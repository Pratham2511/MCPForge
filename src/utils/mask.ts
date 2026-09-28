/** Mask a secret-ish string for safe display: keep first/last 2 chars. */
export function mask(s: string): string {
  const clean = s.replace(/\s+/g, " ").trim();
  if (clean.length <= 6) return "*".repeat(clean.length);
  return `${clean.slice(0, 3)}${"*".repeat(Math.min(12, clean.length - 6))}${clean.slice(-3)}`;
}

/** Extract a short excerpt around the first regex match, masked if needed. */
export function excerpt(text: string, matchIndex: number, radius = 80): string {
  const start = Math.max(0, matchIndex - radius);
  const end = Math.min(text.length, matchIndex + radius);
  return (start > 0 ? "…" : "") + text.slice(start, end).replace(/\s+/g, " ") + (end < text.length ? "…" : "");
}
