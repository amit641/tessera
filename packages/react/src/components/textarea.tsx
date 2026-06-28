"use client";
import * as React from "react";
import { textareaAnatomy } from "@tessera/core";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, description, error, id: idProp, className, style, ...rest },
  ref
) {
  const autoId = React.useId();
  const id = idProp ?? `${autoId}-textarea`;
  const descriptionId = `${autoId}-description`;
  const errorId = `${autoId}-error`;
  const invalid = error !== undefined;

  const describedBy =
    [description && descriptionId, invalid && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div {...textareaAnatomy.attrs("root")} className={className} style={style}>
      <label {...textareaAnatomy.attrs("label")} htmlFor={id}>
        {label}
      </label>
      <textarea
        {...textareaAnatomy.attrs("input")}
        id={id}
        ref={ref}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {description && (
        <p {...textareaAnatomy.attrs("description")} id={descriptionId}>
          {description}
        </p>
      )}
      {invalid && (
        <p {...textareaAnatomy.attrs("error")} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
