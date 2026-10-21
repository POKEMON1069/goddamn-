import type { Metadata } from "next";
import { Label } from "@/components/Label";
import { ContactForm } from "@/components/ContactForm";
import { Clock } from "@/components/Clock";
import { contact, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Nila Raghunathan: what you are making, who it is for, and when you need it. Usually answered within two working days.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${site.name}`,
    description: contact.lede,
    images: ["/og.jpg"],
  },
};

export default function ContactPage() {
  return (
    <div className="contact">
      <div className="contact__head">
        <Label note="Two projects open">Contact</Label>
        <h1 className="contact__title">{contact.heading}</h1>
        <p className="contact__lede">{contact.lede}</p>
      </div>

      <div className="contact__form">
        <ContactForm />
      </div>

      <aside className="contact__aside" aria-label="Studio details">
        <dl className="contact__details">
          {contact.details.map((detail) => (
            <div key={detail.label}>
              <dt className="mono-xs">{detail.label}</dt>
              <dd>
                {detail.href ? (
                  <a href={detail.href}>{detail.value}</a>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
          <div>
            <dt className="mono-xs">Local time</dt>
            <dd>
              <Clock timeZone={site.timeZone} label="Chennai" />
            </dd>
          </div>
        </dl>

        <div className="contact__note">
          <strong>No brief yet?</strong>
          Write two sentences about the problem and one about the deadline. That is enough to
          tell whether I am the right person, and I will say so either way.
        </div>

        <div className="contact__note">
          <strong>This is a template</strong>
          {site.disclosure} The form validates and confirms, but it has no server attached.
        </div>
      </aside>
    </div>
  );
}
