import type { Metadata } from "next";
import { Label } from "@/components/Label";
import { Media } from "@/components/Media";
import { RegistrationMark } from "@/components/RegistrationMark";
import { TransitionLink } from "@/lib/engine/Transitions";
import { about, faq, site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Nila Raghunathan is an independent designer and developer in Chennai. Nine years of setting type and shipping code, one project at a time, with the proof to show for it.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${site.name}`,
    description:
      "Nine years of setting type and shipping code in Chennai. How the studio works, what it takes on, and the questions clients ask first.",
    images: ["/og.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <header className="page-head">
        <div className="page-head__grid">
          <Label note="One person, plus a bench">About</Label>
          <h1 className="page-head__title">Set it well. Press it once. Check it twice.</h1>
          <div className="page-head__aside">
            <p>
              Independent since 2019. Before that, a print shop in Mylapore and a product team in
              Adyar, which is where the habit came from.
            </p>
          </div>
        </div>
      </header>

      <div className="about__body">
        <div className="about__copy">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p>
            <TransitionLink href="/contact" className="link-arrow">
              Start a conversation <span aria-hidden="true">→</span>
            </TransitionLink>
          </p>
        </div>

        <div className="about__side" data-reveal>
          <dl className="about__facts">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="mono-xs">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="about__image" data-reveal>
        <Media
          name={about.image.src}
          alt={about.image.alt}
          width={1376}
          height={768}
          sizes="(max-width: 900px) 100vw, 92vw"
          ratio="21 / 9"
        />
      </div>

      <section className="about__services" aria-labelledby="services-title">
        <Label note="Three, not thirty">What I take on</Label>
        <h2 id="services-title" className="sr-only">
          Services
        </h2>
        <div className="services">
          {about.services.map((service, index) => (
            <div className="service" key={service.title}>
              <span className="service__num mono-xs">0{index + 1}</span>
              <h3 className="service__title">{service.title}</h3>
              <p className="service__body">{service.body}</p>
              <RegistrationMark className="service__mark" />
            </div>
          ))}
        </div>
      </section>

      <section className="process" aria-labelledby="process-title">
        <Label note="From first call to handover">How a project runs</Label>
        <h2 id="process-title" className="sr-only">
          Process
        </h2>
        <dl className="process__grid">
          {about.process.map((step) => (
            <div className="process__step" key={step.label}>
              <dt className="mono-xs">{step.label}</dt>
              <dd>{step.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="faq" aria-labelledby="faq-title">
        <div className="faq__grid">
          <div className="faq__head">
            <Label>Questions</Label>
            <h2 id="faq-title">The four I get asked most.</h2>
          </div>
          <div className="faq__list">
            {faq.map((item) => (
              <details className="faq__item" key={item.q}>
                <summary className="faq__q">
                  {item.q}
                  <span className="faq__icon" aria-hidden="true" />
                </summary>
                <p className="faq__a">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
