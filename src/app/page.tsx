import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { Label } from "@/components/Label";
import { WorkRows } from "@/components/WorkRows";
import { ProofStage } from "@/components/ProofStage";
import { Media } from "@/components/Media";
import { TransitionLink } from "@/lib/engine/Transitions";
import { about, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Nila Raghunathan · Designer and developer in Chennai",
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="stance" aria-labelledby="stance-title">
        <Label note="The working system">Stance</Label>
        <div className="stance__grid">
          <h2 className="stance__title" id="stance-title" data-wipe>
            <span className="line-mask">
              <span className="line">A small site,</span>
            </span>
            <span className="line-mask">
              <span className="line">two inks,</span>
            </span>
            <span className="line-mask">
              <span className="line">
                <em>no spare parts.</em>
              </span>
            </span>
          </h2>

          <div className="stance__aside" data-reveal>
            <p>
              Most websites are assembled from parts nobody chose: a template here, a plugin
              there, an effect because it was on a list. I start from the sheet instead. One
              grid, one type family, one accent. Everything on the page has to earn the ink it
              is printed with.
            </p>
            <dl className="stance__list">
              <div className="stance__item">
                <dt>01</dt>
                <dd>Identity, drawn to survive a stamp and a favicon</dd>
              </div>
              <div className="stance__item">
                <dt>02</dt>
                <dd>Websites designed and built by the same pair of hands</dd>
              </div>
              <div className="stance__item">
                <dt>03</dt>
                <dd>Print that matches the screen, on paper you can hold</dd>
              </div>
            </dl>
          </div>

          <div className="stance__foot" data-reveal>
            <p>
              Nine years in, the method has not changed: set it, press it, check it. The three
              passes are below.
            </p>
            <Link className="link-arrow" href="#proof-title">
              How I work <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="workblock" aria-labelledby="work-title">
        <div className="workblock__head">
          <Label>Selected work</Label>
          <p className="workblock__intro" id="work-title">
            Four projects, and the constraint that shaped each one. Case studies cover what the
            brief actually was, not just the finished screens.
          </p>
          <TransitionLink href="/work" className="link-arrow workblock__all">
            All work <span aria-hidden="true">→</span>
          </TransitionLink>
        </div>
        <WorkRows />
      </section>

      <ProofStage />

      <section className="teaser" aria-labelledby="teaser-title">
        <div className="teaser__grid">
          <div className="teaser__media" data-reveal>
            <Media
              name={about.image.src}
              alt={about.image.alt}
              width={1376}
              height={768}
              sizes="(max-width: 900px) 92vw, 40vw"
            />
          </div>
          <div className="teaser__body" data-reveal>
            <Label>About</Label>
            <h2 className="teaser__title" id="teaser-title">
              Nine years, mostly at the same bench.
            </h2>
            <p className="teaser__text">
              I learned type in a print shop in Mylapore and code in a co-working room in
              Adyar. Both habits stuck: measure twice, then ship the thing yourself. Clients are
              usually between two and thirty people, with one problem they care about more than
              the rest.
            </p>
            <dl className="facts">
              <div>
                <dt className="mono-xs">Practice</dt>
                <dd>Independent since 2019</dd>
              </div>
              <div>
                <dt className="mono-xs">Based</dt>
                <dd>Chennai, India</dd>
              </div>
              <div>
                <dt className="mono-xs">Works in</dt>
                <dd>English, Tamil</dd>
              </div>
              <div>
                <dt className="mono-xs">Studio</dt>
                <dd>One person, plus a bench</dd>
              </div>
            </dl>
            <TransitionLink href="/about" className="link-arrow">
              More about the studio <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
        </div>
      </section>
    </>
  );
}
