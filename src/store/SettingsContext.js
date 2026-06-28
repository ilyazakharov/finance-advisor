import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadSettings, saveSection as persistSection, saveFullSettings } from '../services/settings';
import { DEFAULT_SETTINGS } from '../utils/constants';

const SettingsContext = createContext(null);
const SECTIONS = ['llm', 'search', 'investor', 'general'];

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [savedSnapshot, setSavedSnapshot] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setSettings(s);
      setSavedSnapshot(JSON.parse(JSON.stringify(s)));
      setLoaded(true);
    })();
  }, []);

  const dirtySections = useMemo(() => {
    const dirty = {};
    for (const key of SECTIONS) {
      dirty[key] = JSON.stringify(settings[key]) !== JSON.stringify(savedSnapshot[key]);
    }
    return dirty;
  }, [settings, savedSnapshot]);

  const hasAnyChanges = useMemo(() =>
    Object.values(dirtySections).some(Boolean), [dirtySections]);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev };
      for (const key of SECTIONS) {
        if (patch[key]) {
          next[key] = { ...prev[key], ...patch[key] };
          if (patch[key].apiKeys) {
            next[key].apiKeys = { ...prev[key].apiKeys, ...patch[key].apiKeys };
          }
        }
      }
      return next;
    });
  }, []);

  const saveSection = useCallback(async (sectionKey) => {
    const current = settings[sectionKey];
    await persistSection(settings, sectionKey);
    setSavedSnapshot((prev) => {
      const next = { ...prev };
      next[sectionKey] = JSON.parse(JSON.stringify(current));
      return next;
    });
  }, [settings]);

  const discardSection = useCallback((sectionKey) => {
    setSettings((prev) => {
      const next = { ...prev };
      next[sectionKey] = JSON.parse(JSON.stringify(savedSnapshot[sectionKey]));
      return next;
    });
  }, [savedSnapshot]);

  const discardAllChanges = useCallback(() => {
    setSettings(JSON.parse(JSON.stringify(savedSnapshot)));
  }, [savedSnapshot]);

  const resetSettings = useCallback(async () => {
    setSettings(DEFAULT_SETTINGS);
    setSavedSnapshot(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
    await saveFullSettings(DEFAULT_SETTINGS);
  }, []);

  return (
    <SettingsContext.Provider value={{
      settings, loaded,
      updateSettings,
      saveSection, discardSection, discardAllChanges,
      dirtySections, hasAnyChanges,
      resetSettings,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
