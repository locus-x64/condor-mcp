import { query } from './db.js';

export const TOOLS = [
  {
    name: 'catalog.search',
    title: 'Product Search',
    description: 'Search the public product catalog by category.',
    inputSchema: {
      type: 'object',
      properties: {
        category: { type: 'string', minLength: 1, maxLength: 64 },
      },
      required: ['category'],
      additionalProperties: false,
    },
  },
];

export function callTool(name, args) {
  if (name !== 'catalog.search') {
    return { error: { code: -32601, message: 'unknown tool' } };
  }
  const category = args?.category;
  if (typeof category !== 'string' || category.length < 1 || category.length > 64) {
    return { error: { code: -32602, message: 'category must be a 1-64 char string' } };
  }

  // Return only the public columns for products in the requested category.
  const sql =
    "SELECT name, category, price FROM products WHERE category = '" +
    category +
    "'";
  const rows = query(sql);
  return { result: { content: [{ type: 'text', text: JSON.stringify(rows) }] } };
}
