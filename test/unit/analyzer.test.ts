// test/unit/analyzer.test.ts
import { it, expect } from "vitest";
import { analyze, fingerprint } from "../../src/engine/analyzer.js";
import { COMMAND_SIGNALS, FORGE_CMD_MARKER } from "../../src/payloads/injection.js";

it("returns finding when a signal matches", () => {
  const found = analyze({
    checkId: "path-traversal", tool: "read_file", payload: "../x",
    responseText: "root:x:0:0:root:/root:/bin/bash",
    signals: [/root:[x*]:0:0:/], severity: "high", title: "t", remediation: "r",
  });
  expect(found).not.toBeNull();
  expect(found!.confidence).toBe("confirmed");
});

it("returns null when nothing matches", () => {
  expect(analyze({ checkId: "ssrf", responseText: "connection refused", signals: [/ami-id/], severity: "high", title: "t", remediation: "r" })).toBeNull();
});

it("command signal fires when the marker was EXECUTED", () => {
  const found = analyze({
    checkId: "command-injection", tool: "run_command", payload: "; echo x",
    responseText: `Running: ; echo ${FORGE_CMD_MARKER}\n${FORGE_CMD_MARKER}\n`,
    signals: COMMAND_SIGNALS, severity: "critical", title: "t", remediation: "r",
  });
  expect(found).not.toBeNull();
});

it("command signal does NOT fire when the server merely echoed the raw payload", () => {
  // echo-only server: the only occurrence of the marker is preceded by "echo "
  const echoed = `Weather in \`; echo ${FORGE_CMD_MARKER}\`: 22°C`;
  expect(analyze({
    checkId: "command-injection", tool: "get_weather", payload: `\`; echo ${FORGE_CMD_MARKER}\``,
    responseText: echoed, signals: COMMAND_SIGNALS, severity: "critical", title: "t", remediation: "r",
  })).toBeNull();

  const echoedSubst = `Running: $(echo ${FORGE_CMD_MARKER})`;
  expect(analyze({
    checkId: "command-injection", tool: "get_weather", payload: `$(echo ${FORGE_CMD_MARKER})`,
    responseText: echoedSubst, signals: COMMAND_SIGNALS, severity: "critical", title: "t", remediation: "r",
  })).toBeNull();
});

it("fingerprints are stable and input-sensitive", () => {
  expect(fingerprint(["a", "b"])).toBe(fingerprint(["a", "b"]));
  expect(fingerprint(["a", "b"])).not.toBe(fingerprint(["a", "c"]));
});
