"use client";

/**
 * Tiny ready bus: the preloader announces that the first sheet has lifted, and
 * anything that needs to move (the hero, the nav) listens.
 */
type Fn = () => void;

let ready = false;
const listeners = new Set<Fn>();

export function markReady() {
  if (ready) return;
  ready = true;
  if (typeof document !== "undefined") document.documentElement.dataset.ready = "true";
  listeners.forEach((fn) => fn());
  listeners.clear();
}

export function isReady() {
  return ready;
}

export function onReady(fn: Fn) {
  if (ready) {
    fn();
    return () => {};
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
