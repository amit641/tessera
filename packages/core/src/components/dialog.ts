import { createAnatomy } from "../anatomy";
import { createMachine, type Machine } from "../machine";

export const dialogAnatomy = createAnatomy("dialog", [
  "trigger",
  "backdrop",
  "positioner",
  "content",
  "title",
  "description",
  "close",
]);

export const popoverAnatomy = createAnatomy("popover", [
  "trigger",
  "positioner",
  "content",
  "title",
  "arrow",
  "close",
]);

export interface DisclosureProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type DisclosureMachine = Machine<Record<string, never>>;

/**
 * Shared open/close machine used by Dialog and Popover.
 * Focus management, scroll locking, and positioning are concerns of the
 * framework adapter; the machine is the single source of truth for state.
 */
export function createDisclosureMachine(id: string, props: DisclosureProps): DisclosureMachine {
  const notify = (open: boolean) => () => {
    props.onOpenChange?.(open);
  };
  return createMachine({
    id,
    initial: props.defaultOpen ? "open" : "closed",
    context: {},
    states: {
      closed: {
        on: {
          OPEN: { target: "open", actions: [notify(true)] },
          TOGGLE: { target: "open", actions: [notify(true)] },
        },
      },
      open: {
        on: {
          CLOSE: { target: "closed", actions: [notify(false)] },
          TOGGLE: { target: "closed", actions: [notify(false)] },
        },
      },
    },
  });
}
