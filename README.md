# mcp-sap-cpi

An open-source MCP (Model Context Protocol) server that connects Claude to SAP Cloud Platform Integration (CPI). Ask Claude to diagnose failed messages, review iFlows, deploy artifacts, check credentials, and more — directly from your conversation.

## What it does

| Category | Tools |
|---|---|
| **Message Monitoring** | List failed messages, get full MPL details, retrieve trace logs |
| **Integration Content** | Browse packages, list artifacts, deploy/undeploy iFlows |
| **Security Artifacts** | List credentials, keystores, OAuth2 configurations |
| **Runtime Status** | Check deployed artifact status, system health summary |

## Requirements

- Node.js 18+
- SAP CPI tenant (Integration Suite or standalone CPI)
- BTP service key with Process Integration Runtime role (`it-rt` plan)

## Installation

```bash
npm install -g mcp-sap-cpi
```

Or run without installing:

```bash
npx mcp-sap-cpi
```

## Configuration

### 1. Get your BTP service key

In SAP BTP Cockpit:
1. Go to your subaccount → **Services** → **Instances and Subscriptions**
2. Create a service instance: `Process Integration Runtime` → plan `it-rt`
3. Create a service key → copy the JSON

From the service key JSON, extract:
- `url` → `CPI_TENANT_URL`
- `tokenurl` → `CPI_TOKEN_URL`
- `clientid` → `CPI_CLIENT_ID`
- `clientsecret` → `CPI_CLIENT_SECRET`

### 2. Set environment variables

Create a `.env` file (or set in your Claude Desktop config — see below):

```env
CPI_TENANT_URL=https://<tenant>.it-cpi.cfapps.<region>.hana.ondemand.com
CPI_TOKEN_URL=https://<subdomain>.authentication.<region>.hana.ondemand.com/oauth/token
CPI_CLIENT_ID=sb-<your-client-id>
CPI_CLIENT_SECRET=<your-client-secret>
```

### 3. Register with Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "sap-cpi": {
      "command": "npx",
      "args": ["mcp-sap-cpi"],
      "env": {
        "CPI_TENANT_URL": "https://<tenant>.it-cpi.cfapps.<region>.hana.ondemand.com",
        "CPI_TOKEN_URL": "https://<subdomain>.authentication.<region>.hana.ondemand.com/oauth/token",
        "CPI_CLIENT_ID": "your-client-id",
        "CPI_CLIENT_SECRET": "your-client-secret"
      }
    }
  }
}
```

### 4. Register with Claude Code

```bash
claude mcp add sap-cpi npx mcp-sap-cpi \
  -e CPI_TENANT_URL=https://<tenant>.it-cpi.cfapps.<region>.hana.ondemand.com \
  -e CPI_TOKEN_URL=https://<subdomain>.authentication.<region>.hana.ondemand.com/oauth/token \
  -e CPI_CLIENT_ID=your-client-id \
  -e CPI_CLIENT_SECRET=your-client-secret
```

---

## Tools Reference

### Message Monitoring

#### `get_failed_messages`
List failed messages from the Message Processing Log.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `top` | number | No | Max results (default: 20) |
| `artifactName` | string | No | Filter by iFlow name |
| `fromDate` | string | No | ISO date — messages after this date |

**Example prompt:** *"Show me the last 10 failed messages in CPI"*

---

#### `get_message_details`
Get full MPL details for a specific message.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `messageId` | string | Yes | The CPI message GUID |

**Example prompt:** *"Get details for message ID abc-123-def"*

---

#### `get_trace_log`
Get step-by-step payload trace for a message (requires trace mode enabled on the iFlow).

| Parameter | Type | Required | Description |
|---|---|---|---|
| `messageId` | string | Yes | The CPI message GUID |

**Example prompt:** *"Show me the trace log for message abc-123-def"*

---

### Integration Content

#### `list_packages`
List all integration packages in the tenant.

**Example prompt:** *"What integration packages do I have in CPI?"*

---

#### `list_artifacts`
List all artifacts in a package.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `packageId` | string | Yes | The integration package ID |

**Example prompt:** *"List all iFlows in the HR_Integration package"*

---

#### `get_artifact`
Get metadata and configuration for a specific artifact.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `artifactId` | string | Yes | The artifact ID |
| `artifactType` | string | Yes | `IntegrationFlow`, `MessageMapping`, `ScriptCollection`, or `ValueMapping` |

---

#### `deploy_artifact`
Deploy an artifact version to the runtime.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `artifactId` | string | Yes | The artifact ID |
| `artifactType` | string | No | Default: `IntegrationFlow` |

**Example prompt:** *"Deploy the Employee_Sync iFlow"*

---

#### `undeploy_artifact`
Undeploy an artifact from the runtime.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `artifactId` | string | Yes | The artifact ID |

---

### Security Artifacts

#### `list_credentials`
List all user credential (basic auth) aliases.

**Example prompt:** *"What credentials are configured in CPI?"*

---

#### `list_keystores`
List all keystore entries with alias and expiry date.

**Example prompt:** *"Are any of my CPI certificates expiring soon?"*

---

#### `list_oauth_credentials`
List all OAuth2 client credential configurations.

---

### Runtime Status

#### `get_runtime_artifacts`
List all deployed runtime artifacts with status (`STARTED`, `STOPPED`, `ERROR`).

**Example prompt:** *"Which iFlows are currently in ERROR state?"*

---

#### `get_system_status`
Get a summary of deployed artifact health.

**Example prompt:** *"Give me a CPI system health check"*

---

## Example conversations

**Diagnose a failed message:**
> "Why did my HR_Employee_Sync iFlow fail? Show me the last error."

**Check certificates:**
> "List all keystore entries in CPI and flag any expiring within 90 days."

**Deploy after a fix:**
> "Deploy the Order_Processing iFlow to the runtime."

**Audit credentials:**
> "What OAuth2 credentials are configured in my CPI tenant?"

**System overview:**
> "Give me a health check — how many iFlows are running vs in error?"

---

## Local development

```bash
git clone https://github.com/prudvigit/mcp-sap-cpi.git
cd mcp-sap-cpi
npm install
cp .env.example .env
# fill in your CPI credentials in .env
npm run dev
```

---

## Roadmap

- [ ] Value mapping query tool
- [ ] Alert management tools
- [ ] iFlow content download (for AI-assisted review)
- [ ] Integration with tics-sap-ai-suite

---

## License

MIT
