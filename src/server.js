import { createInterface } from 'node:readline';
import { TOOLS, callTool } from './tools.js';

const SERVER_INFO = { name: 'condor-mcp', version: '0.1.0' };
const PROTOCOL_VERSION = '2025-06-18';

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + '\n');
}

function handle(req) {
  const { id, method, params } = req;
  switch (method) {
    case 'initialize':
      return {
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: SERVER_INFO,
        },
      };
    case 'tools/list':
      return { jsonrpc: '2.0', id, result: { tools: TOOLS } };
    case 'tools/call': {
      const out = callTool(params?.name, params?.arguments);
      if (out.error) return { jsonrpc: '2.0', id, error: out.error };
      return { jsonrpc: '2.0', id, result: out.result };
    }
    default:
      return { jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found' } };
  }
}

const rl = createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let req;
  try {
    req = JSON.parse(trimmed);
  } catch {
    return; // ignore non-JSON lines
  }
  if (req.id === undefined) return; // notification; no response
  send(handle(req));
});
