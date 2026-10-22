import Link from "next/link";
import { site } from "@/data/site";

export const metadata = {
  title: "About — GODDAMN-",
  description: "About the designer & creative developer behind GODDAMN-.",
};

export default function About() {
  return (
    <section className="section content" aria-labelledby="about-heading">
      <div className="section-inner">
        <div style={{ maxWidth: 640 }}>
          <h2 id="about-heading">About</h2>
          <p className="hero-role" style={{ fontSize: "1.1rem", marginTop: 12 }}>
            {site.ownerName.value} is an independent designer &amp; creative
            developer.
          </p>
          <p>{site.about.intro}</p>
          {site.about.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {site.location.placeholder && (
            <p style={{ fontSize: "13px", color: "var(--color-muted)" }}>
              Location: {site.location.value} (placeholder)
            </p>
          )}
          <div style={{ marginTop: 48 }}>
            <Link href={`mailto:${site.email.value}`} className="button accent">
              Say hello
            </Link>
          </div>
          {site.ownerName.placeholder && (
            <p style={{ marginTop: 20, fontSize: "13px", color: "var(--color-muted)" }}>
              Note: name, bio, email and location are placeholders — replace
              with your own before shipping.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
