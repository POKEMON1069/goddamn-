"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { work } from "@/data/site";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRefs = useRef<HTMLDivElement[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    let best: HTMLDivElement | null = null;
    let bestDist = Infinity;
    framesRefs.current.forEach((f, i) => {
      if (!f) return;
      const fr = f.getBoundingClientRect();
      const cx = fr.left + fr.width / 2;
      const d = Math.abs(cx - centerX);
      if (d < bestDist) {
        bestDist = d;
        best = f;
      }
    });
    const idx = framesRefs.current.indexOf(best as unknown as HTMLDivElement);
    if (idx !== -1 && idx !== activeIndex) setActiveIndex(idx);
  }, [activeIndex]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const kill: (() => void)[] = [];

    // Idle motion at rest: background plane drifts slowly (the concept keeps breathing)
    const bgRef = document.querySelector(".hero-bg");
    if (bgRef && !media.matches) {
      const drift = gsap.to(bgRef, {
        x: "12%",
        y: "-8%",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      kill.push(() => drift.kill());
    }

    // Intro choreography: subject fades/slides in, filmstrip slides up into place
    const intro = gsap.timeline({ paused: true });
    intro.from(".hero-kicker", { y: 30, opacity: 0, duration: 1, ease: "expo" }, 0);
    intro.from(".hero-name", { y: 40, opacity: 0, duration: 1.2, ease: "expo" }, 0.1);
    intro.from(
      ".hero-role",
      { y: 20, opacity: 0, duration: 0.9, ease: "expo" },
      0.25
    );
    intro.from(".hero-cta", { y: 20, opacity: 0, duration: 0.8, ease: "expo" }, 0.4);
    intro.from(trackRef.current, { y: 40, opacity: 0, duration: 1, ease: "expo" }, 0.6);
    intro.play();

    // Signature moment: pin the film strip; scrolling scrubs it horizontally.
    // The frame nearest the centre racks into focus (scale + border + clear filter).
    if (!media.matches && trackRef.current) {
      const track = trackRef.current;
      const frames = Array.from(
        track.querySelectorAll<HTMLElement>(".film-frame")
      );
      frames.forEach((f, i) => (framesRefs.current[i] = f as HTMLDivElement));

      const totalWidth = track.scrollWidth;
      const pin = containerRef.current!;

      const scrub = gsap.to(track, {
        x: () => -(totalWidth - pin.offsetWidth),
        ease: "none",
      });

      const st = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: `+=${Math.max(window.innerHeight, 600)}px`,
        pin: true,
        invalidateOnRefresh: true,
        scrub: 0.9,
        animation: scrub,
        anticipatePin: 1,
      });
      kill.push(() => st.kill());

      // Rack focus on the frame nearest centre as it scrubs past
      const focusSt = ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: `+=${Math.max(window.innerHeight, 600)}px`,
        onUpdate: () => {
          if (document.hidden) return;
          requestAnimationFrame(updateActive);
        },
      });
      kill.push(() => focusSt.kill());

      // Recalc on resize
      window.addEventListener("resize", () => ScrollTrigger.refresh());
      kill.push(() => window.removeEventListener("resize", () => ScrollTrigger.refresh()));

      // Hover: arm a frame on pointer, keep keyboard focus visible (focus-visible in CSS)
      frames.forEach((f) => {
        f.addEventListener("mouseenter", () => {
          frames.forEach((x) => x.classList.remove("hovered"));
          f.classList.add("hovered");
        });
        f.addEventListener("mouseleave", () => f.classList.remove("hovered"));
      });
    }

    return () => {
      kill.forEach((k) => k());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      intro.kill();
    };
  }, [updateActive, activeIndex]);

  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Background plane */}
      <div className="hero-bg" aria-hidden="true" />

      <div className="hero-wrap">
        <div className="hero-content">
          <p className="hero-kicker">Contact sheet · Frame {activeIndex + 1} of {work.length}</p>
          <h1 id="hero-title" className="hero-name">
            {typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "GODDAMN-"
              : <span className="reveal">GODDAMN-</span>}
          </h1>
          <p className="hero-role">
            Independent designer &amp; creative developer — designed and built.
          </p>
          <Link href="/work" className="button accent">
            See work
          </Link>
        </div>
      </div>

      {/* Foreground plane — the signature film strip */}
      <div className="hero-film">
        <div className="film">
          <div className="film-track" ref={trackRef}>
            {work.map((project, i) => (
              <div
                key={project.slug}
                ref={(el) => {
                  if (el) framesRefs.current[i] = el;
                }}
                className={`film-frame ${i === activeIndex ? "current" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={`View ${project.title}`}
                onClick={() => router.push(`/case/${project.slug}`)}
              >
                <span className="badge">{String(i + 1).padStart(2, "0")}</span>
                <div className="film-plate" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
        <p className="film-hint">Scrub the strip · Click a frame</p>
      </div>
    </section>
  );
}
