"use client";
import * as React from "react";
import { checkboxAnatomy } from "@tessera/core";
import { useControllableState } from "../utils/hooks";
import { CheckIcon } from "../utils/icons";

export interface CheckboxProps {
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
}

/** Built on a real (visually hidden) input: native forms and a11y for free. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, checked, defaultChecked = false, onCheckedChange, disabled, name, value, required },
  ref
) {
  const [isChecked, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });
  const state = isChecked ? "checked" : "unchecked";

  return (
    <label {...checkboxAnatomy.attrs("root")} data-disabled={disabled || undefined}>
      <input
        type="checkbox"
        data-visually-hidden=""
        ref={ref}
        checked={isChecked}
        onChange={(event) => setChecked(event.target.checked)}
        disabled={disabled}
        name={name}
        value={value}
        required={required}
      />
      <span {...checkboxAnatomy.attrs("control")} data-state={state} aria-hidden>
        {isChecked && (
          <span {...checkboxAnatomy.attrs("indicator")}>
            <CheckIcon />
          </span>
        )}
      </span>
      <span {...checkboxAnatomy.attrs("label")}>{label}</span>
    </label>
  );
});
