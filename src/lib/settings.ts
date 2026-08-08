import { useState, useEffect, useCallback } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from './types';
import { storageGetObject, storageSetObject } from './storage';

const SETTINGS_KEY = 'kasane:settings:v1';

export function loadSettings(): AppSettings {
  const saved = storageGetObject<Partial<AppSettings>>(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...saved };
}

export function saveSettings(settings: AppSettings): void {
  storageSetObject(SETTINGS_KEY, settings);
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(() => loadSettings());

  const setSettings = useCallback((patch: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    setSettingsState((prev) => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  // Keep other tabs in sync (browser only; Tauri windows can use events in v0.2)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        setSettingsState(loadSettings());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  return { settings, setSettings };
}
