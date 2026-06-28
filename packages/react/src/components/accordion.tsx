"use client";
import * as React from "react";
import { accordionAnatomy } from "@tessera/core";
import { createStrictContext, useControllableState } from "../utils/hooks";
import { ChevronDownIcon } from "../utils/icons";

interface AccordionContextValue {
  openValues: string[];
  toggle: (value: string) => void;
  baseId: string;
}

const [AccordionProvider, useAccordionContext] =
  createStrictContext<AccordionContextValue>("Accordion");

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled?: boolean;
}

const [AccordionItemProvider, useAccordionItemContext] =
  createStrictContext<AccordionItemContextValue>("Accordion.Item");

export interface AccordionRootProps {
  /** Allow multiple items open at once. Default false. */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  children: React.ReactNode;
}

function AccordionRoot({
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
  children,
}: AccordionRootProps) {
  const [openValues, setOpenValues] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = React.useId();

  function toggle(itemValue: string) {
    if (openValues.includes(itemValue)) {
      setOpenValues(openValues.filter((v) => v !== itemValue));
    } else {
      setOpenValues(multiple ? [...openValues, itemValue] : [itemValue]);
    }
  }

  return (
    <div {...accordionAnatomy.attrs("root")}>
      <AccordionProvider value={{ openValues, toggle, baseId }}>{children}</AccordionProvider>
    </div>
  );
}

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function AccordionItem({ value, disabled, children }: AccordionItemProps) {
  const { openValues } = useAccordionContext();
  const open = openValues.includes(value);
  return (
    <div
      {...accordionAnatomy.attrs("item")}
      data-state={open ? "open" : "closed"}
      data-disabled={disabled || undefined}
    >
      <AccordionItemProvider value={{ value, open, disabled }}>{children}</AccordionItemProvider>
    </div>
  );
}

function AccordionTrigger({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle, baseId } = useAccordionContext();
  const item = useAccordionItemContext();
  return (
    <h3 {...accordionAnatomy.attrs("header")}>
      <button
        type="button"
        {...accordionAnatomy.attrs("trigger")}
        id={`${baseId}-trigger-${item.value}`}
        aria-expanded={item.open}
        aria-controls={`${baseId}-content-${item.value}`}
        data-state={item.open ? "open" : "closed"}
        disabled={item.disabled}
        onClick={() => toggle(item.value)}
        {...rest}
      >
        <span>{children}</span>
        <span {...accordionAnatomy.attrs("indicator")}>
          <ChevronDownIcon />
        </span>
      </button>
    </h3>
  );
}

function AccordionContent({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { baseId } = useAccordionContext();
  const item = useAccordionItemContext();
  if (!item.open) return null;
  return (
    <div
      {...accordionAnatomy.attrs("content")}
      role="region"
      id={`${baseId}-content-${item.value}`}
      aria-labelledby={`${baseId}-trigger-${item.value}`}
      data-state="open"
      {...rest}
    >
      {children}
    </div>
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};
