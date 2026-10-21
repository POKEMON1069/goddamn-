"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { RegistrationMark } from "./RegistrationMark";
import { TransitionLink, useTransition } from "@/lib/engine/Transitions";
import { nav, projects, site } from "@/data/site";
import { gsap, ease, prefersReducedMotion } from "@/lib/engine/motion";
import { getLenis } from "@/lib/engine/SmoothScroll";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { navigate } = useTransition();

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";

    if (menu && !prefersReducedMotion()) {
      gsap.fromTo(
        menu.querySelectorAll("[data-menu-item]"),
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.055, ease: ease.paper, delay: 0.05 },
      );
    }
    menu?.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      if (event.key !== "Tab" || !menu) return;
      const stops = Array.from(
        menu.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      );
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${open ? "nav--on-menu" : ""}`} data-nav>
        <div className="nav__inner">
          <TransitionLink href="/" className="nav__brand">
            <span className="nav__mark" data-nav-item>
              <RegistrationMark />
            </span>
            <span className="nav__names" data-nav-item>
              <span className="nav__name">{site.name}</span>
              <span className="nav__role">Designer and developer</span>
            </span>
          </TransitionLink>

          <nav className="nav__links" aria-label="Primary">
            {nav.map((item) => (
              <span className="nav__link-wrap" data-nav-item key={item.href}>
                <TransitionLink
                  href={item.href}
                  className="nav__link"
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  <span className="nav__link-idx" aria-hidden="true">
                    {item.index}
                  </span>
                  {item.label}
                  <span className="nav__link-dot" aria-hidden="true" />
                </TransitionLink>
              </span>
            ))}
          </nav>

          <div className="nav__end" data-nav-item>
            <TransitionLink href="/contact" className="btn btn--ink nav__cta">
              <span className="btn__label">Start a project</span>
              <span className="btn__rule" aria-hidden="true" />
            </TransitionLink>
            <button
              type="button"
              className="nav__burger"
              ref={buttonRef}
              aria-expanded={open}
              aria-controls="index-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="nav__burger-label">{open ? "Close" : "Index"}</span>
              <span className={`nav__burger-lines ${open ? "is-open" : ""}`} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open ? (
        <div className="menu" id="index-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Index">
          <div className="menu__inner">
            <nav aria-label="Index">
              <ul className="menu__list">
                {nav.map((item) => (
                  <li key={item.href} data-menu-item>
                    <a
                      href={item.href}
                      className="menu__link"
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        setOpen(false);
                        navigate(item.href);
                      }}
                    >
                      <span className="menu__idx" aria-hidden="true">
                        {item.index}
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="menu__work" data-menu-item>
              <p className="mono-xs menu__work-title">Selected work</p>
              <ul className="menu__work-list">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <a
                      href={`/work/${project.slug}`}
                      className="menu__work-link"
                      onClick={(event) => {
                        event.preventDefault();
                        setOpen(false);
                        navigate(`/work/${project.slug}`);
                      }}
                    >
                      <span>{project.title}</span>
                      <span className="mono-xs">{project.year}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="menu__foot" data-menu-item>
              <a className="menu__mail" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <p className="mono-xs">{site.availability}</p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
