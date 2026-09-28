// test/unit/score.test.ts
import { it, expect } from "vitest";
import { computeScore } from "../../src/report/score.js";
import type { Finding } from "../../src/types.js";

const f = (severity: Finding["severity"], confidence: Finding["confidence"] = "confirmed"): Finding =>
  ({ checkId: "ssrf", severity, confidence, evidence: "e", title: "t", remediation: "r", fingerprint: "x" } as Finding);

it("A grade with no findings", () => {
  expect(computeScore([])).toEqual({ value: 100, grade: "A" });
});

it("single critical confirmed → F", () => {
  const { value, grade } = computeScore([f("critical")]);
  expect(value).toBe(60); // 100 - 40
  expect(grade).toBe("C");
});

it("multiple criticals sink to F", () => {
  expect(computeScore([f("critical"), f("critical")]).grade).toBe("F");
});

it("suspicious weighs less than confirmed", () => {
  expect(computeScore([f("high", "suspicious")]).value).toBeGreaterThan(computeScore([f("high", "confirmed")]).value);
});

it("score never goes below zero", () => {
  const many = Array.from({ length: 10 }, () => f("critical"));
  expect(computeScore(many).value).toBe(0);
});
