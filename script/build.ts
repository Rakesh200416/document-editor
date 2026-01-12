import fs from 'fs';
import Database from 'better-sqlite3';

// Create database file during build if it doesn't exist
if (!fs.existsSync('./sqlite.db')) {
  const sqlite = new Database('./sqlite.db');
  sqlite.exec(`
    CREATE TABLE documents (
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
  sqlite.close();
}

console.log('Database initialized');
