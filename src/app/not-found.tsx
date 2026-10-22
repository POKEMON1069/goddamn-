import Link from "next/link";

export const metadata = {
  title: "Not found — GODDAMN-",
};

export default function NotFound() {
  return (
    <section className="not-found" aria-label="Page not found">
      <h1>404</h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-muted)", margin: "16px 0 32px" }}>
        This frame is not in the contact sheet.
      </p>
      <Link href="/" className="button accent">
        Return to work
      </Link>
    </section>
  );
}
