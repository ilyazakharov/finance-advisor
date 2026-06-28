import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { DEFAULT_SETTINGS } from '../utils/constants';

const SETTINGS_KEY = '@financeadvisor/settings';

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export async function loadSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return deepMerge(DEFAULT_SETTINGS, saved);
    }
  } catch (e) {
    console.warn('Failed to load settings:', e);
  }
  return { ...DEFAULT_SETTINGS };
}

export async function saveFullSettings(settings) {
  const apiKeys = settings.llm?.apiKeys || {};
  for (const [provider, key] of Object.entries(apiKeys)) {
    if (key) {
      await SecureStore.setItemAsync(`api_key_${provider}`, key);
    } else {
      await SecureStore.deleteItemAsync(`api_key_${provider}`).catch(() => {});
    }
  }

  const toStore = {
    ...settings,
    llm: {
      ...settings.llm,
      apiKeys: Object.fromEntries(Object.entries(apiKeys).map(([k]) => [k, ''])),
    },
  };

  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(toStore));
}

export async function saveSection(settings, sectionKey) {
  const existingRaw = await AsyncStorage.getItem(SETTINGS_KEY);
  const existing = existingRaw ? JSON.parse(existingRaw) : {};

  if (sectionKey === 'llm') {
    const apiKeys = settings.llm?.apiKeys || {};
    for (const [provider, key] of Object.entries(apiKeys)) {
      if (key) {
        await SecureStore.setItemAsync(`api_key_${provider}`, key);
      } else {
        await SecureStore.deleteItemAsync(`api_key_${provider}`).catch(() => {});
      }
    }
    existing.llm = {
      ...settings.llm,
      apiKeys: Object.fromEntries(Object.entries(apiKeys).map(([k]) => [k, ''])),
    };
  } else {
    existing[sectionKey] = settings[sectionKey];
  }

  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(existing));
}

export async function getApiKey(provider) {
  try {
    return await SecureStore.getItemAsync(`api_key_${provider}`);
  } catch {
    return '';
  }
}

export async function getAllApiKeys() {
  const providers = ['openrouter', 'deepseek', 'yandexgpt', 'gigachat', 'groq', 'gemini'];
  const keys = {};
  for (const provider of providers) {
    keys[provider] = await getApiKey(provider);
  }
  return keys;
}
