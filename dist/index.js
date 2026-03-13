#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const messages_js_1 = require("./tools/messages.js");
const content_js_1 = require("./tools/content.js");
const security_js_1 = require("./tools/security.js");
const runtime_js_1 = require("./tools/runtime.js");
const allTools = [...messages_js_1.messageTools, ...content_js_1.contentTools, ...security_js_1.securityTools, ...runtime_js_1.runtimeTools];
const server = new index_js_1.Server({ name: 'mcp-sap-cpi', version: '0.1.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => ({
    tools: allTools,
}));
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args = {} } = request.params;
    const toolArgs = args;
    let result;
    const messageToolNames = messages_js_1.messageTools.map(t => t.name);
    const contentToolNames = content_js_1.contentTools.map(t => t.name);
    const securityToolNames = security_js_1.securityTools.map(t => t.name);
    const runtimeToolNames = runtime_js_1.runtimeTools.map(t => t.name);
    if (messageToolNames.includes(name)) {
        result = await (0, messages_js_1.handleMessageTool)(name, toolArgs);
    }
    else if (contentToolNames.includes(name)) {
        result = await (0, content_js_1.handleContentTool)(name, toolArgs);
    }
    else if (securityToolNames.includes(name)) {
        result = await (0, security_js_1.handleSecurityTool)(name, toolArgs);
    }
    else if (runtimeToolNames.includes(name)) {
        result = await (0, runtime_js_1.handleRuntimeTool)(name, toolArgs);
    }
    else {
        return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
    }
    return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('mcp-sap-cpi server running on stdio');
}
main().catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
});
