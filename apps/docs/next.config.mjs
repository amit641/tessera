/** @type {import('next').NextConfig} */

// Base path is empty for local dev and set to "/tessera" in CI so the site
// works when served from https://<user>.github.io/tessera.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  transpilePackages: ["@tessera/react", "@tessera/core", "@tessera/tokens"],
  // Emit a fully static site (out/) for GitHub Pages.
  output: "export",
  // Each route becomes <route>/index.html so Pages serves nested URLs correctly.
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
