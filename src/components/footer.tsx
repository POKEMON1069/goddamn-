import Link from "next/link";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-colophon">
        {site.name}<br />
        Independent designer &amp; creative developer.{" "}
        {site.location.placeholder ? "Location is a placeholder." : ""}
        <br />
        Images marked placeholder are to be replaced by the owner.
      </div>
      <ul className="footer-links">
        {site.social.map((s) => (
          <li key={s.name}>
            <Link href={s.url} target="_blank" rel="noopener noreferrer">
              {s.name}
            </Link>
          </li>
        ))}
        <li>
          <Link href={`mailto:${site.email.value}`}>Contact</Link>
        </li>
      </ul>
    </footer>
  );
}
