import type { Client } from "@modelcontextprotocol/sdk/client/index.js";

export interface ToolCallOutcome {
  ok: boolean;
  isError: boolean;
  text: string;          // concatenated text content, capped
  structured?: unknown;  // structuredContent if present
  durationMs: number;
  error?: string;        // transport/timeout error (ok=false)
}

const MAX_CAPTURE_CHARS = 20_000;

function cap(s: string): string {
  return s.length > MAX_CAPTURE_CHARS ? s.slice(0, MAX_CAPTURE_CHARS) : s;
}

/**
 * Invoke a tool with a hard timeout. Never throws: returns outcome.
 * We deliberately do NOT reconnect inside the executor; the scanner decides
 * whether a timeout is fatal per-check.
 */
export async function callToolSafe(
  client: Client,
  name: string,
  args: Record<string, unknown>,
  timeoutMs: number
): Promise<ToolCallOutcome> {
  const started = Date.now();
  let timer: NodeJS.Timeout | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
    });
    const result = (await Promise.race([
      client.callTool({ name, arguments: args }),
      timeout,
    ])) as any;

    const textParts: string[] = [];
    for (const block of result?.content ?? []) {
      if (block?.type === "text" && typeof block.text === "string") textParts.push(block.text);
      else if (block?.type === "resource") {
        const r = block.resource ?? {};
        if (typeof (r as any).text === "string") textParts.push((r as any).text);
        else if (typeof (r as any).blob === "string") textParts.push(`[blob ${String((r as any).uri ?? "")}]`);
      }
    }
    return {
      ok: true,
      isError: Boolean(result?.isError),
      text: cap(textParts.join("\n")),
      structured: result?.structuredContent,
      durationMs: Date.now() - started,
    };
  } catch (err: any) {
    return {
      ok: false,
      isError: false,
      text: "",
      durationMs: Date.now() - started,
      error: err?.message ?? String(err),
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function readResourceSafe(
  client: Client,
  uri: string,
  timeoutMs: number
): Promise<{ ok: boolean; text: string; error?: string }> {
  let timer: NodeJS.Timeout | undefined;
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`timeout after ${timeoutMs}ms`)), timeoutMs);
    });
    const res = (await Promise.race([client.readResource({ uri }), timeout])) as any;
    const texts: string[] = [];
    for (const c of res?.contents ?? []) {
      if (typeof c?.text === "string") texts.push(c.text);
      else if (typeof c?.blob === "string") texts.push(`[blob ${String(c?.uri ?? "")}]`);
    }
    return { ok: true, text: cap(texts.join("\n")) };
  } catch (err: any) {
    return { ok: false, text: "", error: err?.message ?? String(err) };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
