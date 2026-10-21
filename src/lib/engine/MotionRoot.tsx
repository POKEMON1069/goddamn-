"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger, ease, prefersReducedMotion } from "./motion";
import { onReady } from "./intro";

/**
 * Page-level motion only: the hero intro, section reveals, headline wipes and
 * the registration mark's idle breathing. Everything hangs off data attributes
 * so pages stay plain semantic HTML.
 */
export function MotionRoot() {
  const pathname = usePathname();

  // Idle state: the printer's mark breathes. Slight, slow, one clock.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mark = document.querySelector<SVGElement>(".nav__mark svg");
    const dots = document.querySelectorAll<SVGElement>(".regmark__dot, .hero__kicker-dot");
    if (!mark) return;

    // The press keeps a little pressure on, even with nobody at the desk.
    const tweens = [
      gsap.to(mark, {
        rotate: 13,
        scale: 1.12,
        duration: 4.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      }),
    ];
    if (dots.length) {
      tweens.push(
        gsap.to(dots, {
          scale: 2.1,
          opacity: 0.45,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          transformOrigin: "50% 50%",
          stagger: 0.35,
        }),
      );
    }

    const onVisibility = () => (document.hidden ? tweens.forEach((t) => t.pause()) : tweens.forEach((t) => t.play()));
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      tweens.forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.dataset.motion = "reduced";
      return;
    }

    const ctx = gsap.context(() => {
      // Hero intro, once the first sheet has lifted.
      if (document.querySelector("[data-intro]")) {
        onReady(() => {
          const tl = gsap.timeline({ defaults: { ease: ease.settle } });
          tl.fromTo(
            "[data-nav] [data-nav-item]",
            { yPercent: -110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.7, stagger: 0.05 },
          )
            .fromTo(
              "[data-intro] .line",
              { yPercent: 116 },
              { yPercent: 0, duration: 1.05, stagger: 0.09, ease: ease.lift },
              0.05,
            )
            .fromTo(
              "[data-intro] [data-fade]",
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
              0.46,
            )
            .fromTo(
              "[data-intro] [data-sheet]",
              { clipPath: "inset(0% 0% 100% 0%)", scale: 1.045 },
              { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.35, ease: ease.lift },
              0.12,
            );
        });
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 30,
          opacity: 0,
          duration: 0.9,
          ease: ease.out,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el) => {
        const lines = el.querySelectorAll(".line");
        if (!lines.length) return;
        gsap.from(lines, {
          yPercent: 108,
          duration: 1,
          stagger: 0.075,
          ease: ease.lift,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const t = setTimeout(refresh, 700);

    return () => {
      clearTimeout(t);
      ctx.revert();
      delete document.documentElement.dataset.motion;
    };
  }, [pathname]);

  return null;
}
