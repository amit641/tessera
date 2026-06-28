"use client";
import * as React from "react";
import { createToastGroup, toastAnatomy, type ToastGroup, type ToastOptions } from "@tessera/core";
import { createStrictContext, useExternalState } from "../utils/hooks";
import { Portal } from "../utils/portal";
import { CloseIcon } from "../utils/icons";

const [ToastGroupProvider, useToastGroupContext] = createStrictContext<ToastGroup>("Toast");

export interface ToastProviderProps {
  /** Default auto-dismiss duration in ms. Default 5000. */
  duration?: number;
  /** Maximum simultaneously visible toasts. Default 5. */
  max?: number;
  children: React.ReactNode;
}

export function ToastProvider({ duration, max, children }: ToastProviderProps) {
  const [group] = React.useState(() => createToastGroup({ duration, max }));
  return (
    <ToastGroupProvider value={group}>
      {children}
      <Toaster group={group} />
    </ToastGroupProvider>
  );
}

/** Imperative toast API: `const toast = useToast(); toast({ title: "Saved" })`. */
export function useToast() {
  const group = useToastGroupContext();
  return React.useMemo(() => {
    const toast = (options: ToastOptions) => group.create(options);
    toast.dismiss = (id: string) => group.dismiss(id);
    toast.clear = () => group.clear();
    return toast;
  }, [group]);
}

function Toaster({ group }: { group: ToastGroup }) {
  const { toasts } = useExternalState(group);
  if (toasts.length === 0) return null;

  return (
    <Portal>
      <ol
        {...toastAnatomy.attrs("viewport")}
        aria-label="Notifications"
        onMouseEnter={() => group.pauseAll()}
        onMouseLeave={() => group.resumeAll()}
      >
        {toasts.map((toast) => (
          <li
            key={toast.id}
            {...toastAnatomy.attrs("root")}
            role="status"
            aria-live="polite"
            data-type={toast.type}
          >
            <div {...toastAnatomy.attrs("title")}>{toast.title}</div>
            {toast.description && (
              <div {...toastAnatomy.attrs("description")}>{toast.description}</div>
            )}
            <button
              type="button"
              {...toastAnatomy.attrs("close")}
              aria-label="Dismiss notification"
              onClick={() => group.dismiss(toast.id)}
            >
              <CloseIcon />
            </button>
          </li>
        ))}
      </ol>
    </Portal>
  );
}
