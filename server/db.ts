import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema";

// Use different database path for production
const dbPath = process.env.NODE_ENV === 'production' 
  ? './sqlite.db' 
  : './sqlite.db';

const sqlite = new Database(dbPath);

// Create tables if they don't exist (for first deployment)
try {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      header_content TEXT DEFAULT '',
      footer_content TEXT DEFAULT '',
      show_page_numbers INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} catch (e) {
  console.log("Table may already exist:", e);
}

export const db = drizzle(sqlite, { schema });
