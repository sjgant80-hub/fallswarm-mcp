#!/usr/bin/env node
// fallswarm-mcp · MCP stdio server wrapping fallswarm-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'fallswarm-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fallswarm_open_d_b',
    description: 'openDB · from fallswarm-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { openDB } = await import('@ai-native-solutions/fallswarm-sdk');
      return typeof openDB === 'function' ? await openDB(args) : { error: 'openDB not callable' };
    }
  },
  {
    name: 'fallswarm_get_or_create_identity',
    description: 'getOrCreateIdentity · from fallswarm-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { getOrCreateIdentity } = await import('@ai-native-solutions/fallswarm-sdk');
      return typeof getOrCreateIdentity === 'function' ? await getOrCreateIdentity(args) : { error: 'getOrCreateIdentity not callable' };
    }
  },
  {
    name: 'fallswarm_sign_message',
    description: 'signMessage · from fallswarm-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { signMessage } = await import('@ai-native-solutions/fallswarm-sdk');
      return typeof signMessage === 'function' ? await signMessage(args) : { error: 'signMessage not callable' };
    }
  },
  {
    name: 'fallswarm_save_record',
    description: 'saveRecord · from fallswarm-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { saveRecord } = await import('@ai-native-solutions/fallswarm-sdk');
      return typeof saveRecord === 'function' ? await saveRecord(args) : { error: 'saveRecord not callable' };
    }
  },
  {
    name: 'fallswarm_list_records',
    description: 'listRecords · from fallswarm-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { listRecords } = await import('@ai-native-solutions/fallswarm-sdk');
      return typeof listRecords === 'function' ? await listRecords(args) : { error: 'listRecords not callable' };
    }
  },
  {
    name: 'fallswarm_delete_record',
    description: 'deleteRecord · from fallswarm-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { deleteRecord } = await import('@ai-native-solutions/fallswarm-sdk');
      return typeof deleteRecord === 'function' ? await deleteRecord(args) : { error: 'deleteRecord not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('fallswarm-mcp v1.0.0 · stdio ready');
