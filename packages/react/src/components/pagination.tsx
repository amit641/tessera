"use client";
import * as React from "react";
import { paginationAnatomy, paginationRange } from "@tessera/core";
import { useControllableState } from "../utils/hooks";

export interface PaginationProps {
  /** Total number of pages. */
  count: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current page. Default 1. */
  siblings?: number;
}

export function Pagination({
  count,
  page,
  defaultPage = 1,
  onPageChange,
  siblings = 1,
}: PaginationProps) {
  const [current, setPage] = useControllableState({
    value: page,
    defaultValue: defaultPage,
    onChange: onPageChange,
  });
  const entries = paginationRange(current, count, siblings);

  return (
    <nav {...paginationAnatomy.attrs("root")} aria-label="Pagination">
      <ul {...paginationAnatomy.attrs("list")}>
        <li>
          <button
            type="button"
            {...paginationAnatomy.attrs("prev")}
            aria-label="Previous page"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          >
            ‹
          </button>
        </li>
        {entries.map((entry, index) =>
          entry === "ellipsis" ? (
            <li key={`ellipsis-${index}`}>
              <span {...paginationAnatomy.attrs("ellipsis")} aria-hidden>
                …
              </span>
            </li>
          ) : (
            <li key={entry}>
              <button
                type="button"
                {...paginationAnatomy.attrs("item")}
                aria-label={`Page ${entry}`}
                aria-current={entry === current ? "page" : undefined}
                onClick={() => setPage(entry)}
              >
                {entry}
              </button>
            </li>
          )
        )}
        <li>
          <button
            type="button"
            {...paginationAnatomy.attrs("next")}
            aria-label="Next page"
            disabled={current >= count}
            onClick={() => setPage(current + 1)}
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}
