import type { Project } from "@/data/site";
import { Media } from "./Media";
import { TransitionLink } from "@/lib/engine/Transitions";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [w, h] = project.coverAspect.split(" / ").map(Number);

  return (
    <article
      className={`pcard ${index % 2 === 1 ? "pcard--flip" : ""}`}
      data-reveal
      aria-labelledby={`pcard-${project.slug}`}
    >
      <TransitionLink href={`/work/${project.slug}`} className="pcard__media">
        <Media
          name={project.cover}
          alt={project.coverAlt}
          width={w}
          height={h}
          sizes="(max-width: 900px) 92vw, 56vw"
          className="pcard__img"
          priority={index === 0}
        />
        <span className="pcard__stamp mono-xs" aria-hidden="true">
          {project.year}
        </span>
      </TransitionLink>

      <div className="pcard__body">
        <p className="pcard__meta mono-xs">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{project.sector}</span>
        </p>
        <h2 className="pcard__title" id={`pcard-${project.slug}`}>
          <TransitionLink href={`/work/${project.slug}`} className="pcard__link">
            {project.title}
          </TransitionLink>
        </h2>
        <p className="pcard__text">{project.standfirst}</p>
        <dl className="pcard__facts">
          {project.facts.slice(0, 2).map((fact) => (
            <div key={fact.label}>
              <dt className="mono-xs">{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <TransitionLink href={`/work/${project.slug}`} className="link-arrow">
          Read the case
          <span aria-hidden="true"> →</span>
        </TransitionLink>
      </div>
    </article>
  );
}
