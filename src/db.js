import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    internal_cost REAL NOT NULL
  );
  INSERT INTO products (name, category, price, internal_cost) VALUES
    ('Widget', 'hardware', 9.99, 2.10),
    ('Gadget', 'hardware', 19.99, 6.40),
    ('eBook',  'digital',  4.99, 0.05);
`);

export function query(sql) {
  return db.prepare(sql).all();
}
