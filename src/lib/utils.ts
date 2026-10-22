import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/**
 * Prefix a site-absolute asset path with the deployment base path
 * (empty on a root deployment, `/Portfolio-Dushu` on GitHub Pages).
 * `next/link` handles basePath itself; raw `src`/`href` values must not.
 */
export function assetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
