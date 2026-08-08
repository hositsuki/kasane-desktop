/**
 * Safe Tauri adapter: attempts to use Tauri APIs when available, falls back to browser APIs.
 * In a browser preview build, all calls gracefully degrade. Native subsystems that would
 * require OS-level integration (system audio capture, native ASR, OS-global mouse hooks)
 * are NOT implemented in v0.1.0 — they are exposed as no-ops so the UI can render, and
 * the real implementations are tracked in the roadmap (see README "Feature status").
 */

export interface WindowControl {
  setPosition(x: number, y: number): Promise<void>;
  setSize(width: number, height: number): Promise<void>;
  setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;
  setIgnoreCursorEvents(ignore: boolean): Promise<void>;
  close(): Promise<void>;
  listen<T>(event: string, handler: (payload: T) => void): Promise<() => void>;
}

export interface TauriBridge {
  isTauri: boolean;
  invoke<T>(command: string, args?: Record<string, unknown>): Promise<T>;
  getCurrentWindow(): WindowControl;
  listen<T>(event: string, handler: (payload: T) => void): Promise<() => void>;
  emit(event: string, payload?: unknown): Promise<void>;
}

let cachedBridge: TauriBridge | null = null;
let resolvePromise: Promise<TauriBridge> | null = null;

async function resolveBridge(): Promise<TauriBridge> {
  if (cachedBridge) return cachedBridge;
  if (resolvePromise) return resolvePromise;

  resolvePromise = (async () => {
    if (!isTauriEnvironment()) {
      cachedBridge = createBrowserBridge();
      return cachedBridge;
    }

    try {
      const core = await import('@tauri-apps/api/core');
      const winMod = await import('@tauri-apps/api/window');
      const eventMod = await import('@tauri-apps/api/event');

      cachedBridge = {
        isTauri: true,
        invoke: core.invoke as TauriBridge['invoke'],
        getCurrentWindow: () => {
          const win = winMod.getCurrentWindow();
          return {
            setPosition: async (x, y) => {
              const { LogicalPosition } = winMod;
              await win.setPosition(new LogicalPosition(x, y));
            },
            setSize: async (w, h) => {
              const { LogicalSize } = winMod;
              await win.setSize(new LogicalSize(w, h));
            },
            setAlwaysOnTop: (v) => win.setAlwaysOnTop(v),
            setIgnoreCursorEvents: (v) => win.setIgnoreCursorEvents(v),
            close: () => win.close(),
            listen: async <T>(event: string, handler: (payload: T) => void) => {
              const unlisten = await win.listen(event, (ev) => handler(ev.payload as T));
              return unlisten;
            },
          };
        },
        listen: async <T>(event: string, handler: (payload: T) => void) => {
          const unlisten = await eventMod.listen(event, (ev) => handler(ev.payload as T));
          return unlisten;
        },
        emit: (event, payload) => eventMod.emit(event, payload),
      };
    } catch {
      cachedBridge = createBrowserBridge();
    }

    return cachedBridge!;
  })();

  return resolvePromise;
}

function createBrowserBridge(): TauriBridge {
  const noop = async () => undefined;

  const control: WindowControl = {
    setPosition: noop,
    setSize: noop,
    setAlwaysOnTop: noop,
    setIgnoreCursorEvents: noop,
    close: () => {
      try {
        window.close();
      } catch {
        /* ignored in non-Tauri contexts */
      }
      return Promise.resolve();
    },
    listen: async () => () => {},
  };

  return {
    isTauri: false,
    invoke: async () => {
      throw new Error('Tauri command not available in browser preview');
    },
    getCurrentWindow: () => control,
    listen: async () => () => {},
    emit: noop,
  };
}

export async function getTauriBridge(): Promise<TauriBridge> {
  return resolveBridge();
}

export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}
