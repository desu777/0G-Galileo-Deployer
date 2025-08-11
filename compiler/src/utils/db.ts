import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { logger } from './logger';

const DB_DIR = process.env.DB_DIR || path.join(process.cwd(), 'data');
const DB_PATH = process.env.DB_PATH || path.join(DB_DIR, 'jaine_deployer.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db: Database.Database = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// Schema init
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_address TEXT NOT NULL UNIQUE,
  nonce TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login_at DATETIME
);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);

CREATE TABLE IF NOT EXISTS deployments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  wallet_address TEXT NOT NULL,
  mode TEXT NOT NULL CHECK(mode IN ('normal','jaine')),
  contract_id TEXT NOT NULL,
  contract_name TEXT,
  rarity TEXT,
  chain_id INTEGER DEFAULT 16601,
  tx_hash TEXT,
  contract_address TEXT,
  success INTEGER NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tx_hash) ON CONFLICT IGNORE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_dep_user    ON deployments(user_id);
CREATE INDEX IF NOT EXISTS idx_dep_mode    ON deployments(mode);
CREATE INDEX IF NOT EXISTS idx_dep_success ON deployments(success);
CREATE INDEX IF NOT EXISTS idx_dep_created ON deployments(created_at);

CREATE TABLE IF NOT EXISTS user_metrics (
  user_id INTEGER PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  spins_total INTEGER NOT NULL DEFAULT 0,
  streak_current INTEGER NOT NULL DEFAULT 0,
  streak_best INTEGER NOT NULL DEFAULT 0,
  combo_multiplier REAL NOT NULL DEFAULT 1.0,
  last_spin_at DATETIME,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_metrics_wallet ON user_metrics(wallet_address);
`);

logger.success('SQLite initialized at ' + DB_PATH);

export function getOrCreateUser(address: string): any {
  const wallet = address.toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE wallet_address = ?').get(wallet) as any;
  if (row) {
    // ensure metrics row exists
    db.prepare('INSERT OR IGNORE INTO user_metrics (user_id, wallet_address) VALUES (?, ?)').run(row.id, wallet);
    return row;
  }
  const info = db.prepare('INSERT INTO users (wallet_address) VALUES (?)').run(wallet);
  const created = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid as number) as any;
  db.prepare('INSERT OR IGNORE INTO user_metrics (user_id, wallet_address) VALUES (?, ?)').run(created.id, wallet);
  return created;
}

export function updateSpinMetrics(address: string, rarity: string) {
  const wallet = address.toLowerCase();
  const user = getOrCreateUser(wallet);
  const isWin = rarity && rarity !== 'common';
  const current = db.prepare('SELECT * FROM user_metrics WHERE user_id = ?').get(user.id) as any;
  const newSpins = (current?.spins_total || 0) + 1;
  const newStreak = isWin ? (current?.streak_current || 0) + 1 : 0;
  const newBest = Math.max(newStreak, current?.streak_best || 0);
  const newCombo = isWin ? Math.min((current?.combo_multiplier || 1) + 0.1, 2) : 1;
  db.prepare(`
    UPDATE user_metrics
    SET spins_total = ?, streak_current = ?, streak_best = ?, combo_multiplier = ?, last_spin_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `).run(newSpins, newStreak, newBest, newCombo, user.id);
  return db.prepare('SELECT * FROM user_metrics WHERE user_id = ?').get(user.id);
}



