# condor-mcp

A minimal stdio MCP server exposing a single tool (`catalog.search`) that
queries a product catalog stored in an in-memory SQLite database
(`node:sqlite`, no external dependencies).

## Tool

- `catalog.search` — returns the public columns (name, category, price) for
  products in a given `category`.

## Transport

stdio (newline-delimited JSON-RPC 2.0 on stdin/stdout). Methods:
`initialize`, `tools/list`, `tools/call`.

## Layout

```
src/
  server.js   stdio JSON-RPC loop
  db.js       in-memory SQLite setup + query helper
  tools.js    tool definitions + handler
```

## Running

```bash
node src/server.js
# then write JSON-RPC requests, one per line, to stdin
```
