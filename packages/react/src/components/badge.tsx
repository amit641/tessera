"use client";
import * as React from "react";
import { badgeAnatomy } from "@tessera/core";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "subtle" | "solid" | "outline";
  tone?: "accent" | "neutral" | "success" | "warning" | "danger";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "subtle", tone = "accent", children, ...rest },
  ref
) {
  return (
    <span
      {...badgeAnatomy.attrs("root")}
      data-variant={variant}
      data-tone={tone}
      ref={ref}
      {...rest}
    >
      {children}
    </span>
  );
});
