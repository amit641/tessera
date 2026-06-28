/** DOM utilities shared by overlay components. Framework-agnostic. */

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

/**
 * Traps Tab focus within a container. Returns a cleanup function.
 * Focuses the first focusable (or the container itself) on activation,
 * and restores focus to the previously active element on cleanup.
 */
export function trapFocus(container: HTMLElement): () => void {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const first = getFocusables(container)[0];
  (first ?? container).focus({ preventScroll: true });

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== "Tab") return;
    const focusables = getFocusables(container);
    if (focusables.length === 0) {
      event.preventDefault();
      container.focus();
      return;
    }
    const firstEl = focusables[0];
    const lastEl = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === firstEl || active === container)) {
      event.preventDefault();
      lastEl.focus();
    } else if (!event.shiftKey && active === lastEl) {
      event.preventDefault();
      firstEl.focus();
    }
  }

  container.addEventListener("keydown", onKeyDown);
  return () => {
    container.removeEventListener("keydown", onKeyDown);
    previouslyFocused?.focus({ preventScroll: true });
  };
}

let scrollLockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

/** Reference-counted body scroll lock (multiple stacked overlays stay correct). */
export function lockScroll(): () => void {
  if (typeof document === "undefined") return () => {};
  if (scrollLockCount === 0) {
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
  }
  scrollLockCount++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    scrollLockCount--;
    if (scrollLockCount === 0) {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    }
  };
}

/**
 * Calls the handler for pointerdown events outside ALL of the given elements.
 * Returns a cleanup function.
 */
export function onOutsidePointerDown(
  getElements: () => Array<HTMLElement | null>,
  handler: (event: PointerEvent) => void
): () => void {
  function listener(event: PointerEvent) {
    const target = event.target as Node;
    const inside = getElements().some((el) => el !== null && el.contains(target));
    if (!inside) handler(event);
  }
  document.addEventListener("pointerdown", listener, true);
  return () => document.removeEventListener("pointerdown", listener, true);
}
