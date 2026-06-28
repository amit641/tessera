"use client";
import * as React from "react";
import { spinnerAnatomy } from "@tessera/core";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  /** Accessible label announced to screen readers. Default "Loading". */
  label?: string;
}

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", label = "Loading", ...rest },
  ref
) {
  return (
    <span
      {...spinnerAnatomy.attrs("root")}
      data-size={size}
      role="status"
      aria-label={label}
      ref={ref}
      {...rest}
    />
  );
});
