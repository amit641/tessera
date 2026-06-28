import { describe, expect, it } from "vitest";
import { paginationRange } from "./pagination";

describe("paginationRange", () => {
  it("returns all pages when the total is small", () => {
    expect(paginationRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("collapses both sides around a middle page", () => {
    expect(paginationRange(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });

  it("only collapses the far side near the edges", () => {
    expect(paginationRange(2, 10)).toEqual([1, 2, 3, "ellipsis", 10]);
    expect(paginationRange(9, 10)).toEqual([1, "ellipsis", 8, 9, 10]);
  });

  it("respects the siblings parameter", () => {
    expect(paginationRange(25, 50, 2)).toEqual([1, "ellipsis", 23, 24, 25, 26, 27, "ellipsis", 50]);
  });

  it("clamps out-of-range pages and handles empty input", () => {
    expect(paginationRange(99, 10)).toEqual([1, "ellipsis", 9, 10]);
    expect(paginationRange(1, 0)).toEqual([]);
  });
});
