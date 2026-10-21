import { hero, site } from "@/data/site";
import { Media } from "./Media";
import { TransitionLink } from "@/lib/engine/Transitions";

export function Hero() {
  return (
    <section className="hero" data-intro aria-labelledby="hero-title">
      <div className="hero__top">
        <p className="hero__kicker" data-nav-item>
          <span className="hero__kicker-dot" aria-hidden="true" />
          {hero.kicker}
        </p>
        <p className="hero__issue mono-xs">
          Sheet 01 <span aria-hidden="true">/</span> Proof <span aria-hidden="true">/</span> 2026
        </p>
      </div>

      <div className="hero__grid">
        <div className="hero__type">
          <h1 className="hero__title" id="hero-title">
            <span className="line-mask">
              <span className="line">{hero.lines[0]}</span>
            </span>
            <span className="line-mask">
              <span className="line">{hero.lines[1]}</span>
            </span>
            <span className="line-mask">
              <span className="line hero__title-ghost">Then look again.</span>
            </span>
          </h1>

          <div className="hero__lower">
            <p className="hero__lede" data-fade>
              {hero.lede}
            </p>

            <div className="hero__actions" data-fade>
              <TransitionLink href={hero.primary.href} className="btn btn--ink btn--lg">
                <span className="btn__label">{hero.primary.label}</span>
                <span className="btn__rule" aria-hidden="true" />
              </TransitionLink>
              <a className="link-inline" href={`mailto:${site.email}?subject=Project%20enquiry`}>
                {hero.secondary.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            </div>
          </div>
        </div>

        <figure className="hero__figure" data-sheet>
          <Media
            name={hero.image.src}
            alt={hero.image.alt}
            width={928}
            height={1152}
            priority
            sizes="(max-width: 900px) 92vw, 40vw"
            className="hero__media"
          />
          <figcaption className="hero__caption" data-fade>
            <span className="mono-xs">Fig. 01</span>
            {hero.image.caption}
          </figcaption>
        </figure>
      </div>

      <dl className="hero__meta" data-fade>
        {hero.meta.map((item) => (
          <div className="hero__meta-item" key={item.label}>
            <dt className="mono-xs">{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
        <div className="hero__meta-item hero__meta-item--note">
          <dt className="mono-xs">Note</dt>
          <dd>Still life shot for this site, not client work.</dd>
        </div>
      </dl>
    </section>
  );
}
