/** Keyboard-navigation helpers (roving focus, typeahead). Framework-agnostic. */

export type NavigationKey =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Home"
  | "End";

export interface RovingOptions {
  orientation: "horizontal" | "vertical";
  /** Wrap from last to first and vice versa. Defaults to true. */
  loop?: boolean;
  /** Right-to-left flips horizontal arrow behavior. */
  rtl?: boolean;
}

/**
 * Computes the next index for arrow-key navigation across `count` items.
 * Returns the same index for keys that don't apply to the orientation.
 */
export function nextRovingIndex(
  key: NavigationKey,
  current: number,
  count: number,
  options: RovingOptions
): number {
  const { orientation, loop = true, rtl = false } = options;
  if (count <= 0) return -1;

  let forward: boolean | null = null;
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (orientation === "horizontal") {
    if (key === "ArrowRight") forward = !rtl;
    if (key === "ArrowLeft") forward = rtl;
  } else {
    if (key === "ArrowDown") forward = true;
    if (key === "ArrowUp") forward = false;
  }
  if (forward === null) return current;

  const next = current + (forward ? 1 : -1);
  if (next < 0) return loop ? count - 1 : 0;
  if (next >= count) return loop ? 0 : count - 1;
  return next;
}

export interface TypeaheadState {
  query: string;
  timer: ReturnType<typeof setTimeout> | null;
}

export function createTypeahead(timeoutMs = 600) {
  const state: TypeaheadState = { query: "", timer: null };

  /**
   * Feeds a printable character; returns the matched index among labels
   * (searching from the item after `activeIndex`), or -1 for no match.
   */
  return function feed(char: string, labels: string[], activeIndex: number): number {
    if (state.timer) clearTimeout(state.timer);
    state.query += char.toLowerCase();
    state.timer = setTimeout(() => {
      state.query = "";
    }, timeoutMs);

    const count = labels.length;
    for (let offset = 1; offset <= count; offset++) {
      const index = (activeIndex + offset) % count;
      if (labels[index].toLowerCase().startsWith(state.query)) return index;
    }
    return -1;
  };
}
