import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface Manifest {
  name: string;
  displayName: string;
  version: string;
  category: string;
  import: string;
  description: string;
  anatomy: { part: string; element: string; stable: boolean; note?: string }[];
  props: { name: string; type: string; default?: string; required?: boolean; description?: string }[];
  a11y: { roles: string[]; keyboard: { key: string; action: string }[]; notes: string[] };
  styling: { selectors: string[]; componentTokens?: string[]; stateAttributes?: string[] };
  examples: string[];
}

const manifestsDir = join(process.cwd(), "../../packages/react/manifests");

export const componentSlugs = readdirSync(manifestsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(/\.json$/, ""))
  .sort();

export function readManifest(slug: string): Manifest {
  return JSON.parse(readFileSync(join(manifestsDir, `${slug}.json`), "utf8"));
}

const categoryOrder = ["forms", "overlay", "navigation", "data-display", "feedback"];

export const categoryLabels: Record<string, string> = {
  forms: "Forms",
  overlay: "Overlay",
  navigation: "Navigation",
  "data-display": "Data display",
  feedback: "Feedback",
};

/** Slugs grouped by manifest category, in a fixed display order. */
export function groupedComponentSlugs(): { category: string; slugs: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const slug of componentSlugs) {
    const { category } = readManifest(slug);
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category)!.push(slug);
  }
  return categoryOrder
    .filter((category) => groups.has(category))
    .map((category) => ({ category, slugs: groups.get(category)!.sort() }));
}
