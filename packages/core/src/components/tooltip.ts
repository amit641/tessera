import { createAnatomy } from "../anatomy";
import { createMachine, type Machine } from "../machine";

export const tooltipAnatomy = createAnatomy("tooltip", ["trigger", "positioner", "content", "arrow"]);

export interface TooltipProps {
  /** Delay before showing on hover, in ms. Default 600. */
  openDelay?: number;
  /** Delay before hiding after pointer leaves, in ms. Default 200. */
  closeDelay?: number;
  onOpenChange?: (open: boolean) => void;
}

export type TooltipMachine = Machine<Record<string, never>>;

/**
 * Tooltip machine with hover-intent delays:
 * closed -> opening (after openDelay) -> open -> closing (after closeDelay) -> closed.
 * Re-entering during `closing` snaps back to `open` (no flicker);
 * keyboard focus opens immediately, Escape closes immediately.
 */
export function createTooltipMachine(props: TooltipProps): TooltipMachine {
  const openDelay = props.openDelay ?? 600;
  const closeDelay = props.closeDelay ?? 200;
  const notify = (open: boolean) => () => {
    props.onOpenChange?.(open);
  };

  return createMachine({
    id: "tooltip",
    initial: "closed",
    context: {},
    states: {
      closed: {
        on: {
          POINTER_ENTER: { target: "opening" },
          FOCUS: { target: "open", actions: [notify(true)] },
        },
      },
      opening: {
        after: { [openDelay]: { target: "open", actions: [notify(true)] } },
        on: {
          POINTER_LEAVE: { target: "closed" },
          CLOSE: { target: "closed" },
        },
      },
      open: {
        on: {
          POINTER_LEAVE: { target: "closing" },
          BLUR: { target: "closed", actions: [notify(false)] },
          CLOSE: { target: "closed", actions: [notify(false)] },
        },
      },
      closing: {
        after: { [closeDelay]: { target: "closed", actions: [notify(false)] } },
        on: {
          POINTER_ENTER: { target: "open" },
          FOCUS: { target: "open" },
          CLOSE: { target: "closed", actions: [notify(false)] },
        },
      },
    },
  });
}
