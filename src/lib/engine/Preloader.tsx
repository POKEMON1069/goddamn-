"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { RegistrationMark } from "@/components/RegistrationMark";
import { gsap, ease, prefersReducedMotion } from "./motion";
import { markReady } from "./intro";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function decodeHero() {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = "/images/hero-press-960w.webp";
    if (img.decode) img.decode().then(() => resolve()).catch(() => resolve());
  });
}

/**
 * The first sheet off the press. It lifts once the real work is ready: fonts
 * and the hero image, never a fake delay longer than 2 seconds.
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem("np:proof") === "1";
    } catch {
      seen = false;
    }

    if (prefersReducedMotion() || seen) {
      markReady();
      setGone(true);
      return;
    }

    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet) {
      markReady();
      setGone(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const counter = { value: 0 };
    const min = window.innerWidth < 700 ? 620 : 820;

    const countTween = gsap.to(counter, {
      value: 100,
      duration: min / 1000 + 0.15,
      ease: "power1.inOut",
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
        }
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${Math.max(counter.value, 2) / 100})`;
        }
      },
    });

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      countTween.progress(1);

      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            try {
              window.sessionStorage.setItem("np:proof", "1");
            } catch {
              /* private mode */
            }
            setGone(true);
          },
        })
        .to(root.querySelectorAll("[data-loader-fade]"), { opacity: 0, duration: 0.25, ease: "none" }, 0)
        .add(() => markReady(), 0.08)
        .to(sheet, { yPercent: -101, rotate: -0.7, duration: 0.95, ease: ease.lift }, 0.1);
    };

    Promise.race([
      Promise.all([document.fonts.ready, decodeHero()]).then(() => wait(min)),
      wait(2200),
    ]).then(finish);

    return () => {
      finished = true;
      countTween.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <div className="loader__sheet" ref={sheetRef}>
        <div className="loader__row" data-loader-fade>
          <span className="mono-xs">N. Raghunathan</span>
          <span className="mono-xs">Chennai, IN</span>
        </div>

        <div className="loader__center">
          <span className="loader__count" ref={countRef}>
            000
          </span>
          <span className="loader__mark" data-loader-fade>
            <RegistrationMark />
          </span>
        </div>

        <div className="loader__row loader__row--foot" data-loader-fade>
          <span className="mono-xs">Pulling a proof</span>
          <span className="loader__bar">
            <span className="loader__bar-fill" ref={barRef} />
          </span>
        </div>
      </div>
    </div>
  );
}
