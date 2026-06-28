import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export interface LockedComponent {
  version: string;
  dir: string;
  files: Record<string, string>; // file path -> upstream content hash at add/update time
}

export interface Lockfile {
  components: Record<string, LockedComponent>;
}

const LOCKFILE = "tessera-lock.json";
const BASE_DIR = ".tessera/base";

export function readLockfile(cwd: string): Lockfile {
  const file = join(cwd, LOCKFILE);
  if (!existsSync(file)) return { components: {} };
  return JSON.parse(readFileSync(file, "utf8"));
}

export function writeLockfile(cwd: string, lockfile: Lockfile): void {
  writeFileSync(join(cwd, LOCKFILE), JSON.stringify(lockfile, null, 2) + "\n");
}

/** Base snapshots are the pristine upstream copies used as the 3-way merge ancestor. */
export function baseFilePath(cwd: string, component: string, file: string): string {
  return join(cwd, BASE_DIR, component, file);
}

export function writeBaseFile(cwd: string, component: string, file: string, content: string): void {
  const path = baseFilePath(cwd, component, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

export function readBaseFile(cwd: string, component: string, file: string): string | null {
  const path = baseFilePath(cwd, component, file);
  return existsSync(path) ? readFileSync(path, "utf8") : null;
}
