#!/usr/bin/env node
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { messageTools, handleMessageTool } from './tools/messages.js';
import { contentTools, handleContentTool } from './tools/content.js';
import { securityTools, handleSecurityTool } from './tools/security.js';
import { runtimeTools, handleRuntimeTool } from './tools/runtime.js';

const allTools = [...messageTools, ...contentTools, ...securityTools, ...runtimeTools];

const server = new Server(
  { name: 'mcp-sap-cpi', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const toolArgs = args as Record<string, unknown>;

  let result: unknown;

  const messageToolNames = messageTools.map(t => t.name);
  const contentToolNames = contentTools.map(t => t.name);
  const securityToolNames = securityTools.map(t => t.name);
  const runtimeToolNames = runtimeTools.map(t => t.name);

  if (messageToolNames.includes(name)) {
    result = await handleMessageTool(name, toolArgs);
  } else if (contentToolNames.includes(name)) {
    result = await handleContentTool(name, toolArgs);
  } else if (securityToolNames.includes(name)) {
    result = await handleSecurityTool(name, toolArgs);
  } else if (runtimeToolNames.includes(name)) {
    result = await handleRuntimeTool(name, toolArgs);
  } else {
    return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }

  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('mcp-sap-cpi server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
