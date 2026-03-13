# State — mcp-sap-cpi

## Current Position
**Milestone:** 1 — v0.1.0 Working MCP with Core Tools
**Current Phase:** 1 — Project Scaffold + Auth + CPI Client (NOT STARTED)
**Next Action:** /gsd:plan-phase 1

## Decisions
| Date | Decision | Reason |
|---|---|---|
| 2026-03-13 | Standalone npm package first, tics-sap-ai-suite consumes later | OSS funnel, first-mover on SAP CPI MCP |
| 2026-03-13 | Node.js + TypeScript (not Python) | MCP SDK is best-supported in JS/TS |
| 2026-03-13 | stdio transport (not HTTP) | Standard for local MCP servers, works with Claude Desktop + Claude Code |
| 2026-03-13 | OAuth2 client credentials only (no basic auth) | CPI best practice, BTP service key standard |

## Blockers
- None yet
- Note: Nyquist compliance deferred — no test infrastructure at project start (--skip-verify on plan-phase)

## Context
- CPI OData API base: `https://<tenant>.it-cpi.cfapps.<region>.hana.ondemand.com/api/v1`
- Token URL pattern: `https://<subdomain>.authentication.<region>.hana.ondemand.com/oauth/token`
- MCP SDK: `@modelcontextprotocol/sdk` (npm)
- Transport: StdioServerTransport
