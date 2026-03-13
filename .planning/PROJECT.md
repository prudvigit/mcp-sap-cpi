# mcp-sap-cpi

## Vision
An open-source MCP (Model Context Protocol) server that connects Claude to SAP Cloud Platform Integration (CPI). Exposes CPI's OData APIs as Claude tools — enabling AI-assisted monitoring, debugging, deployment, and management of SAP integration artifacts.

## Target Users
SAP CPI developers and consultants who use Claude Desktop or Claude Code.

## Core Value
- Diagnose failed messages with AI context
- Review iFlow content without logging into the tenant
- Deploy/undeploy artifacts via conversation
- Query security artifacts and value mappings
- No UI needed — works directly in Claude

## Distribution
- Published as `mcp-sap-cpi` on npm (open source, MIT)
- Consumed by tics-sap-ai-suite as a dependency (Phase 2)

## Stack
- Node.js + TypeScript
- @modelcontextprotocol/sdk (official MCP SDK)
- axios (HTTP client for CPI OData APIs)
- dotenv (config management)

## Auth Model
OAuth2 client credentials via SAP BTP service key.
Config: CPI_TENANT_URL, CPI_CLIENT_ID, CPI_CLIENT_SECRET, CPI_TOKEN_URL

## Deployment
Local MCP server — runs via `npx mcp-sap-cpi` or installed globally.
Registered in Claude Desktop config or Claude Code MCP settings.
