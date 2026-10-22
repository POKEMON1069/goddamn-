/*
 * SCROLL ENGINE — one clock for the whole site.
 *
 * Every page-level effect lives here (or in page modules that import it) and
 * is torn down on navigation so nothing leaks between routes.
 *
 * Rules honoured:
 * - animate transform / opacity / clip-path only — never layout props
 * - everything runs on GSAP's ticker via Lenis sync; no raw scroll listeners
 * - respects prefers-reduced-motion: no smooth scroll, instant states
 */

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export const ease = {
  expo: "expo.inOut",
  quart: "power4.inOut",
  sine: "sine.inOut",
};

/** Shared Lenis instance. One per page. */
let lenis: Lenis | null = null;

/**
 * Initialize Lenis + GSAP scroll sync. Call once per page mount.
 * Returns a cleanup function to kill both on unmount / navigation.
 */
export function initSmoothScroll({
  lerp = 0.08,
  duration = 1.2,
}: { lerp?: number; duration?: number } = {}) {
  if (typeof window === "undefined") return () => {};

  if (lenis) lenis.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  lenis = new Lenis({
    lerp,
    duration,
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: !prefersReduced.matches,
    syncTouch: !prefersReduced.matches,
  });

  // One clock: GSAP ticker drives Lenis. lenis.on('scroll') keeps
  // ScrollTrigger in sync on every frame.
  lenis.on("scroll", ScrollTrigger.update);
  const onTick = (time: number) => {
    lenis?.raf(time * 1000);
  };
  gsap.ticker.add(onTick);
  ScrollTrigger.refresh();

  return () => {
    gsap.ticker.remove(onTick);
    lenis?.destroy();
    lenis = null;
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}

/** React hook wrapper. */
export function useSmoothScroll(opts?: { lerp?: number; duration?: number }) {
  useEffect(() => {
    return initSmoothScroll(opts);
  }, [opts]);
}

/** Force a ScrollTrigger refresh (after images/fonts load). */
export function refreshScroll() {
  if (typeof window !== "undefined") ScrollTrigger.refresh();
}

/** Scroll to top. */
export function scrollToTop() {
  if (typeof window !== "undefined" && lenis) {
    lenis.scrollTo(0, { immediate: true });
  }
}

/** Get the shared instance (for page modules). */
export function getLenis() {
  return lenis;
}
