export type PaginationEntry = number | "ellipsis";

/**
 * Computes the visible page items for a pagination control:
 * first/last pages always visible, `siblings` pages around the current page,
 * and "ellipsis" markers where ranges are collapsed.
 *
 * paginationRange(5, 10) -> [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 */
export function paginationRange(
  current: number,
  total: number,
  siblings = 1
): PaginationEntry[] {
  if (total <= 0) return [];
  const clamped = Math.min(Math.max(current, 1), total);

  // Everything fits without collapsing: first + last + current window + 2 ellipses.
  if (total <= 2 * siblings + 5) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(clamped - siblings, 2);
  const end = Math.min(clamped + siblings, total - 1);
  const range: PaginationEntry[] = [1];

  if (start > 2) range.push("ellipsis");
  for (let page = start; page <= end; page++) range.push(page);
  if (end < total - 1) range.push("ellipsis");
  range.push(total);

  return range;
}
