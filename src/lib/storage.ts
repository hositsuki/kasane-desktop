/**
 * Repository/service abstraction around localStorage.
 * Keeps persistence details out of UI code and makes unit tests trivial to mock.
 */
export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const defaultAdapter: StorageAdapter = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key),
};

let adapter: StorageAdapter = defaultAdapter;

export function setStorageAdapter(next: StorageAdapter): void {
  adapter = next;
}

export function getStorageAdapter(): StorageAdapter {
  return adapter;
}

export function storageGet(key: string): string | null {
  return adapter.getItem(key);
}

export function storageSet(key: string, value: string): void {
  adapter.setItem(key, value);
}

export function storageRemove(key: string): void {
  adapter.removeItem(key);
}

export function storageGetObject<T>(key: string): T | null {
  const raw = adapter.getItem(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function storageSetObject<T>(key: string, value: T): void {
  adapter.setItem(key, JSON.stringify(value));
}
