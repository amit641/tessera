import { diff3Merge } from "node-diff3";

export interface MergeResult {
  content: string;
  conflicts: number;
}

/**
 * 3-way merge: `base` is the pristine upstream snapshot from the last
 * add/update, `local` is the user's (possibly modified) copy, `upstream`
 * is the new registry version. Non-overlapping changes merge cleanly;
 * overlaps produce git-style conflict markers for the user to review.
 */
export function threeWayMerge(local: string, base: string, upstream: string): MergeResult {
  const regions = diff3Merge(local.split("\n"), base.split("\n"), upstream.split("\n"), {
    excludeFalseConflicts: true,
  });

  const lines: string[] = [];
  let conflicts = 0;
  for (const region of regions) {
    if ("ok" in region && region.ok) {
      lines.push(...region.ok);
    } else if ("conflict" in region && region.conflict) {
      conflicts++;
      lines.push("<<<<<<< local (your changes)");
      lines.push(...region.conflict.a);
      lines.push("=======");
      lines.push(...region.conflict.b);
      lines.push(">>>>>>> upstream (tessera update)");
    }
  }
  return { content: lines.join("\n"), conflicts };
}
