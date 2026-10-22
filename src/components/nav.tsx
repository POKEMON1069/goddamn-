"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Work" },
    { href: "/about", label: "About" },
    { href: "mailto:hello@example.com", label: "Contact", external: true },
  ];

  return (
    <nav className="nav" aria-label="Primary navigation">
      <a href="/" className="brand" aria-label="Home">
        GOD<b>DAMN</b>-<span className="nav-dot">·</span>
      </a>
      <ul className="nav-list">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              prefetch={!l.external}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
