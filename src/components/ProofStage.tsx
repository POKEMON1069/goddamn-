"use client";

import { useEffect, useRef, useState } from "react";
import { principles } from "@/data/site";
import { Media } from "./Media";
import { Label } from "./Label";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/engine/motion";

/**
 * The signature section: three chapters read on the left while one sheet stays
 * pinned in the press on the right. A single clock drives it: scroll progress
 * through the chapters sets which proof is in the press, and the red pull rule.
 */
export function ProofStage() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const ruleRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const chapters = gsap.utils.toArray<HTMLElement>(".proof__chapter");
      chapters.forEach((chapter, index) => {
        ScrollTrigger.create({
          trigger: chapter,
          start: "top 62%",
          end: "bottom 52%",
          onToggle: (self) => {
            if (self.isActive) setActive(index);
          },
        });
      });

      if (ruleRef.current) {
        gsap.fromTo(
          ruleRef.current,
          { scaleY: 0.04 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top 70%",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="proof" aria-labelledby="proof-title">
      <div className="proof__head">
        <Label note="Three chapters">{principles.label}</Label>
        <h2 className="proof__title" id="proof-title">
          {principles.heading}
        </h2>
        <p className="proof__intro">{principles.intro}</p>
      </div>

      <div className="proof__track" ref={trackRef}>
        <span className="proof__rule" aria-hidden="true" ref={ruleRef} />

        <ol className="proof__chapters">
          {principles.chapters.map((chapter, index) => (
            <li
              className={`proof__chapter ${active === index ? "is-active" : ""}`}
              key={chapter.mark}
              data-reveal
            >
              <div className="proof__mark">
                <span className="proof__mark-word mono-xs">{chapter.mark}</span>
                <span className="proof__mark-num mono-xs" aria-hidden="true">
                  0{index + 1}
                </span>
              </div>
              <div className="proof__chapter-copy">
                <h3 className="proof__chapter-title">{chapter.title}</h3>
                <p className="proof__chapter-body">{chapter.body}</p>
                <p className="proof__note mono-xs">{chapter.note}</p>
              </div>

              <div className="proof__chapter-media">
                <Media
                  name={principles.images[index].src}
                  alt={principles.images[index].alt}
                  width={1408}
                  height={768}
                  sizes="92vw"
                />
              </div>
            </li>
          ))}
        </ol>

        <div className="proof__stage" aria-hidden="true">
          <div className="proof__sheet">
            {principles.images.map((image, index) => (
              <span
                className={`proof__plate ${active === index ? "is-on" : ""}`}
                key={image.src}
              >
                <Media name={image.src} alt="" width={1408} height={768} sizes="38vw" />
              </span>
            ))}
            <span className="proof__grain" />
            <span className="proof__stamp mono-xs">Proof 0{active + 1}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
