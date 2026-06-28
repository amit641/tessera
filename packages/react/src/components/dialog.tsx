"use client";
import * as React from "react";
import {
  createDisclosureMachine,
  dialogAnatomy,
  lockScroll,
  trapFocus,
  type DisclosureMachine,
} from "@tessera/core";
import { createStrictContext, useExternalState, useLatestRef } from "../utils/hooks";
import { Portal } from "../utils/portal";
import { CloseIcon } from "../utils/icons";

interface DialogContextValue {
  machine: DisclosureMachine;
  open: boolean;
  ids: { content: string; title: string; description: string };
}

const [DialogProvider, useDialogContext] = createStrictContext<DialogContextValue>("Dialog");

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function DialogRoot({ open: openProp, defaultOpen, onOpenChange, children }: DialogRootProps) {
  const onOpenChangeRef = useLatestRef(onOpenChange);
  const [machine] = React.useState(() =>
    createDisclosureMachine("dialog", {
      defaultOpen: defaultOpen ?? openProp,
      onOpenChange: (open) => onOpenChangeRef.current?.(open),
    })
  );
  React.useEffect(() => () => machine.stop(), [machine]);

  const state = useExternalState(machine);
  const open = openProp ?? state.value === "open";

  // Controlled mode: reconcile external prop with the machine.
  React.useEffect(() => {
    if (openProp === undefined) return;
    if (openProp && state.value !== "open") machine.send("OPEN");
    if (!openProp && state.value !== "closed") machine.send("CLOSE");
  }, [openProp, state.value, machine]);

  const autoId = React.useId();
  const ids = React.useMemo(
    () => ({
      content: `${autoId}-content`,
      title: `${autoId}-title`,
      description: `${autoId}-description`,
    }),
    [autoId]
  );

  return <DialogProvider value={{ machine, open, ids }}>{children}</DialogProvider>;
}

function DialogTrigger({
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { machine, open, ids } = useDialogContext();
  return (
    <button
      type="button"
      {...dialogAnatomy.attrs("trigger")}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={ids.content}
      onClick={() => machine.send("TOGGLE")}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Close when clicking the backdrop. Default true. */
  closeOnOutsideClick?: boolean;
}

function DialogContent({ children, closeOnOutsideClick = true, ...rest }: DialogContentProps) {
  const { machine, open, ids } = useDialogContext();
  // Tracked in state (not a ref) so this effect re-runs once the portal mounts
  // the node - a ref wouldn't trigger the effect and the listeners would never attach.
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open || !content) return;

    const releaseFocus = trapFocus(content);
    const releaseScroll = lockScroll();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") machine.send("CLOSE");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      releaseFocus();
      releaseScroll();
    };
  }, [open, machine, content]);

  if (!open) return null;

  return (
    <Portal>
      <div {...dialogAnatomy.attrs("backdrop")} data-state="open" aria-hidden />
      <div
        {...dialogAnatomy.attrs("positioner")}
        data-state="open"
        onPointerDown={(event) => {
          if (closeOnOutsideClick && event.target === event.currentTarget) {
            machine.send("CLOSE");
          }
        }}
      >
        <div
          {...dialogAnatomy.attrs("content")}
          role="dialog"
          aria-modal="true"
          id={ids.content}
          aria-labelledby={ids.title}
          aria-describedby={ids.description}
          data-state="open"
          tabIndex={-1}
          ref={setContent}
          style={{ position: "relative" }}
          {...rest}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

function DialogTitle({ children, ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { ids } = useDialogContext();
  return (
    <h2 {...dialogAnatomy.attrs("title")} id={ids.title} {...rest}>
      {children}
    </h2>
  );
}

function DialogDescription({ children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { ids } = useDialogContext();
  return (
    <p {...dialogAnatomy.attrs("description")} id={ids.description} {...rest}>
      {children}
    </p>
  );
}

function DialogClose(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { machine } = useDialogContext();
  return (
    <button
      type="button"
      {...dialogAnatomy.attrs("close")}
      aria-label="Close dialog"
      onClick={() => machine.send("CLOSE")}
      {...props}
    >
      {props.children ?? <CloseIcon />}
    </button>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

/** Imperative access to the dialog (e.g. closing from a form submit handler). */
export function useDialog() {
  const { machine, open } = useDialogContext();
  return {
    open,
    setOpen: (next: boolean) => machine.send(next ? "OPEN" : "CLOSE"),
  };
}
