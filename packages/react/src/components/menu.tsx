"use client";
import * as React from "react";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type Placement,
} from "@floating-ui/react-dom";
import {
  createDisclosureMachine,
  menuAnatomy,
  onOutsidePointerDown,
  type DisclosureMachine,
} from "@tessera/core";
import { createStrictContext, useExternalState, useLatestRef } from "../utils/hooks";
import { Portal } from "../utils/portal";

interface MenuContextValue {
  machine: DisclosureMachine;
  open: boolean;
  contentId: string;
  placement: Placement;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  close: (refocus?: boolean) => void;
}

const [MenuProvider, useMenuContext] = createStrictContext<MenuContextValue>("Menu");

export interface MenuRootProps {
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  children: React.ReactNode;
}

function MenuRoot({ onOpenChange, placement = "bottom-start", children }: MenuRootProps) {
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const [machine] = React.useState(() =>
    createDisclosureMachine("menu", {
      onOpenChange: (open) => onOpenChangeRef.current?.(open),
    })
  );
  React.useEffect(() => () => machine.stop(), [machine]);

  const state = useExternalState(machine);
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const close = React.useCallback(
    (refocus = false) => {
      machine.send("CLOSE");
      if (refocus) triggerRef.current?.focus();
    },
    [machine]
  );

  return (
    <MenuProvider
      value={{ machine, open: state.value === "open", contentId, placement, triggerRef, close }}
    >
      {children}
    </MenuProvider>
  );
}

function MenuTrigger({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { machine, open, contentId, triggerRef } = useMenuContext();
  return (
    <button
      type="button"
      {...menuAnatomy.attrs("trigger")}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      ref={triggerRef}
      onClick={() => machine.send("TOGGLE")}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" && !open) {
          event.preventDefault();
          machine.send("OPEN");
        }
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function MenuContent({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { open, contentId, placement, triggerRef, close } = useMenuContext();
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const { refs, floatingStyles } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), flip(), shift({ padding: 8 })],
    elements: { reference: triggerRef.current },
  });

  // Focus the first item when the menu opens; roving focus via arrow keys.
  React.useEffect(() => {
    if (!open || !content) return;
    const items = content.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)');
    items[0]?.focus();

    const releaseOutside = onOutsidePointerDown(
      () => [content, triggerRef.current],
      () => close()
    );
    return releaseOutside;
  }, [open, content, close, triggerRef]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (!content) return;
    const items = Array.from(
      content.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)')
    );
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        close();
        break;
    }
  }

  if (!open) return null;

  return (
    <Portal>
      <div {...menuAnatomy.attrs("positioner")} ref={refs.setFloating} style={floatingStyles}>
        <div
          {...menuAnatomy.attrs("content")}
          role="menu"
          id={contentId}
          data-state="open"
          ref={setContent}
          onKeyDown={onKeyDown}
          {...rest}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Called when the item is activated (click or Enter). The menu closes automatically. */
  onSelect?: () => void;
  /** Styles the item as destructive. */
  danger?: boolean;
}

function MenuItem({ onSelect, danger, children, ...rest }: MenuItemProps) {
  const { close } = useMenuContext();
  return (
    <button
      type="button"
      {...menuAnatomy.attrs("item")}
      role="menuitem"
      tabIndex={-1}
      data-danger={danger || undefined}
      onClick={() => {
        onSelect?.();
        close(true);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function MenuSeparator() {
  return <div {...menuAnatomy.attrs("separator")} role="separator" />;
}

function MenuGroupLabel({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...menuAnatomy.attrs("groupLabel")} role="presentation" {...rest}>
      {children}
    </div>
  );
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  GroupLabel: MenuGroupLabel,
};
