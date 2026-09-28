// test/unit/argPlanner.test.ts
import { describe, it, expect } from "vitest";
import { classifyArg, planCalls } from "../../src/engine/argPlanner.js";
import type { ToolInfo } from "../../src/types.js";

const tool: ToolInfo = {
  name: "read_file",
  description: "Read a file",
  inputSchema: {},
  properties: [
    { name: "path", type: "string", description: "file path", required: true },
    { name: "limit", type: "number", required: false },
  ],
  requiredArgNames: ["path"],
};

it("classifies path args", () => {
  expect(classifyArg(tool.properties[0])).toBe("path");
});

it("places payloads into the matching arg and fills benigns", () => {
  const calls = planCalls(tool, "path", ["../x", "/etc/x"], 12);
  expect(calls.length).toBe(2);
  expect(calls[0].args.path).toBe("../x");
  expect(calls[0].args.limit).toBe(1); // benign number
});

it("caps calls at maxCalls", () => {
  const many = Array.from({ length: 30 }, (_, i) => `p${i}`);
  expect(planCalls(tool, "path", many, 12).length).toBeLessThanOrEqual(12);
});
