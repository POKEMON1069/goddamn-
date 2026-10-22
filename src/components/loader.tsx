"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";

/*
 * LOADER — Phase 6. The brief (a portfolio built around one signature moment)
 * earns a short loader: a black curtain holding the name, then a wipe up to
 * reveal the first frame. Hard cap 2.6 s; under reduced motion it is skipped
 * entirely and content is visible immediately.
 */
export default function Loader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      // Skip theatre; show content instantly.
      setReady(true);
      return;
    }

    const curtain = document.getElementById("loader-curtain");
    const name = document.getElementById("loader-name");

    const tl = gsap.timeline();
    tl.to([], { duration: 0.6 }); // hold the first frame so the name lands
    tl.from(name, { y: 40, opacity: 0, duration: 0.9, ease: "expo" }, 0.1);
    tl.to(curtain, {
      y: "-100%",
      duration: 1,
      ease: "expo.inOut",
      delay: 0.4,
    });
    tl.call(() => setReady(true));

    return () => {
      tl.kill();
    };
  }, []);

  if (!ready) {
    return (
      <div id="loader" className="loader" aria-hidden="true">
        <div id="loader-curtain" className="loader-curtain" />
        <div id="loader-name" className="loader-name">
          GOD<b>DAMN</b>-
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
