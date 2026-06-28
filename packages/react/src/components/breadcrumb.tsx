"use client";
import * as React from "react";
import { breadcrumbAnatomy } from "@tessera/core";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Ordered trail; the last item is the current page (aria-current). */
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator = "/", ...rest },
  ref
) {
  return (
    <nav {...breadcrumbAnatomy.attrs("root")} aria-label="Breadcrumb" ref={ref} {...rest}>
      <ol {...breadcrumbAnatomy.attrs("list")}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} {...breadcrumbAnatomy.attrs("item")}>
              <a
                {...breadcrumbAnatomy.attrs("link")}
                href={isCurrent ? undefined : item.href}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item.label}
              </a>
              {!isCurrent && (
                <span {...breadcrumbAnatomy.attrs("separator")} aria-hidden>
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});
