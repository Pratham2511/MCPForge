import type { ToolInfo, ToolSchemaProperty } from "../types.js";

export type ArgIntent = "path" | "url" | "command" | "sql" | "neutral";

const PATH_HINTS = /\b(path|file|filename|filepath|dir|directory|folder|read|open|load|doc|document|template|include|import)\b/i;
const URL_HINTS = /\b(url|uri|link|endpoint|host|hostname|domain|fetch|download|target|base_?url)\b/i;
const CMD_HINTS = /\b(cmd|command|exec|execute|shell|sh\b|bash|run|script|spawn|eval|program|binary)\b/i;
const SQL_HINTS = /\b(query|sql|search|filter|where|select|find|lookup|user|username|email|name|q\b|term|keyword)\b/i;

export function classifyArg(p: ToolSchemaProperty): ArgIntent {
  const hay = `${p.name} ${p.description ?? ""}`;
  if (CMD_HINTS.test(hay)) return "command";
  if (URL_HINTS.test(hay)) return "url";
  if (PATH_HINTS.test(hay)) return "path";
  if (SQL_HINTS.test(hay)) return "sql";
  return "neutral";
}

/** Benign filler by JSON-schema type, so required args don't reject the call. */
export function benignValue(p: ToolSchemaProperty): unknown {
  if (p.enum?.length) return p.enum[0];
  switch (p.type) {
    case "number":
    case "integer":
      return 1;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    case "string":
      return "mcpforge";
    default:
      return null;
  }
}

export interface PlannedCall {
  tool: ToolInfo;
  args: Record<string, unknown>;
  /** names of args that received an attack payload */
  attacked: string[];
  intent: ArgIntent;
}

/**
 * Build argument sets for a tool given a payload for a specific intent.
 * Strategy: pick the best-matching string arg for the intent; fill every other
 * required arg with benign values. Falls back to the first string arg.
 */
export function planCalls(
  tool: ToolInfo,
  intent: ArgIntent,
  payloadValues: string[],
  maxCalls: number
): PlannedCall[] {
  const stringProps = tool.properties.filter((p) => p.type === "string");
  if (stringProps.length === 0) return [];

  // rank args by intent match
  const ranked = [...stringProps].sort((a, b) => rank(classifyArg(b), intent) - rank(classifyArg(a), intent));
  const targets = ranked.filter((p) => rank(classifyArg(p), intent) > 0).slice(0, 2).length
    ? ranked.filter((p) => rank(classifyArg(p), intent) > 0).slice(0, 2)
    : [ranked[0]];

  const calls: PlannedCall[] = [];
  for (const target of targets) {
    for (const value of payloadValues) {
      if (calls.length >= maxCalls) break;
      const args: Record<string, unknown> = {};
      for (const p of tool.properties) {
        if (p.name === target.name) args[p.name] = value;
        else if (p.required || benignIsSafe(p)) args[p.name] = benignValue(p);
      }
      calls.push({ tool, args, attacked: [target.name], intent: classifyArg(target) });
    }
  }
  return calls.slice(0, maxCalls);
}

function benignIsSafe(p: ToolSchemaProperty): boolean {
  // optional args still get benign values to maximize call realism,
  // except object/array which some servers mishandle — keep them out.
  return p.type === "string" || p.type === "number" || p.type === "boolean" || p.type === "integer";
}

function rank(actual: ArgIntent, wanted: ArgIntent): number {
  if (wanted === "neutral") return actual === "neutral" ? 2 : 1;
  return actual === wanted ? 3 : actual === "neutral" ? 1 : 0;
}
