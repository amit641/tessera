"use client";
import * as React from "react";
import { alertAnatomy } from "@tessera/core";

export type AlertType = "info" | "success" | "warning" | "danger";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: AlertType;
  title: string;
  /** Optional supporting text below the title. */
  description?: string;
  /** Custom leading icon; a default per-type glyph is rendered otherwise. */
  icon?: React.ReactNode;
}

const defaultGlyphs: Record<AlertType, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  danger: "✕",
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { type = "info", title, description, icon, children, ...rest },
  ref
) {
  // Interruptive types announce assertively; informational ones politely.
  const role = type === "danger" || type === "warning" ? "alert" : "status";
  return (
    <div {...alertAnatomy.attrs("root")} data-type={type} role={role} ref={ref} {...rest}>
      <span {...alertAnatomy.attrs("icon")} aria-hidden>
        {icon ?? defaultGlyphs[type]}
      </span>
      <div {...alertAnatomy.attrs("title")}>{title}</div>
      {(description || children) && (
        <div {...alertAnatomy.attrs("description")}>{description ?? children}</div>
      )}
    </div>
  );
});
