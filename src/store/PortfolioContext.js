import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getPortfolios, createPortfolio, getAssets, addAsset, deleteAsset, updateAsset as updateAssetDb } from '../services/database';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [portfolios, setPortfolios] = useState([]);
  const [activePortfolioId, setActivePortfolioId] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshPortfolios = useCallback(async () => {
    const list = await getPortfolios();
    setPortfolios(list);
    if (list.length > 0 && !activePortfolioId) {
      setActivePortfolioId(list[0].id);
    }
    return list;
  }, [activePortfolioId]);

  const refreshAssets = useCallback(async () => {
    if (!activePortfolioId) {
      setAssets([]);
      return;
    }
    const list = await getAssets(activePortfolioId);
    setAssets(list);
    return list;
  }, [activePortfolioId]);

  useEffect(() => {
    (async () => {
      await refreshPortfolios();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (activePortfolioId) {
      refreshAssets();
    }
  }, [activePortfolioId, refreshAssets]);

  const addNewPortfolio = useCallback(async (name) => {
    const portfolio = await createPortfolio(name);
    setActivePortfolioId(portfolio.id);
    await refreshPortfolios();
    return portfolio;
  }, [refreshPortfolios]);

  const addNewAsset = useCallback(async (asset) => {
    const a = await addAsset({ ...asset, portfolio_id: activePortfolioId });
    await refreshAssets();
    return a;
  }, [activePortfolioId, refreshAssets]);

  const removeAsset = useCallback(async (id) => {
    await deleteAsset(id);
    await refreshAssets();
  }, [refreshAssets]);

  const updateAsset = useCallback(async (id, updates) => {
    await updateAssetDb(id, updates);
    await refreshAssets();
  }, [refreshAssets]);

  const totalValue = assets.reduce((sum, a) => {
    const price = a.current_price || a.avg_price;
    return sum + price * a.quantity;
  }, 0);

  return (
    <PortfolioContext.Provider value={{
      portfolios,
      activePortfolioId,
      setActivePortfolioId,
      assets,
      loading,
      totalValue,
      addNewPortfolio,
      addNewAsset,
      removeAsset,
      updateAsset,
      refreshPortfolios,
      refreshAssets,
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
}
