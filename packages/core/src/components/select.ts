import { createAnatomy } from "../anatomy";
import { createStore } from "../store";
import { createTypeahead } from "../keyboard";

export const selectAnatomy = createAnatomy("select", [
  "root",
  "label",
  "trigger",
  "value",
  "indicator",
  "positioner",
  "content",
  "item",
  "itemText",
  "itemIndicator",
]);

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  items: SelectItem[];
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
}

export interface SelectState {
  open: boolean;
  value: string | null;
  highlightedIndex: number;
  items: SelectItem[];
}

/**
 * Framework-agnostic single-select listbox logic:
 * open/close, highlight tracking, disabled-item skipping, and typeahead.
 */
export function createSelectStore(props: SelectProps) {
  const store = createStore<SelectState>({
    open: false,
    value: props.defaultValue ?? null,
    highlightedIndex: -1,
    items: props.items,
  });
  const typeahead = createTypeahead();

  const enabledIndices = () =>
    store
      .get()
      .items.map((item, index) => (item.disabled ? -1 : index))
      .filter((index) => index !== -1);

  function moveHighlight(direction: 1 | -1) {
    const enabled = enabledIndices();
    if (enabled.length === 0) return;
    const { highlightedIndex } = store.get();
    const position = enabled.indexOf(highlightedIndex);
    const next =
      position === -1
        ? direction === 1
          ? enabled[0]
          : enabled[enabled.length - 1]
        : enabled[(position + direction + enabled.length) % enabled.length];
    store.set({ highlightedIndex: next });
  }

  return {
    getState: store.get,
    subscribe: store.subscribe,
    setItems(items: SelectItem[]) {
      store.set({ items });
    },
    open() {
      const { items, value } = store.get();
      const selected = items.findIndex((item) => item.value === value);
      const fallback = enabledIndices()[0] ?? -1;
      store.set({ open: true, highlightedIndex: selected !== -1 ? selected : fallback });
    },
    close() {
      store.set({ open: false, highlightedIndex: -1 });
    },
    toggle() {
      store.get().open ? this.close() : this.open();
    },
    highlight(index: number) {
      store.set({ highlightedIndex: index });
    },
    highlightNext: () => moveHighlight(1),
    highlightPrev: () => moveHighlight(-1),
    highlightFirst() {
      store.set({ highlightedIndex: enabledIndices()[0] ?? -1 });
    },
    highlightLast() {
      const enabled = enabledIndices();
      store.set({ highlightedIndex: enabled[enabled.length - 1] ?? -1 });
    },
    select(value: string | null) {
      if (store.get().value !== value) {
        store.set({ value });
        props.onValueChange?.(value);
      }
      this.close();
    },
    selectHighlighted() {
      const { highlightedIndex, items } = store.get();
      const item = items[highlightedIndex];
      if (item && !item.disabled) this.select(item.value);
    },
    typeahead(char: string) {
      const { items, highlightedIndex } = store.get();
      const match = typeahead(
        char,
        items.map((item) => item.label),
        highlightedIndex
      );
      if (match !== -1 && !items[match].disabled) store.set({ highlightedIndex: match });
    },
  };
}

export type SelectStore = ReturnType<typeof createSelectStore>;
