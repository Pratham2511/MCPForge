import pc from "picocolors";

const QUIET = process.env.MCPF0RGE_QUIET === "1";

export const log = {
  info: (msg: string) => { if (!QUIET) console.error(pc.dim(`[mcpforge] ${msg}`)); },
  warn: (msg: string) => { if (!QUIET) console.error(pc.yellow(`[mcpforge] ${msg}`)); },
  error: (msg: string) => console.error(pc.red(`[mcpforge] ${msg}`)),
};
