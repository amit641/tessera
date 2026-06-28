"use client";
import * as React from "react";
import { sliderAnatomy } from "@tessera/core";
import { useControllableState } from "../utils/hooks";

export interface SliderProps {
  label: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Show the current value beside the label. Default true. */
  showValueText?: boolean;
  /** Format the displayed value, e.g. (v) => `${v}%`. */
  formatValue?: (value: number) => string;
}

/** Built on a native range input: keyboard, touch, and a11y come from the browser. */
export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(function Slider(
  {
    label,
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled,
    showValueText = true,
    formatValue = String,
  },
  ref
) {
  const [current, setValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? min,
    onChange: onValueChange,
  });
  const id = React.useId();
  const percent = ((current - min) / (max - min)) * 100;

  return (
    <div {...sliderAnatomy.attrs("root")}>
      <label {...sliderAnatomy.attrs("label")} htmlFor={id}>
        <span>{label}</span>
        {showValueText && (
          <span {...sliderAnatomy.attrs("valueText")}>{formatValue(current)}</span>
        )}
      </label>
      <input
        type="range"
        {...sliderAnatomy.attrs("control")}
        id={id}
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={current}
        disabled={disabled}
        onChange={(event) => setValue(Number(event.target.value))}
        style={{ "--slider-progress": `${percent}%` } as React.CSSProperties}
      />
    </div>
  );
});
