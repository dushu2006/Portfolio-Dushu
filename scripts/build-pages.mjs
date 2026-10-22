#!/usr/bin/env node
/**
 * Builds the static export (`out/`) deployed to GitHub Pages.
 *
 * Runs `next build` with NEXT_STATIC_EXPORT=1 (see next.config.mjs): output
 * 'export', unoptimized images, trailingSlash, and a basePath so the site
 * works at https://<user>.github.io/<repo>/. The Node-only `/api/contact`
 * route is simply not exported; the contact form falls back to the visitor's
 * email client on static hosting.
 *
 * Usage: `npm run build:pages`
 * Override the base path with PAGES_BASE_PATH (default `/Portfolio-Dushu`).
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const basePath = process.env.PAGES_BASE_PATH ?? "/Portfolio-Dushu";
if (!basePath.startsWith("/") || basePath.endsWith("/")) {
  console.error(`PAGES_BASE_PATH must start with "/" and not end with "/": got "${basePath}"`);
  process.exit(1);
}

const nextBin = join(root, "node_modules", "next", "dist", "bin", "next");
const result = spawnSync(process.execPath, [nextBin, "build"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_STATIC_EXPORT: "1",
    PAGES_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_ORIGIN:
      process.env.NEXT_PUBLIC_SITE_ORIGIN ?? `https://dushu2006.github.io${basePath}`,
  },
});
if (result.status !== 0) process.exit(result.status ?? 1);

const outDir = join(root, "out");
const indexHtml = join(outDir, "index.html");
if (!existsSync(indexHtml)) {
  console.error("Static export is missing out/index.html");
  process.exit(1);
}
if (existsSync(join(outDir, "api"))) {
  console.error("out/api must not ship: the contact endpoint requires a Node server.");
  process.exit(1);
}
const html = readFileSync(indexHtml, "utf8");
for (const needle of [`${basePath}/_next/`, `${basePath}/images/`]) {
  if (!html.includes(needle)) {
    console.error(`out/index.html does not reference "${needle}" — basePath handling is broken.`);
    process.exit(1);
  }
}

writeFileSync(join(outDir, ".nojekyll"), "");
console.log(`\nStatic export ready in out/ (basePath "${basePath}").`);
console.log("Preview it like GitHub Pages with: npm run preview:pages");
