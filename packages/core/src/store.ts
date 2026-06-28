export type Listener = () => void;

export interface Store<T extends object> {
  get(): T;
  set(update: Partial<T> | ((prev: T) => Partial<T>)): void;
  subscribe(listener: Listener): () => void;
}

/** Minimal reactive store. The single reactivity primitive used across Tessera core. */
export function createStore<T extends object>(initial: T): Store<T> {
  let state = initial;
  const listeners = new Set<Listener>();

  return {
    get: () => state,
    set(update) {
      const partial = typeof update === "function" ? update(state) : update;
      let changed = false;
      for (const key in partial) {
        if (!Object.is(state[key as keyof T], partial[key as keyof T])) {
          changed = true;
          break;
        }
      }
      if (!changed) return;
      state = { ...state, ...partial };
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
