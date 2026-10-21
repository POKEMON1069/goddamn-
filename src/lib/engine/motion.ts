"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// One plugin registration for the whole app.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** The single easing family. Big things move slower than small things. */
export const ease = {
  paper: "power2.inOut",
  out: "power3.out",
  inOut: "power3.inOut",
  lift: "expo.inOut",
  settle: "power4.out",
} as const;

export const duration = {
  micro: 0.24,
  small: 0.55,
  page: 0.72,
  lift: 0.95,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
