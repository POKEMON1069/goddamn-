import type { Metadata } from "next";
import { TransitionLink } from "@/lib/engine/Transitions";
import { Label } from "@/components/Label";
import { RegistrationMark } from "@/components/RegistrationMark";

export const metadata: Metadata = {
  title: "Misprint",
  description: "This sheet never made it to press. Head back to the work or start a project.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="miss">
      <div className="miss__row">
        <Label>Error 404</Label>
        <span className="mono-xs">Pulled from press</span>
      </div>

      <h1 className="miss__title">
        Mis<span>print</span>.
      </h1>

      <div className="miss__grid">
        <p className="miss__copy">
          A sheet went through the press with nothing set on it. That page either moved or
          never existed. Nothing is broken that a link will not fix.
        </p>
        <div className="miss__links">
          <TransitionLink href="/work" className="btn btn--ink btn--lg">
            <span className="btn__label">See the work</span>
            <span className="btn__rule" aria-hidden="true" />
          </TransitionLink>
          <TransitionLink href="/" className="link-arrow">
            Back to the first sheet <span aria-hidden="true">→</span>
          </TransitionLink>
          <TransitionLink href="/contact" className="link-arrow">
            Start a project <span aria-hidden="true">→</span>
          </TransitionLink>
          <RegistrationMark className="miss__mark" />
        </div>
      </div>
    </div>
  );
}
