import { describe, it, expect, beforeEach } from 'vitest';
import {
  setStorageAdapter,
  getStorageAdapter,
  storageGet,
  storageSet,
  storageRemove,
  storageGetObject,
  storageSetObject,
} from './storage';

describe('storage repository', () => {
  beforeEach(() => {
    const memory = new Map<string, string>();
    setStorageAdapter({
      getItem: (k) => memory.get(k) ?? null,
      setItem: (k, v) => memory.set(k, v),
      removeItem: (k) => memory.delete(k),
    });
  });

  it('defaults to localStorage adapter', () => {
    setStorageAdapter({
      getItem: (k) => localStorage.getItem(k),
      setItem: (k, v) => localStorage.setItem(k, v),
      removeItem: (k) => localStorage.removeItem(k),
    });
    expect(getStorageAdapter()).toBeDefined();
  });

  it('reads and writes strings', () => {
    storageSet('hello', 'world');
    expect(storageGet('hello')).toBe('world');
    storageRemove('hello');
    expect(storageGet('hello')).toBeNull();
  });

  it('serializes objects', () => {
    storageSetObject('obj', { a: 1, b: [2, 3] });
    expect(storageGetObject<{ a: number; b: number[] }>('obj')).toEqual({ a: 1, b: [2, 3] });
  });

  it('returns null for missing or invalid keys', () => {
    expect(storageGetObject('missing')).toBeNull();
    storageSet('bad', 'not json');
    expect(storageGetObject('bad')).toBeNull();
  });
});
