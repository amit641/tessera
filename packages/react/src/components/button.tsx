"use client";
import * as React from "react";
import { buttonAnatomy } from "@tessera/core";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** Shows a spinner and disables interaction while preserving button width. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "solid", size = "md", loading = false, disabled, children, ...rest },
  ref
) {
  return (
    <button
      type="button"
      {...buttonAnatomy.attrs("root")}
      data-variant={variant}
      data-size={size}
      data-loading={loading || undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      ref={ref}
      {...rest}
    >
      {loading && <span {...buttonAnatomy.attrs("spinner")} aria-hidden />}
      <span {...buttonAnatomy.attrs("label")}>{children}</span>
    </button>
  );
});
