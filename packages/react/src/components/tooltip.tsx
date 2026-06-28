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
import { createTooltipMachine, tooltipAnatomy, type TooltipMachine } from "@tessera/core";
import { createStrictContext, useExternalState } from "../utils/hooks";
import { Portal } from "../utils/portal";

interface TooltipContextValue {
  machine: TooltipMachine;
  open: boolean;
  contentId: string;
  placement: Placement;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
}

const [TooltipProvider, useTooltipContext] = createStrictContext<TooltipContextValue>("Tooltip");

export interface TooltipRootProps {
  openDelay?: number;
  closeDelay?: number;
  placement?: Placement;
  children: React.ReactNode;
}

function TooltipRoot({ openDelay, closeDelay, placement = "top", children }: TooltipRootProps) {
  const [machine] = React.useState(() => createTooltipMachine({ openDelay, closeDelay }));
  React.useEffect(() => () => machine.stop(), [machine]);

  const state = useExternalState(machine);
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const open = state.value === "open" || state.value === "closing";

  return (
    <TooltipProvider value={{ machine, open, contentId, placement, triggerRef }}>
      {children}
    </TooltipProvider>
  );
}

function TooltipTrigger({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { machine, open, contentId, triggerRef } = useTooltipContext();
  return (
    <button
      type="button"
      {...tooltipAnatomy.attrs("trigger")}
      aria-describedby={open ? contentId : undefined}
      ref={(node) => {
        triggerRef.current = node;
      }}
      onPointerEnter={() => machine.send("POINTER_ENTER")}
      onPointerLeave={() => machine.send("POINTER_LEAVE")}
      onFocus={() => machine.send("FOCUS")}
      onBlur={() => machine.send("BLUR")}
      onKeyDown={(event) => {
        if (event.key === "Escape") machine.send("CLOSE");
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

function TooltipContent({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { machine, open, contentId, placement, triggerRef } = useTooltipContext();
  const { refs, floatingStyles } = useFloating({
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    elements: { reference: triggerRef.current },
  });

  if (!open) return null;

  return (
    <Portal>
      <div
        {...tooltipAnatomy.attrs("positioner")}
        ref={refs.setFloating}
        style={floatingStyles}
        onPointerEnter={() => machine.send("POINTER_ENTER")}
        onPointerLeave={() => machine.send("POINTER_LEAVE")}
      >
        <div {...tooltipAnatomy.attrs("content")} role="tooltip" id={contentId} data-state="open" {...rest}>
          {children}
        </div>
      </div>
    </Portal>
  );
}

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
