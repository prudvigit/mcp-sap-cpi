# Requirements — mcp-sap-cpi

## REQ-IDs

### Message Monitoring
- MSG-01: List failed messages from MPL with error summary, artifact name, and timestamp
- MSG-02: Get full message processing log details for a specific message ID
- MSG-03: Get trace log payload for a message (when trace mode is enabled on the iFlow)
- MSG-04: Filter messages by status, artifact name, and time range

### Integration Content
- CON-01: List all integration packages in the tenant
- CON-02: List all artifacts (iFlows, mappings, scripts) within a package
- CON-03: Get artifact metadata and configuration details
- CON-04: Deploy an artifact version to the runtime
- CON-05: Undeploy an artifact from the runtime
- CON-06: Download artifact content as base64 zip (for iFlow review)

### Security Content
- SEC-01: List all user credential aliases
- SEC-02: List all keystore entries (aliases, expiry dates)
- SEC-03: List all OAuth2 client credentials configured in the tenant

### Value Mappings
- VM-01: List all value mapping artifacts
- VM-02: Query a specific value mapping for a source agency/value → target value

### Runtime Status
- RT-01: List all deployed runtime artifacts with their status (started/stopped/error)
- RT-02: Get overall system health / alert count

### Non-Functional
- NF-01: OAuth2 token cached and refreshed automatically (no token per request)
- NF-02: All errors return structured error objects with CPI error code and message
- NF-03: Works with Claude Desktop (stdio transport) and Claude Code (MCP settings)
- NF-04: Published to npm — installable via `npm i mcp-sap-cpi` or `npx mcp-sap-cpi`
- NF-05: .env.example documents all required environment variables
