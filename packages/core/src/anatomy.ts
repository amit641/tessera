/**
 * The Anatomy Contract.
 *
 * Every Tessera component declares its named parts. Each rendered part carries
 * `data-scope` (the component) and `data-part` (the part) attributes.
 *
 * These attributes are a VERSIONED PUBLIC API:
 * - style overrides target them (never internal class names),
 * - tests select against them,
 * - they are guaranteed stable across minor/patch releases.
 *
 * Renaming or removing a part is a breaking change by definition.
 */
export interface AnatomyPartAttrs {
  "data-scope": string;
  "data-part": string;
}

export interface Anatomy<P extends string> {
  scope: string;
  parts: readonly P[];
  /** DOM attributes identifying a part: `{"data-scope": scope, "data-part": part}` */
  attrs(part: P): AnatomyPartAttrs;
  /** Stable CSS selector for a part, e.g. `[data-scope="dialog"][data-part="trigger"]` */
  selector(part: P): string;
}

export function createAnatomy<const P extends string>(
  scope: string,
  parts: readonly P[]
): Anatomy<P> {
  return {
    scope,
    parts,
    attrs: (part) => ({ "data-scope": scope, "data-part": part }),
    selector: (part) => `[data-scope="${scope}"][data-part="${part}"]`,
  };
}
