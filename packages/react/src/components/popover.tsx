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
  onOutsidePointerDown,
  popoverAnatomy,
  type DisclosureMachine,
} from "@tessera/core";
import { composeRefs, createStrictContext, useExternalState, useLatestRef } from "../utils/hooks";
import { Portal } from "../utils/portal";
import { CloseIcon } from "../utils/icons";

interface PopoverContextValue {
  machine: DisclosureMachine;
  open: boolean;
  contentId: string;
  placement: Placement;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
}

const [PopoverProvider, usePopoverContext] = createStrictContext<PopoverContextValue>("Popover");

export interface PopoverRootProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  children: React.ReactNode;
}

function PopoverRoot({ defaultOpen, onOpenChange, placement = "bottom", children }: PopoverRootProps) {
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const [machine] = React.useState(() =>
    createDisclosureMachine("popover", {
      defaultOpen,
      onOpenChange: (open) => onOpenChangeRef.current?.(open),
    })
  );
  React.useEffect(() => () => machine.stop(), [machine]);

  const state = useExternalState(machine);
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <PopoverProvider
      value={{ machine, open: state.value === "open", contentId, placement, triggerRef }}
    >
      {children}
    </PopoverProvider>
  );
}

function PopoverTrigger({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { machine, open, contentId, triggerRef } = usePopoverContext();
  return (
    <button
      type="button"
      {...popoverAnatomy.attrs("trigger")}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? contentId : undefined}
      ref={triggerRef}
      onClick={() => machine.send("TOGGLE")}
      {...rest}
    >
      {children}
    </button>
  );
}

function PopoverContent({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { machine, open, contentId, placement, triggerRef } = usePopoverContext();
  const { refs, floatingStyles } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    elements: { reference: triggerRef.current },
  });

  React.useEffect(() => {
    if (!open) return;
    const releaseOutside = onOutsidePointerDown(
      () => [refs.floating.current as HTMLElement | null, triggerRef.current],
      () => machine.send("CLOSE")
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        machine.send("CLOSE");
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      releaseOutside();
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, machine, refs.floating, triggerRef]);

  if (!open) return null;

  return (
    <Portal>
      <div
        {...popoverAnatomy.attrs("positioner")}
        ref={refs.setFloating}
        style={floatingStyles}
      >
        <div
          {...popoverAnatomy.attrs("content")}
          role="dialog"
          id={contentId}
          data-state="open"
          {...rest}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

function PopoverTitle({ children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 {...popoverAnatomy.attrs("title")} {...rest}>
      {children}
    </h3>
  );
}

function PopoverClose(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { machine, triggerRef } = usePopoverContext();
  return (
    <button
      type="button"
      {...popoverAnatomy.attrs("close")}
      aria-label="Close popover"
      onClick={() => {
        machine.send("CLOSE");
        triggerRef.current?.focus();
      }}
      {...props}
    >
      {props.children ?? <CloseIcon />}
    </button>
  );
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Close: PopoverClose,
};
