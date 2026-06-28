"use client";
import * as React from "react";
import { switchAnatomy } from "@tessera/core";
import { useControllableState } from "../utils/hooks";

export interface SwitchProps {
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked = false, onCheckedChange, disabled, name, value },
  ref
) {
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const state = isChecked ? "checked" : "unchecked";

  return (
    <label {...switchAnatomy.attrs("root")} data-disabled={disabled || undefined}>
      <input
        type="checkbox"
        role="switch"
        data-visually-hidden=""
        ref={ref}
        checked={isChecked}
        onChange={(event) => setChecked(event.target.checked)}
        disabled={disabled}
        name={name}
        value={value}
      />
      <span {...switchAnatomy.attrs("control")} data-state={state} aria-hidden>
        <span {...switchAnatomy.attrs("thumb")} />
      </span>
      <span {...switchAnatomy.attrs("label")}>{label}</span>
    </label>
  );
});
