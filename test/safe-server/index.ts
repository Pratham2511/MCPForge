/** stdio entry for the hardened control server. */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildSafeServer } from "./app.js";

const server = buildSafeServer();
await server.connect(new StdioServerTransport());
