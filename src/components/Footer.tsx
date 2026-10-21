import { site, nav } from "@/data/site";
import { TransitionLink } from "@/lib/engine/Transitions";
import { RegistrationMark } from "./RegistrationMark";
import { Clock } from "./Clock";

export function Footer() {
  return (
    <footer className="foot" data-reveal>
      <div className="foot__top">
        <p className="label">
          <span className="label__rule" aria-hidden="true" />
          Next sheet
        </p>
        <div className="foot__cta">
          <h2 className="foot__title">
            Have something
            <br />
            worth printing?
          </h2>
          <div className="foot__actions">
            <TransitionLink href="/contact" className="btn btn--paper btn--lg">
              <span className="btn__label">Start a project</span>
              <span className="btn__rule" aria-hidden="true" />
            </TransitionLink>
            <a className="link-inline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </div>
        </div>
      </div>

      <div className="foot__cols">
        <div className="foot__col">
          <h3 className="mono-xs foot__col-title">Index</h3>
          <ul>
            <li>
              <TransitionLink href="/" className="foot__link">
                Home
              </TransitionLink>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} className="foot__link">
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot__col">
          <h3 className="mono-xs foot__col-title">Elsewhere</h3>
          <ul>
            {site.social.map((s) => (
              <li key={s.label}>
                <a className="foot__link" href={s.href} rel="me noopener noreferrer" target="_blank">
                  {s.label}
                  <span className="foot__handle">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot__col">
          <h3 className="mono-xs foot__col-title">Studio</h3>
          <p className="foot__text">
            {site.city}
            <br />
            Working remote, two hours overlap with Europe.
          </p>
          <p className="foot__text foot__text--muted">
            <Clock timeZone={site.timeZone} label="Local" />
          </p>
        </div>
        <div className="foot__col foot__col--mark">
          <RegistrationMark className="foot__mark" />
          <p className="foot__text foot__text--muted">{site.colophon}</p>
        </div>
      </div>

      <div className="foot__base">
        <p className="mono-xs">© {new Date().getFullYear()} {site.name}. Set in Chennai.</p>
        <p className="mono-xs foot__disclosure">{site.disclosure}</p>
        <a className="mono-xs foot__top-link" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </footer>
  );
}
