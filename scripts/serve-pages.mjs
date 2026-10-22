#!/usr/bin/env node
/**
 * Serves `out/` locally the way GitHub Pages will: the site lives under
 * PAGES_BASE_PATH (default `/Portfolio-Dushu`), directories resolve to
 * index.html, unknown paths serve 404.html with status 404.
 *
 * Usage: `npm run preview:pages` (after `npm run build:pages`)
 * PORT env var changes the port (default 4173).
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "out");
const basePath = process.env.PAGES_BASE_PATH ?? "/Portfolio-Dushu";
const port = Number(process.env.PORT || 4173);
const host = "0.0.0.0";

if (!existsSync(join(outDir, "index.html"))) {
  console.error("out/index.html not found — run `npm run build:pages` first.");
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
};

function send(res, status, filePath) {
  res.writeHead(status, {
    "Content-Type": types[extname(filePath)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(filePath).pipe(res);
}

function resolveFile(relPath) {
  const safe = normalize(relPath).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
  const candidate = join(outDir, safe);
  if (!candidate.startsWith(outDir)) return null;
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  const html = `${candidate}.html`;
  if (existsSync(html) && statSync(html).isFile()) return html;
  const index = join(candidate, "index.html");
  if (existsSync(index) && statSync(index).isFile()) return index;
  return null;
}

createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url ?? "/", `http://${req.headers.host}`).pathname);
  if (pathname === "/" || pathname === basePath) {
    res.writeHead(302, { Location: `${basePath}/` });
    return res.end();
  }
  if (!pathname.startsWith(`${basePath}/`)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    return res.end("Not found (this deployment lives under " + basePath + "/)");
  }
  const rel = pathname.slice(basePath.length);
  const found = resolveFile(rel);
  if (found) return send(res, 200, found);
  const notFound = join(outDir, "404.html");
  if (existsSync(notFound)) return send(res, 404, notFound);
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  return res.end("Not found");
}).listen(port, host, () => {
  console.log(`Serving out/ at http://${host}:${port}${basePath}/ (like GitHub Pages)`);
});
