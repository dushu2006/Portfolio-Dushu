"use client";
import { useSyncExternalStore } from "react";

const query = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
// Static, accessible surfaces on the server and on touch/reduced-motion devices.
export function usePointerMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}
