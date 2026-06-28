"use client";
import * as React from "react";
import { progressAnatomy } from "@tessera/core";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  /** 0..max. Omit for an indeterminate progress bar. */
  value?: number;
  max?: number;
  /** Show the percentage next to the label. Default true when a label is set. */
  showValueText?: boolean;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { label, value, max = 100, showValueText = true, style, ...rest },
  ref
) {
  const indeterminate = value === undefined;
  const percent = indeterminate ? 0 : Math.min(Math.max(value / max, 0), 1) * 100;
  const labelId = React.useId();

  return (
    <div
      {...progressAnatomy.attrs("root")}
      data-indeterminate={indeterminate || undefined}
      ref={ref}
      {...rest}
    >
      {label && (
        <div {...progressAnatomy.attrs("label")}>
          <span id={labelId}>{label}</span>
          {showValueText && !indeterminate && (
            <span {...progressAnatomy.attrs("valueText")}>{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div
        {...progressAnatomy.attrs("track")}
        role="progressbar"
        aria-labelledby={label ? labelId : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        style={{ "--progress-value": `${percent}%` } as React.CSSProperties}
      >
        <div {...progressAnatomy.attrs("fill")} />
      </div>
    </div>
  );
});
