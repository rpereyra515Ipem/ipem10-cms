import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const sqlite = new Database(dbPath);

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'DOCENTE',
    must_change_password INTEGER NOT NULL DEFAULT 1,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content_html TEXT NOT NULL,
    image_url TEXT,
    type TEXT NOT NULL DEFAULT 'NOTICIA',
    status TEXT NOT NULL DEFAULT 'DRAFT',
    is_urgent INTEGER NOT NULL DEFAULT 0,
    user_id TEXT NOT NULL,
    published_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS exams (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    year_level TEXT NOT NULL,
    shift TEXT NOT NULL DEFAULT 'MAÑANA',
    call_name TEXT NOT NULL,
    exam_date TEXT NOT NULL,
    exam_time TEXT NOT NULL,
    teachers TEXT NOT NULL,
    classroom TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    year_level TEXT NOT NULL DEFAULT 'TODOS',
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS memos (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL DEFAULT 'Dirección / Vicedirección',
    priority TEXT NOT NULL DEFAULT 'NORMAL',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

// Agrega la columna si la tabla ya existía sin ella
try {
  sqlite.exec(`ALTER TABLE users ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 1;`);
} catch {
  // Ya existía
}

export const db = drizzle(sqlite, { schema });
