"use client";
import * as React from "react";
import { textFieldAnatomy } from "@tessera/core";

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  /** Helper text rendered below the input and linked via aria-describedby. */
  description?: string;
  /** Error message; when present the field is marked invalid. */
  error?: string;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, description, error, id: idProp, className, style, ...rest },
  ref
) {
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-input`;
  const descriptionId = `${autoId}-description`;
  const errorId = `${autoId}-error`;
  const invalid = error !== undefined;

  const describedBy =
    [description && descriptionId, invalid && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div {...textFieldAnatomy.attrs("root")} className={className} style={style}>
      <label {...textFieldAnatomy.attrs("label")} htmlFor={id}>
        {label}
      </label>
      <input
        {...textFieldAnatomy.attrs("input")}
        id={id}
        ref={ref}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {description && (
        <p {...textFieldAnatomy.attrs("description")} id={descriptionId}>
          {description}
        </p>
      )}
      {invalid && (
        <p {...textFieldAnatomy.attrs("error")} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
