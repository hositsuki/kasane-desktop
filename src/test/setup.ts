import { vi } from 'vitest';

// Provide minimal localStorage/sessionStorage for jsdom
const createMockStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
};

Object.defineProperty(globalThis, 'localStorage', { value: createMockStorage() });
Object.defineProperty(globalThis, 'sessionStorage', { value: createMockStorage() });

// Silence Tauri APIs in unit tests
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

vi.mock('@tauri-apps/api/window', () => ({
  getCurrentWindow: vi.fn(() => ({
    setPosition: vi.fn(),
    setSize: vi.fn(),
    setAlwaysOnTop: vi.fn(),
    setIgnoreCursorEvents: vi.fn(),
    listen: vi.fn(() => Promise.resolve(() => {})),
    onCloseRequested: vi.fn(() => Promise.resolve(() => {})),
  })),
}));

vi.mock('@tauri-apps/api/event', () => ({
  listen: vi.fn(() => Promise.resolve(() => {})),
  emit: vi.fn(),
}));

// Date.now fixture helpers are provided per-test.
