import type { Finding, Severity } from "../types.js";

const WEIGHTS: Record<Severity, number> = {
  critical: 40, high: 20, medium: 8, low: 3, info: 0,
};
const CONFIDENCE_FACTOR = { confirmed: 1.0, suspicious: 0.6 };

export function computeScore(findings: Finding[]): { value: number; grade: "A" | "B" | "C" | "D" | "F" } {
  let penalty = 0;
  for (const f of findings) {
    penalty += WEIGHTS[f.severity] * (CONFIDENCE_FACTOR[f.confidence] ?? 1);
  }
  const value = Math.max(0, Math.round(100 - penalty));
  const grade = value >= 90 ? "A" : value >= 75 ? "B" : value >= 60 ? "C" : value >= 40 ? "D" : "F";
  return { value, grade };
}
