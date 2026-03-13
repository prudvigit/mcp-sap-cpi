# Roadmap — mcp-sap-cpi

## Milestone 1: v0.1.0 — Working MCP with Core Tools

### Phase 1: Project Scaffold + Auth + CPI Client
**Goal:** Runnable MCP server skeleton with OAuth2 token management and base CPI API client.
**Requirements:** NF-01, NF-02, NF-03
**Success criteria:**
- `npm run dev` starts the MCP server without errors
- OAuth2 token fetched and cached on first tool call
- Token auto-refreshed on expiry
- Base axios client with tenant URL + auth header injection
- `.env.example` documents all required vars
- MCP server registers with no tools yet (ping test passes)

### Phase 2: Message Monitoring Tools
**Goal:** Claude can query failed messages, get MPL details, and retrieve trace logs.
**Requirements:** MSG-01, MSG-02, MSG-03, MSG-04
**Success criteria:**
- `get_failed_messages` returns list with messageId, status, artifactName, error
- `get_message_details` returns full MPL for a given messageId
- `get_trace_log` returns step-by-step payload trace
- All tools handle 404 / no-results gracefully

### Phase 3: Integration Content Tools
**Goal:** Claude can browse packages, list artifacts, deploy/undeploy, and download iFlow content.
**Requirements:** CON-01, CON-02, CON-03, CON-04, CON-05, CON-06
**Success criteria:**
- `list_packages` returns all packages with Id, Name, Version
- `list_artifacts` returns artifacts filtered by packageId
- `deploy_artifact` triggers deploy and returns status
- `undeploy_artifact` triggers undeploy and returns status
- `get_artifact_content` returns base64 zip content

### Phase 4: Security + Value Mapping + Runtime Tools
**Goal:** Full tool surface — credentials, keystores, OAuth2 configs, value maps, runtime status.
**Requirements:** SEC-01, SEC-02, SEC-03, VM-01, VM-02, RT-01, RT-02
**Success criteria:**
- All security listing tools return correct artifact lists
- `query_value_mapping` returns correct target value for given source
- `get_runtime_artifacts` returns deployed artifact statuses
- `get_system_status` returns health summary

### Phase 5: npm Publish + README + Claude Config Examples
**Goal:** Package ready for public release.
**Requirements:** NF-04
**Success criteria:**
- `package.json` has correct name, version, bin entry, keywords (sap, cpi, mcp)
- README covers: install, .env setup, Claude Desktop config, all tools documented
- `npx mcp-sap-cpi` works from a clean install
- Published to npm as v0.1.0

## Status
- [ ] Phase 1 — Scaffold + Auth
- [ ] Phase 2 — Message Monitoring
- [ ] Phase 3 — Integration Content
- [ ] Phase 4 — Security + VM + Runtime
- [ ] Phase 5 — Publish
