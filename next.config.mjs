/**
 * Two build modes from one codebase:
 *
 * - Default (`next build`): Node server build. Keeps `/api/contact` (real mail
 *   via Resend), Next's image optimizer, and `npm run start` / browser tests.
 * - Static export (`NEXT_STATIC_EXPORT=1`, used by `npm run build:pages` and the
 *   GitHub Pages workflow): `output: 'export'` into `out/`, unoptimized images,
 *   `trailingSlash` for reliable Pages routing, and a `basePath` so the site
 *   works at https://<user>.github.io/<repo>/.
 *
 * `src/app/api` cannot exist in a static export (POST Route Handlers need a
 * server), so `scripts/build-pages.mjs` temporarily hides it during that build.
 */
const staticExport = process.env.NEXT_STATIC_EXPORT === "1";
const basePath = staticExport
  ? process.env.PAGES_BASE_PATH ?? "/Portfolio-Dushu"
  : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(staticExport ? { output: "export" } : {}),
  ...(basePath ? { basePath } : {}),
  ...(staticExport ? { trailingSlash: true } : {}),
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: staticExport ? "1" : "0",
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
