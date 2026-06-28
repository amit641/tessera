"use client";
import * as React from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
}

/** SSR-safe portal: renders nothing on the server, document.body after mount. */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, container ?? document.body);
}
