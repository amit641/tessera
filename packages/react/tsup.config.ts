import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom"],
  // The whole package is client components; bundling strips per-file
  // "use client" directives, so re-add one at the top of the bundle.
  banner: { js: '"use client";' },
});
