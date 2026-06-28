"use client";
import * as React from "react";
import { nextRovingIndex, tabsAnatomy, type NavigationKey } from "@tessera/core";
import { createStrictContext, useControllableState } from "../utils/hooks";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  orientation: "horizontal" | "vertical";
  baseId: string;
}

const [TabsProvider, useTabsContext] = createStrictContext<TabsContextValue>("Tabs");

export interface TabsRootProps {
  value?: string;
  defaultValue: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
}

function TabsRoot({
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  children,
}: TabsRootProps) {
  const [current, setValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = React.useId();

  return (
    <div {...tabsAnatomy.attrs("root")} data-orientation={orientation}>
      <TabsProvider value={{ value: current, setValue, orientation, baseId }}>
        {children}
      </TabsProvider>
    </div>
  );
}

const NAVIGATION_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"];

function TabsList({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const { orientation } = useTabsContext();
  const listRef = React.useRef<HTMLDivElement>(null);

  // Roving focus with automatic activation (WAI-ARIA tabs pattern).
  function onKeyDown(event: React.KeyboardEvent) {
    if (!NAVIGATION_KEYS.includes(event.key) || !listRef.current) return;
    const tabs = Array.from(
      listRef.current.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
    );
    const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (currentIndex === -1) return;
    const next = nextRovingIndex(event.key as NavigationKey, currentIndex, tabs.length, {
      orientation,
    });
    if (next !== currentIndex) {
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    }
  }

  return (
    <div
      {...tabsAnatomy.attrs("list")}
      role="tablist"
      aria-orientation={orientation}
      data-orientation={orientation}
      ref={listRef}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({ value, children, ...rest }: TabsTriggerProps) {
  const ctx = useTabsContext();
  const active = ctx.value === value;
  return (
    <button
      type="button"
      {...tabsAnatomy.attrs("trigger")}
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={active}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      data-state={active ? "active" : "inactive"}
      onClick={() => ctx.setValue(value)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, children, ...rest }: TabsContentProps) {
  const ctx = useTabsContext();
  const active = ctx.value === value;
  return (
    <div
      {...tabsAnatomy.attrs("content")}
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      hidden={!active}
      data-state={active ? "active" : "inactive"}
      {...rest}
    >
      {active && children}
    </div>
  );
}

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};
