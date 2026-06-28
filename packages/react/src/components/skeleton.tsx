"use client";
import * as React from "react";
import { skeletonAnatomy } from "@tessera/core";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "text" | "circle";
  width?: number | string;
  height?: number | string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = "rect", width, height, style, ...rest },
  ref
) {
  return (
    <div
      {...skeletonAnatomy.attrs("root")}
      data-variant={variant}
      aria-hidden
      style={{ width, height, ...style }}
      ref={ref}
      {...rest}
    />
  );
});
