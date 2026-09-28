import type { Client } from "@modelcontextprotocol/sdk/client/index.js";
import type { Inventory, ToolInfo, ToolSchemaProperty } from "../types.js";

function parseProperties(schema: Record<string, unknown>): ToolSchemaProperty[] {
  const props = (schema?.properties ?? {}) as Record<string, any>;
  const required = new Set<string>((schema?.required as string[]) ?? []);
  return Object.entries(props).map(([name, def]) => ({
    name,
    type: String(def?.type ?? "unknown"),
    description: typeof def?.description === "string" ? def.description : undefined,
    required: required.has(name),
    enum: Array.isArray(def?.enum) ? def.enum.map(String) : undefined,
  }));
}

export async function inventory(client: Client): Promise<Inventory> {
  const tools: ToolInfo[] = [];
  let cursor: string | undefined;
  do {
    const res = await client.listTools(cursor ? { cursor } : undefined);
    for (const t of res.tools) {
      tools.push({
        name: t.name,
        description: t.description ?? "",
        inputSchema: (t.inputSchema ?? {}) as Record<string, unknown>,
        properties: parseProperties((t.inputSchema ?? {}) as Record<string, unknown>),
        requiredArgNames: ((t.inputSchema as any)?.required as string[]) ?? [],
      });
    }
    cursor = res.nextCursor;
  } while (cursor);

  const resources: Inventory["resources"] = [];
  try {
    let rc: string | undefined;
    do {
      const res = await client.listResources(rc ? { cursor: rc } : undefined);
      for (const r of res.resources) {
        resources.push({ uri: r.uri, name: r.name, description: r.description, mimeType: r.mimeType });
      }
      rc = res.nextCursor;
    } while (rc);
  } catch {
    // server may not declare resources capability
  }

  const prompts: Inventory["prompts"] = [];
  try {
    let pc: string | undefined;
    do {
      const res = await client.listPrompts(pc ? { cursor: pc } : undefined);
      for (const p of res.prompts) prompts.push({ name: p.name, description: p.description });
      pc = res.nextCursor;
    } while (pc);
  } catch {
    // server may not declare prompts capability
  }

  return { tools, resources, prompts };
}
