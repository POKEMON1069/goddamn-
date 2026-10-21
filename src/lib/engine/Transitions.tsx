"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";
import { RegistrationMark } from "@/components/RegistrationMark";
import { gsap, ScrollTrigger, ease, duration, prefersReducedMotion } from "./motion";
import { getLenis, resetScroll } from "./SmoothScroll";

type Ctx = { navigate: (href: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });

export const useTransition = () => useContext(TransitionContext);

const isPlainInternal = (href: string) =>
  href.startsWith("/") &&
  !href.startsWith("//") &&
  !href.startsWith("/api") &&
  !href.startsWith("/_next");

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const busy = useRef(false);
  const firstRender = useRef(true);
  const [announcement, setAnnouncement] = useState("");

  const navigate = useCallback(
    (href: string) => {
      if (!isPlainInternal(href)) {
        window.location.href = href;
        return;
      }
      const [path] = href.split("#");
      if (path === pathname || busy.current) return;

      if (prefersReducedMotion()) {
        resetScroll();
        router.push(href);
        return;
      }

      const root = rootRef.current;
      const sheet = sheetRef.current;
      if (!root || !sheet) {
        router.push(href);
        return;
      }

      busy.current = true;
      getLenis()?.stop();
      gsap.killTweensOf([sheet, root.querySelectorAll("[data-curtain-fade]")]);
      gsap.set(root, { display: "block" });
      gsap.set(sheet, { yPercent: -101, rotate: -1.15 });

      const tl = gsap.timeline({
        onComplete: () => router.push(href),
      });
      tl.fromTo(
        root.querySelectorAll("[data-curtain-fade]"),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: ease.out },
        0.3,
      ).to(
        sheet,
        { yPercent: 0, rotate: 0.35, duration: duration.page, ease: ease.lift },
        0,
      );
    },
    [pathname, router],
  );

  // The new route is committed: reset scroll behind the sheet, then lift it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
      return () => cancelAnimationFrame(raf);
    }

    if (!busy.current) {
      // Back/forward navigation without our curtain.
      ScrollTrigger.refresh();
      return;
    }

    const root = rootRef.current;
    const sheet = sheetRef.current;
    if (!root || !sheet) {
      busy.current = false;
      getLenis()?.start();
      return;
    }

    resetScroll();

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        const tl = gsap.timeline({
          onComplete: () => {
            busy.current = false;
            gsap.set(root, { display: "none" });
            getLenis()?.start();
            setAnnouncement(document.title);
          },
        });
        tl.to(sheet, { yPercent: -101, rotate: -0.55, duration: duration.lift, ease: ease.lift }, 0.05).to(
          root.querySelectorAll("[data-curtain-fade]"),
          { opacity: 0, duration: 0.25, ease: "none" },
          0,
        );
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      <div className="curtain" ref={rootRef} aria-hidden="true">
        <div className="curtain__sheet" ref={sheetRef}>
          <div className="curtain__row" data-curtain-fade>
            <span className="mono-xs">Working proof</span>
            <span className="mono-xs">N. Raghunathan</span>
          </div>
          <div className="curtain__mark" data-curtain-fade>
            <RegistrationMark />
          </div>
          <div className="curtain__row curtain__row--foot" data-curtain-fade>
            <span className="mono-xs">Chennai, IN</span>
            <span className="mono-xs">Next sheet</span>
          </div>
        </div>
      </div>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const { navigate } = useTransition();

  return (
    <Link
      href={href}
      prefetch
      {...rest}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (!isPlainInternal(href)) return;
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
}
