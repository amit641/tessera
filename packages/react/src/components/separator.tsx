"use client";
import * as React from "react";
import { separatorAnatomy } from "@tessera/core";

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  /** Purely visual separators should be hidden from assistive tech. Default true (semantic). */
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", decorative = false, ...rest },
  ref
) {
  return (
    <div
      {...separatorAnatomy.attrs("root")}
      data-orientation={orientation}
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      ref={ref}
      {...rest}
    />
  );
});
