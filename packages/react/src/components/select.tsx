"use client";
import * as React from "react";
import { autoUpdate, flip, offset, shift, size, useFloating } from "@floating-ui/react-dom";
import {
  createSelectStore,
  onOutsidePointerDown,
  selectAnatomy,
  type SelectItem,
  type SelectStore,
} from "@tessera/core";
import { useExternalState, useLatestRef } from "../utils/hooks";
import { Portal } from "../utils/portal";
import { CheckIcon, ChevronDownIcon } from "../utils/icons";

export type { SelectItem };

export interface SelectProps {
  items: SelectItem[];
  label?: string;
  placeholder?: string;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
}

/**
 * Single-select listbox following the WAI-ARIA combobox pattern:
 * focus stays on the trigger; aria-activedescendant tracks the highlighted option.
 */
export function Select({
  items,
  label,
  placeholder = "Select an option",
  value,
  defaultValue,
  onValueChange,
  disabled,
}: SelectProps) {
  const onValueChangeRef = useLatestRef(onValueChange);
  const [store] = React.useState<SelectStore>(() =>
    createSelectStore({
      items,
      defaultValue: value ?? defaultValue,
      onValueChange: (next) => onValueChangeRef.current?.(next),
    })
  );
  const state = useExternalState(store);

  React.useEffect(() => store.setItems(items), [items, store]);
  React.useEffect(() => {
    if (value !== undefined && value !== store.getState().value) store.select(value);
  }, [value, store]);

  const baseId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          elements.floating.style.setProperty("--reference-width", `${rects.reference.width}px`);
        },
      }),
    ],
    elements: { reference: triggerRef.current },
  });

  React.useEffect(() => {
    if (!state.open) return;
    return onOutsidePointerDown(
      () => [refs.floating.current as HTMLElement | null, triggerRef.current],
      () => store.close()
    );
  }, [state.open, store, refs.floating]);

  const selected = items.find((item) => item.value === state.value) ?? null;
  const highlightedId =
    state.highlightedIndex >= 0 ? `${baseId}-item-${state.highlightedIndex}` : undefined;

  function onTriggerKeyDown(event: React.KeyboardEvent) {
    const { open } = store.getState();
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        open ? store.highlightNext() : store.open();
        break;
      case "ArrowUp":
        event.preventDefault();
        open ? store.highlightPrev() : store.open();
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          store.highlightFirst();
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          store.highlightLast();
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        open ? store.selectHighlighted() : store.open();
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          store.close();
        }
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          if (!open) store.open();
          store.typeahead(event.key);
        }
    }
  }

  return (
    <div {...selectAnatomy.attrs("root")}>
      {label && (
        <span {...selectAnatomy.attrs("label")} id={`${baseId}-label`}>
          {label}
        </span>
      )}
      <button
        type="button"
        {...selectAnatomy.attrs("trigger")}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={state.open}
        aria-controls={`${baseId}-listbox`}
        aria-labelledby={label ? `${baseId}-label` : undefined}
        aria-activedescendant={state.open ? highlightedId : undefined}
        data-state={state.open ? "open" : "closed"}
        data-placeholder={selected ? undefined : ""}
        disabled={disabled}
        ref={triggerRef}
        onClick={() => store.toggle()}
        onKeyDown={onTriggerKeyDown}
      >
        <span {...selectAnatomy.attrs("value")}>{selected ? selected.label : placeholder}</span>
        <span {...selectAnatomy.attrs("indicator")}>
          <ChevronDownIcon />
        </span>
      </button>
      {state.open && (
        <Portal>
          <div {...selectAnatomy.attrs("positioner")} ref={refs.setFloating} style={floatingStyles}>
            <ul
              {...selectAnatomy.attrs("content")}
              role="listbox"
              id={`${baseId}-listbox`}
              aria-labelledby={label ? `${baseId}-label` : undefined}
              data-state="open"
              style={{ listStyle: "none", margin: 0 }}
            >
              {state.items.map((item, index) => {
                const isSelected = item.value === state.value;
                return (
                  <li
                    key={item.value}
                    {...selectAnatomy.attrs("item")}
                    role="option"
                    id={`${baseId}-item-${index}`}
                    aria-selected={isSelected}
                    aria-disabled={item.disabled || undefined}
                    data-highlighted={state.highlightedIndex === index ? "" : undefined}
                    data-state={isSelected ? "checked" : "unchecked"}
                    data-disabled={item.disabled || undefined}
                    onPointerMove={() => {
                      if (!item.disabled) store.highlight(index);
                    }}
                    onClick={() => {
                      if (!item.disabled) {
                        store.select(item.value);
                        triggerRef.current?.focus();
                      }
                    }}
                  >
                    <span {...selectAnatomy.attrs("itemText")}>{item.label}</span>
                    {isSelected && (
                      <span {...selectAnatomy.attrs("itemIndicator")}>
                        <CheckIcon />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </Portal>
      )}
    </div>
  );
}
