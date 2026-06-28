import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface RegistryFile {
  path: string;
  hash: string;
  content: string;
}

export interface RegistryEntry {
  name: string;
  displayName: string;
  version: string;
  description: string;
  dependencies: string[];
  files: RegistryFile[];
}

export interface RegistryIndexEntry {
  name: string;
  displayName: string;
  version: string;
  description: string;
}

/**
 * Resolves the registry directory. In a published CLI this would be a URL;
 * locally it's the monorepo's registry/ folder (or TESSERA_REGISTRY).
 */
function registryDir(): string {
  if (process.env.TESSERA_REGISTRY) return process.env.TESSERA_REGISTRY;
  // Walk up from the CLI package to the monorepo root.
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "registry");
    if (existsSync(join(candidate, "index.json"))) return candidate;
    dir = dirname(dir);
  }
  throw new Error(
    "Could not locate the Tessera registry. Set TESSERA_REGISTRY to the registry directory."
  );
}

export function readIndex(): RegistryIndexEntry[] {
  return JSON.parse(readFileSync(join(registryDir(), "index.json"), "utf8"));
}

export function readEntry(name: string): RegistryEntry {
  const file = join(registryDir(), "components", `${name}.json`);
  if (!existsSync(file)) {
    throw new Error(`Unknown component "${name}". Run \`tessera list\` to see what's available.`);
  }
  return JSON.parse(readFileSync(file, "utf8"));
}
