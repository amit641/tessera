"use client";
import * as React from "react";
import { tagAnatomy } from "@tessera/core";
import { CloseIcon } from "../utils/icons";

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "accent" | "danger";
  /** When provided, renders a remove button that calls this handler. */
  onDismiss?: () => void;
}

export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { tone = "neutral", onDismiss, children, ...rest },
  ref
) {
  return (
    <span {...tagAnatomy.attrs("root")} data-tone={tone} ref={ref} {...rest}>
      <span {...tagAnatomy.attrs("label")}>{children}</span>
      {onDismiss && (
        <button
          type="button"
          {...tagAnatomy.attrs("close")}
          aria-label={`Remove ${typeof children === "string" ? children : "tag"}`}
          onClick={onDismiss}
        >
          <CloseIcon />
        </button>
      )}
    </span>
  );
});
