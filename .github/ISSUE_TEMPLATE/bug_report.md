---
name: Bug report
about: Report a crash, false positive, or missed vulnerability in MCPForge
title: ''
labels: ['bug']
assignees: ['Pratham2511']
---

Thanks for testing MCPForge against a real server — that's exactly what makes this tool better.

**What happened?**
A clear and concise description. Which of these is it?

- [ ] Scanner crashed / hung
- [ ] False positive (finding reported on a server that is actually safe)
- [ ] Missed vulnerability (a server is vulnerable but MCPForge reported nothing)
- [ ] Wrong severity / evidence / fingerprint
- [ ] Report output problem (terminal / JSON / SARIF)
- [ ] Install / CLI problem

**Steps to reproduce**

```bash
# the exact mcpforge command you ran
mcpforge scan --stdio "..." --yes
```

**Target server (sanitized)**

- Name / package: (e.g. `@modelcontextprotocol/server-filesystem@1.2.3`)
- Transport: stdio / streamable-http / SSE
- The tool schema involved, if relevant:

```json
{ "name": "...", "inputSchema": { "...": "paste here" } }
```

**What you expected vs. what you got**

- Expected:
- Got: (paste the finding JSON / terminal excerpt — remember evidence is already masked)

**Environment**

- OS:
- Node: (`node --version`)
- mcpforge: (`npx mcpforge-cli --version`)

**Additional context**
Anything else — logs, SARIF output, screenshots.

> ⚠️ Please never paste real secrets into this issue. MCPForge masks evidence by design; keep it that way when you paste.
