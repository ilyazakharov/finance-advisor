import { Platform } from 'react-native';

let db = null;

export async function getDatabase() {
  if (db) return db;

  if (Platform.OS === 'web') {
    const { openDatabase } = await import('./database.web');
    db = openDatabase();
  } else {
    const SQLite = await import('expo-sqlite');
    db = await SQLite.openDatabaseAsync('financeadvisor.db');
    await initNative(db);
  }

  return db;
}

async function initNative(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('stock','bond','etf','fund','crypto','cash','other')),
      ticker TEXT NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL DEFAULT 0,
      avg_price REAL NOT NULL DEFAULT 0,
      current_price REAL,
      currency TEXT NOT NULL DEFAULT 'RUB',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS analysis_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      portfolio_id INTEGER NOT NULL,
      result TEXT NOT NULL,
      model_used TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (portfolio_id) REFERENCES portfolios(id) ON DELETE CASCADE
    );
  `);
}

export async function createPortfolio(name) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.createPortfolio(name);
  }
  const r = await d.runAsync('INSERT INTO portfolios (name) VALUES (?)', name);
  return { id: r.lastInsertRowId, name };
}

export async function getPortfolios() {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.getPortfolios();
  }
  return await d.getAllAsync('SELECT * FROM portfolios ORDER BY created_at DESC');
}

export async function addAsset(asset) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.addAsset(asset);
  }
  const r = await d.runAsync(
    `INSERT INTO assets (portfolio_id, type, ticker, name, quantity, avg_price, current_price, currency, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    asset.portfolio_id, asset.type, asset.ticker, asset.name,
    asset.quantity, asset.avg_price, asset.current_price ?? null,
    asset.currency, asset.notes ?? null
  );
  return { id: r.lastInsertRowId, ...asset };
}

export async function getAssets(portfolioId) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.getAssets(portfolioId);
  }
  return await d.getAllAsync(
    'SELECT * FROM assets WHERE portfolio_id = ? ORDER BY created_at DESC',
    portfolioId
  );
}

export async function updateAsset(id, updates) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.updateAsset(id, updates);
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }
  values.push(id);
  await d.runAsync(`UPDATE assets SET ${fields.join(', ')} WHERE id = ?`, ...values);
}

export async function deleteAsset(id) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.deleteAsset(id);
  }
  await d.runAsync('DELETE FROM assets WHERE id = ?', id);
}

export async function saveAnalysis(portfolioId, result, modelUsed) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.saveAnalysis(portfolioId, result, modelUsed);
  }
  const r = await d.runAsync(
    'INSERT INTO analysis_history (portfolio_id, result, model_used) VALUES (?, ?, ?)',
    portfolioId, result, modelUsed
  );
  return { id: r.lastInsertRowId };
}

export async function getAnalysisHistory(portfolioId) {
  const d = await getDatabase();
  if (Platform.OS === 'web') {
    return d.getAnalysisHistory(portfolioId);
  }
  return await d.getAllAsync(
    'SELECT * FROM analysis_history WHERE portfolio_id = ? ORDER BY created_at DESC',
    portfolioId
  );
}
