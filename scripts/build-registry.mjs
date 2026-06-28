/**
 * Builds the component registry consumed by @tessera/cli.
 *
 * For each component we package:
 *   - the React source (packages/react/src/components/<name>.tsx)
 *   - the CSS recipe   (packages/styles/src/recipes/<name>.css)
 *   - the AI manifest  (packages/react/manifests/<name>.json)
 *
 * Output: registry/index.json + registry/components/<name>.json with embedded
 * file contents and a content hash per file (the basis for 3-way merges).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const reactComponents = join(root, "packages/react/src/components");
const recipes = join(root, "packages/styles/src/recipes");
const manifests = join(root, "packages/react/manifests");
const outDir = join(root, "registry");

const sha = (content) => createHash("sha256").update(content).digest("hex").slice(0, 16);

const names = readdirSync(manifests)
  .filter((file) => file.endsWith(".json"))
  .map((file) => file.replace(/\.json$/, ""));

const index = [];
mkdirSync(join(outDir, "components"), { recursive: true });

for (const name of names) {
  const manifest = JSON.parse(readFileSync(join(manifests, `${name}.json`), "utf8"));
  const files = [];

  const tsxPath = join(reactComponents, `${name}.tsx`);
  if (existsSync(tsxPath)) {
    const content = readFileSync(tsxPath, "utf8");
    files.push({ path: `${name}.tsx`, hash: sha(content), content });
  }
  const cssPath = join(recipes, `${name}.css`);
  if (existsSync(cssPath)) {
    const content = readFileSync(cssPath, "utf8");
    files.push({ path: `${name}.css`, hash: sha(content), content });
  }

  const entry = {
    name,
    displayName: manifest.displayName,
    version: manifest.version,
    description: manifest.description,
    dependencies: ["@tessera/core", "@tessera/tokens"],
    files,
  };
  writeFileSync(join(outDir, "components", `${name}.json`), JSON.stringify(entry, null, 2));
  index.push({
    name,
    displayName: manifest.displayName,
    version: manifest.version,
    description: manifest.description,
  });
}

writeFileSync(join(outDir, "index.json"), JSON.stringify(index, null, 2));
console.log(`registry: ${index.length} components -> registry/`);
