import { describe, expect, it } from "vitest";
import { threeWayMerge } from "./merge";

const base = ["line1", "line2", "line3", "line4", "line5"].join("\n");

describe("threeWayMerge", () => {
  it("merges non-overlapping local and upstream changes cleanly", () => {
    const local = base.replace("line1", "line1-local");
    const upstream = base.replace("line5", "line5-upstream");
    const result = threeWayMerge(local, base, upstream);

    expect(result.conflicts).toBe(0);
    expect(result.content).toContain("line1-local");
    expect(result.content).toContain("line5-upstream");
  });

  it("produces conflict markers on overlapping changes", () => {
    const local = base.replace("line3", "line3-local");
    const upstream = base.replace("line3", "line3-upstream");
    const result = threeWayMerge(local, base, upstream);

    expect(result.conflicts).toBe(1);
    expect(result.content).toContain("<<<<<<< local");
    expect(result.content).toContain("line3-local");
    expect(result.content).toContain("line3-upstream");
    expect(result.content).toContain(">>>>>>> upstream");
  });

  it("is a no-op when nothing changed", () => {
    const result = threeWayMerge(base, base, base);
    expect(result.conflicts).toBe(0);
    expect(result.content).toBe(base);
  });
});
