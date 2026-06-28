let counter = 0;

/** Generates a stable unique id with a tessera prefix (vanilla/non-React usage). */
export function genId(prefix: string): string {
  counter += 1;
  return `tessera-${prefix}-${counter}`;
}
