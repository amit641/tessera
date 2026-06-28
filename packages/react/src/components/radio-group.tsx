"use client";
import * as React from "react";
import { radioGroupAnatomy } from "@tessera/core";
import { createStrictContext, useControllableState } from "../utils/hooks";

interface RadioGroupContextValue {
  name: string;
  value: string | null;
  setValue: (value: string) => void;
  disabled?: boolean;
}

const [RadioGroupProvider, useRadioGroupContext] =
  createStrictContext<RadioGroupContextValue>("RadioGroup");

export interface RadioGroupRootProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  disabled?: boolean;
  name?: string;
  children: React.ReactNode;
}

function RadioGroupRoot({
  label,
  value,
  defaultValue,
  onValueChange,
  orientation = "vertical",
  disabled,
  name,
  children,
}: RadioGroupRootProps) {
  const autoName = React.useId();
  const labelId = React.useId();
  const [current, setValue] = useControllableState<string | null>({
    value,
    defaultValue: defaultValue ?? null,
    onChange: onValueChange as (value: string | null) => void,
  });

  return (
    <div
      {...radioGroupAnatomy.attrs("root")}
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
      data-orientation={orientation}
      data-disabled={disabled || undefined}
    >
      {label && (
        <span {...radioGroupAnatomy.attrs("label")} id={labelId}>
          {label}
        </span>
      )}
      <RadioGroupProvider
        value={{ name: name ?? autoName, value: current, setValue, disabled }}
      >
        {children}
      </RadioGroupProvider>
    </div>
  );
}

export interface RadioGroupItemProps {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

function RadioGroupItem({ value, label, disabled: itemDisabled }: RadioGroupItemProps) {
  const group = useRadioGroupContext();
  const disabled = group.disabled || itemDisabled;
  const checked = group.value === value;
  const state = checked ? "checked" : "unchecked";

  return (
    <label {...radioGroupAnatomy.attrs("item")} data-disabled={disabled || undefined}>
      <input
        type="radio"
        data-visually-hidden=""
        name={group.name}
        value={value}
        checked={checked}
        onChange={() => group.setValue(value)}
        disabled={disabled}
      />
      <span {...radioGroupAnatomy.attrs("control")} data-state={state} aria-hidden>
        <span {...radioGroupAnatomy.attrs("indicator")} />
      </span>
      <span {...radioGroupAnatomy.attrs("itemLabel")}>{label}</span>
    </label>
  );
}

export const RadioGroup = {
  Root: RadioGroupRoot,
  Item: RadioGroupItem,
};
