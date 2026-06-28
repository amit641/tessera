#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Command } from "commander";
import pc from "picocolors";
import { readEntry, readIndex } from "./registry";
import {
  readBaseFile,
  readLockfile,
  writeBaseFile,
  writeLockfile,
} from "./lockfile";
import { threeWayMerge } from "./merge";

const sha = (content: string) => createHash("sha256").update(content).digest("hex").slice(0, 16);

const program = new Command();
program
  .name("tessera")
  .description(
    "Tessera CLI - eject component source into your repo and keep an upgrade path via 3-way merges."
  )
  .version("0.1.0");

program
  .command("list")
  .description("List components available in the registry")
  .action(() => {
    const index = readIndex();
    console.log(pc.bold(`\nTessera registry (${index.length} components)\n`));
    for (const entry of index) {
      console.log(`  ${pc.cyan(entry.name.padEnd(14))} v${entry.version}  ${pc.dim(entry.description)}`);
    }
    console.log();
  });

program
  .command("add")
  .argument("<component>", "component name, e.g. button")
  .option("-d, --dir <dir>", "target directory", "tessera-ui")
  .description("Copy a component's source into your repo (ejected, you own it)")
  .action((name: string, options: { dir: string }) => {
    const cwd = process.cwd();
    const entry = readEntry(name);
    const lockfile = readLockfile(cwd);

    if (lockfile.components[name]) {
      console.error(pc.red(`"${name}" is already added. Use \`tessera update ${name}\` instead.`));
      process.exitCode = 1;
      return;
    }

    const targetDir = join(cwd, options.dir, name);
    const fileHashes: Record<string, string> = {};
    for (const file of entry.files) {
      const target = join(targetDir, file.path);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, file.content);
      writeBaseFile(cwd, name, file.path, file.content);
      fileHashes[file.path] = file.hash;
      console.log(`  ${pc.green("+")} ${join(options.dir, name, file.path)}`);
    }

    lockfile.components[name] = {
      version: entry.version,
      dir: join(options.dir, name),
      files: fileHashes,
    };
    writeLockfile(cwd, lockfile);

    console.log(
      pc.bold(`\nAdded ${name} v${entry.version}.`) +
        pc.dim(` Runtime deps: ${entry.dependencies.join(", ")}.`) +
        pc.dim(`\nEdit freely - \`tessera update ${name}\` will 3-way merge upstream changes.\n`)
    );
  });

program
  .command("update")
  .argument("<component>", "component name, e.g. button")
  .description("Pull upstream changes into your (possibly modified) copy via 3-way merge")
  .action((name: string) => {
    const cwd = process.cwd();
    const entry = readEntry(name);
    const lockfile = readLockfile(cwd);
    const locked = lockfile.components[name];

    if (!locked) {
      console.error(pc.red(`"${name}" is not in tessera-lock.json. Run \`tessera add ${name}\` first.`));
      process.exitCode = 1;
      return;
    }

    let totalConflicts = 0;
    let changedFiles = 0;

    for (const file of entry.files) {
      const localPath = join(cwd, locked.dir, file.path);
      const base = readBaseFile(cwd, name, file.path);
      const local = existsSync(localPath) ? readFileSync(localPath, "utf8") : null;

      const writeAndTrack = (content: string) => {
        mkdirSync(dirname(localPath), { recursive: true });
        writeFileSync(localPath, content);
        writeBaseFile(cwd, name, file.path, file.content);
        locked.files[file.path] = file.hash;
      };

      if (base === null || local === null) {
        // New upstream file (or user deleted theirs): take upstream.
        writeAndTrack(file.content);
        console.log(`  ${pc.green("+")} ${file.path} ${pc.dim("(new from upstream)")}`);
        changedFiles++;
        continue;
      }

      const upstreamUnchanged = file.content === base;
      const localUnchanged = local === base;

      if (upstreamUnchanged) {
        continue; // Nothing new upstream; keep user's copy untouched.
      }
      if (localUnchanged) {
        writeAndTrack(file.content);
        console.log(`  ${pc.green("~")} ${file.path} ${pc.dim("(fast-forwarded)")}`);
        changedFiles++;
        continue;
      }

      const merged = threeWayMerge(local, base, file.content);
      writeAndTrack(merged.content);
      changedFiles++;
      totalConflicts += merged.conflicts;
      if (merged.conflicts > 0) {
        console.log(`  ${pc.yellow("!")} ${file.path} ${pc.yellow(`(${merged.conflicts} conflict(s) - resolve markers)`)}`);
      } else {
        console.log(`  ${pc.green("~")} ${file.path} ${pc.dim("(merged your changes with upstream)")}`);
      }
    }

    locked.version = entry.version;
    writeLockfile(cwd, lockfile);

    if (changedFiles === 0) {
      console.log(pc.dim(`\n${name} is already up to date (v${entry.version}).\n`));
    } else if (totalConflicts > 0) {
      console.log(
        pc.yellow(`\nUpdated ${name} to v${entry.version} with ${totalConflicts} conflict(s).`) +
          pc.dim(" Search for <<<<<<< markers and resolve them.\n")
      );
    } else {
      console.log(pc.bold(`\nUpdated ${name} to v${entry.version} cleanly.\n`));
    }
  });

program.parse();
