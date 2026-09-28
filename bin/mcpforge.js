#!/usr/bin/env node
import("../dist/cli.js").catch((err) => {
  console.error("[mcpforge] failed to load dist/cli.js — did you run `npm run build`?", err?.message ?? err);
  process.exit(2);
});
