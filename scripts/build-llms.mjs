/**
 * Aggregates per-component AI manifests into a single llms.txt,
 * served by the docs site so coding agents can read accurate,
 * version-correct usage instead of hallucinating APIs.
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestsDir = join(root, "packages/react/manifests");
const outDir = join(root, "apps/docs/public");

const manifests = readdirSync(manifestsDir)
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(join(manifestsDir, file), "utf8")));

const lines = [];
lines.push("# Tessera Design System");
lines.push("");
lines.push("> Tessera is a token-first, zero-runtime-CSS design system with a framework-agnostic");
lines.push("> core. Styling targets stable [data-scope][data-part] anatomy attributes (a versioned");
lines.push("> public API). All CSS lives in `@layer tessera`, so plain application CSS always wins.");
lines.push("");
lines.push("Setup:");
lines.push("```tsx");
lines.push('import "@tessera/tokens/tokens.css";');
lines.push('import "@tessera/styles/index.css";');
lines.push("// Theming: <html data-theme=\"dark\"> or \"light\". Dark is the default.");
lines.push("```");
lines.push("");
lines.push(`Components (${manifests.length}):`);
lines.push("");

for (const m of manifests.sort((a, b) => a.name.localeCompare(b.name))) {
  lines.push(`## ${m.displayName} (v${m.version})`);
  lines.push("");
  lines.push(m.description);
  lines.push("");
  lines.push(`Import: \`${m.import}\``);
  lines.push("");
  lines.push(`Anatomy parts (stable selectors): ${m.anatomy.map((a) => a.part).join(", ")}`);
  lines.push("");
  lines.push("Props:");
  for (const p of m.props) {
    const required = p.required ? " (required)" : "";
    const def = p.default ? ` = ${p.default}` : "";
    const desc = p.description ? ` — ${p.description}` : "";
    lines.push(`- \`${p.name}\`: ${p.type}${def}${required}${desc}`);
  }
  if (m.a11y.keyboard.length > 0) {
    lines.push("");
    lines.push("Keyboard:");
    for (const k of m.a11y.keyboard) lines.push(`- ${k.key}: ${k.action}`);
  }
  lines.push("");
  lines.push("Example:");
  lines.push("```tsx");
  lines.push(m.examples[0]);
  lines.push("```");
  lines.push("");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "llms.txt"), lines.join("\n"));
console.log(`llms.txt: ${manifests.length} components -> apps/docs/public/llms.txt`);
