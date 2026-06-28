import { createAnatomy } from "../anatomy";
import { createStore } from "../store";

export const toastAnatomy = createAnatomy("toast", [
  "viewport",
  "root",
  "title",
  "description",
  "close",
]);

export type ToastType = "info" | "success" | "warning" | "danger";

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  type?: ToastType;
  /** Auto-dismiss after ms. 0 disables auto-dismiss. */
  duration?: number;
}

export interface ToastItem extends Required<Omit<ToastOptions, "duration">> {
  duration: number;
}

export interface ToastGroupProps {
  /** Default auto-dismiss duration in ms. Default 5000. */
  duration?: number;
  /** Maximum simultaneously visible toasts. Default 5. */
  max?: number;
}

interface ToastGroupState {
  toasts: ToastItem[];
}

let toastCounter = 0;

/**
 * Framework-agnostic toast queue with timer pause/resume
 * (the viewport pauses all timers while hovered).
 */
export function createToastGroup(props: ToastGroupProps = {}) {
  const defaultDuration = props.duration ?? 5000;
  const max = props.max ?? 5;
  const store = createStore<ToastGroupState>({ toasts: [] });
  const timers = new Map<string, { handle: ReturnType<typeof setTimeout>; endsAt: number; remaining: number }>();

  function clearTimer(id: string) {
    const timer = timers.get(id);
    if (timer) {
      clearTimeout(timer.handle);
      timers.delete(id);
    }
  }

  function schedule(id: string, duration: number) {
    if (duration <= 0) return;
    clearTimer(id);
    timers.set(id, {
      handle: setTimeout(() => dismiss(id), duration),
      endsAt: Date.now() + duration,
      remaining: duration,
    });
  }

  function dismiss(id: string) {
    clearTimer(id);
    store.set((prev) => ({ toasts: prev.toasts.filter((toast) => toast.id !== id) }));
  }

  return {
    getState: store.get,
    subscribe: store.subscribe,
    create(options: ToastOptions): string {
      toastCounter += 1;
      const toast: ToastItem = {
        id: options.id ?? `toast-${toastCounter}`,
        title: options.title,
        description: options.description ?? "",
        type: options.type ?? "info",
        duration: options.duration ?? defaultDuration,
      };
      store.set((prev) => {
        const toasts = [...prev.toasts, toast];
        // Evict the oldest toasts beyond the cap.
        const evicted = toasts.slice(0, Math.max(0, toasts.length - max));
        for (const old of evicted) clearTimer(old.id);
        return { toasts: toasts.slice(-max) };
      });
      schedule(toast.id, toast.duration);
      return toast.id;
    },
    dismiss,
    clear() {
      for (const id of Array.from(timers.keys())) clearTimer(id);
      store.set({ toasts: [] });
    },
    /** Pause all auto-dismiss timers (e.g. while the viewport is hovered). */
    pauseAll() {
      for (const timer of timers.values()) {
        clearTimeout(timer.handle);
        timer.remaining = Math.max(0, timer.endsAt - Date.now());
      }
    },
    resumeAll() {
      // Snapshot first: schedule() deletes + re-inserts keys, and a live Map
      // iterator would revisit re-inserted entries forever.
      for (const [id, timer] of Array.from(timers.entries())) {
        if (timer.remaining > 0) schedule(id, timer.remaining);
      }
    },
  };
}

export type ToastGroup = ReturnType<typeof createToastGroup>;
