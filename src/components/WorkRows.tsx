"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/data/site";
import { TransitionLink } from "@/lib/engine/Transitions";
import { gsap } from "@/lib/engine/motion";

/**
 * The work index: a typographic list where the hovered project is pulled out as
 * a floating proof on the sheet. Pointer-only feedback; every row is a full link.
 */
export function WorkRows() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const preview = previewRef.current;
    const img = imgRef.current;
    if (!wrap || !preview || !img) return;
    // Touch-only devices get no floating proof: nothing here depends on hover.
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches && navigator.maxTouchPoints > 0;
    if (coarsePointer) return;

    // Warm the previews once the page is idle so the first hover is instant.
    const warm = window.setTimeout(() => {
      projects.forEach((p) => {
        const i = new Image();
        i.src = `/images/${p.cover}-640w.webp`;
      });
    }, 1400);

    const xTo = gsap.quickTo(preview, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(preview, "y", { duration: 0.55, ease: "power3.out" });
    let visible = false;

    // Sits below the pointer so the row being read is never covered.
    const move = (event: PointerEvent) => {
      xTo(Math.min(event.clientX + 34, window.innerWidth - 340));
      yTo(event.clientY + 26);
    };

    const enter = (event: PointerEvent) => {
      const row = (event.target as HTMLElement).closest<HTMLElement>("[data-preview]");
      if (!row) return;
      const name = row.dataset.preview;
      if (!name) return;
      img.src = `/images/${name}-640w.webp`;
      img.alt = "";
      xTo(Math.min(event.clientX + 34, window.innerWidth - 340));
      yTo(event.clientY + 26);
      if (!visible) {
        visible = true;
        gsap.set(preview, { display: "block" });
        gsap.fromTo(
          preview,
          { opacity: 0, scale: 0.94, rotate: -1.4 },
          { opacity: 1, scale: 1, rotate: -0.6, duration: 0.5, ease: "power3.out" },
        );
      }
    };

    const leave = () => {
      if (!visible) return;
      visible = false;
      gsap.to(preview, {
        opacity: 0,
        scale: 0.97,
        duration: 0.35,
        ease: "power2.inOut",
        onComplete: () => gsap.set(preview, { display: "none" }),
      });
    };

    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerover", enter);
    wrap.addEventListener("pointerleave", leave);

    return () => {
      window.clearTimeout(warm);
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerover", enter);
      wrap.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="rows" ref={wrapRef}>
      <ol className="rows__list">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <TransitionLink
              href={`/work/${project.slug}`}
              className="row"
              data-preview={project.cover}
              data-reveal
            >
              <span className="row__idx mono-xs">{String(index + 1).padStart(2, "0")}</span>
              <span className="row__title">
                <span className="row__title-inner">{project.title}</span>
              </span>
              <span className="row__disc mono-xs">{project.disciplines.join("  ·  ")}</span>
              <span className="row__year mono-xs">{project.year}</span>
              <span className="row__arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d="M6 18 18 6M9 6h9v9" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </span>
            </TransitionLink>
          </li>
        ))}
      </ol>

      <div className="rows__preview" ref={previewRef} aria-hidden="true">
        <img ref={imgRef} src="/images/verdant-cover-640w.webp" alt="" width={640} height={349} />
      </div>
    </div>
  );
}
