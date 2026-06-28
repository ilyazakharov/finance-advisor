import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@fa/';

function db() {
  return {
    async createPortfolio(name) {
      const portfolios = JSON.parse((await AsyncStorage.getItem(PREFIX + 'portfolios')) || '[]');
      const id = Date.now();
      const p = { id, name, created_at: new Date().toISOString() };
      portfolios.push(p);
      await AsyncStorage.setItem(PREFIX + 'portfolios', JSON.stringify(portfolios));
      return p;
    },
    async getPortfolios() {
      return JSON.parse((await AsyncStorage.getItem(PREFIX + 'portfolios')) || '[]');
    },
    async addAsset(asset) {
      const assets = JSON.parse((await AsyncStorage.getItem(PREFIX + 'assets_' + asset.portfolio_id)) || '[]');
      const id = Date.now() + Math.random();
      const a = { id, ...asset };
      assets.push(a);
      await AsyncStorage.setItem(PREFIX + 'assets_' + asset.portfolio_id, JSON.stringify(assets));
      return a;
    },
    async getAssets(portfolioId) {
      return JSON.parse((await AsyncStorage.getItem(PREFIX + 'assets_' + portfolioId)) || '[]');
    },
    async updateAsset(id, updates) {
      const allKeys = await AsyncStorage.getAllKeys();
      for (const key of allKeys) {
        if (!key.startsWith(PREFIX + 'assets_')) continue;
        const items = JSON.parse((await AsyncStorage.getItem(key)) || '[]');
        const idx = items.findIndex((a) => a.id === id);
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...updates };
          await AsyncStorage.setItem(key, JSON.stringify(items));
          return;
        }
      }
    },
    async deleteAsset(id) {
      const allKeys = await AsyncStorage.getAllKeys();
      for (const key of allKeys) {
        if (!key.startsWith(PREFIX + 'assets_')) continue;
        const items = JSON.parse((await AsyncStorage.getItem(key)) || '[]');
        const filtered = items.filter((a) => a.id !== id);
        if (filtered.length !== items.length) {
          await AsyncStorage.setItem(key, JSON.stringify(filtered));
          return;
        }
      }
    },
    async saveAnalysis(portfolioId, result, modelUsed) {
      const history = JSON.parse((await AsyncStorage.getItem(PREFIX + 'analysis_' + portfolioId)) || '[]');
      const entry = { id: Date.now(), portfolio_id: portfolioId, result, model_used: modelUsed, created_at: new Date().toISOString() };
      history.unshift(entry);
      await AsyncStorage.setItem(PREFIX + 'analysis_' + portfolioId, JSON.stringify(history));
      return { id: entry.id };
    },
    async getAnalysisHistory(portfolioId) {
      return JSON.parse((await AsyncStorage.getItem(PREFIX + 'analysis_' + portfolioId)) || '[]');
    },
  };
}

export function openDatabase() {
  return db();
}
