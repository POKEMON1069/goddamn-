import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Label } from "@/components/Label";
import { Media } from "@/components/Media";
import { TransitionLink } from "@/lib/engine/Transitions";
import { getNextProject, getProject, projects, site } from "@/data/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case not found" };

  return {
    title: project.title,
    description: project.standfirst,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} · ${site.name}`,
      description: project.standfirst,
      type: "article",
      images: [
        {
          url: `/images/${project.cover}-1440w.webp`,
          width: 1440,
          height: Math.round((1440 * Number(project.coverAspect.split(" / ")[1])) / Number(project.coverAspect.split(" / ")[0])),
          alt: project.coverAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · ${site.name}`,
      description: project.standfirst,
      images: [`/images/${project.cover}-1440w.webp`],
    },
  };
}

export default async function CasePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const next = getNextProject(project);
  const [w, h] = project.coverAspect.split(" / ").map(Number);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.standfirst,
    description: project.summary,
    dateCreated: project.year,
    url: `${site.url}/work/${project.slug}`,
    image: `${site.url}/images/${project.cover}-1440w.webp`,
    creator: { "@type": "Person", name: site.name, url: site.url },
    genre: project.sector,
  };

  return (
    <article className="case">
      <div className="case__bar">
        <TransitionLink href="/work" className="case__back">
          <span aria-hidden="true">←</span> All work
        </TransitionLink>
        <span className="mono-xs">
          Case {String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, "0")} /{" "}
          {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      <header className="case__head">
        <h1 className="case__title">{project.title}</h1>
        <p className="case__standfirst">{project.standfirst}</p>
        <dl className="case__meta">
          <div>
            <dt className="mono-xs">Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt className="mono-xs">Year</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt className="mono-xs">Sector</dt>
            <dd>{project.sector}</dd>
          </div>
          <div>
            <dt className="mono-xs">Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt className="mono-xs">Made</dt>
            <dd>{project.disciplines.join(", ")}</dd>
          </div>
        </dl>
      </header>

      <div className="case__cover" data-sheet>
        <Media
          name={project.cover}
          alt={project.coverAlt}
          width={w}
          height={h}
          sizes="(max-width: 900px) 100vw, 92vw"
          priority
        />
      </div>
      <p className="case__caption">
        <span className="mono-xs">Fig. 01</span>
        {project.accentNote}
      </p>

      <section className="case__section" aria-labelledby="brief-title">
        <div className="case__twocol">
          <Label as="h2">The brief</Label>
          <div className="body-copy" id="brief-title">
            <p>{project.brief}</p>
            <p className="case__pull">{project.summary}</p>
          </div>
        </div>
      </section>

      <section className="case__section" aria-labelledby="approach-title">
        <Label as="h2" note="What changed">
          Approach
        </Label>
        <h2 id="approach-title" className="sr-only">
          Approach
        </h2>
        <ol className="case__approach">
          {project.approach.map((step, index) => (
            <li className="case__step" key={step.title} data-reveal>
              <span className="case__step-num mono-xs">0{index + 1}</span>
              <h3 className="case__step-title">{step.title}</h3>
              <p className="case__step-body">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="case__section" aria-label="Figures">
        <div className="case__gallery">
          {project.gallery.map((image) => (
            <figure className={`case__figure ${project.gallery.length > 1 ? "case__figure--half" : ""}`} key={image.src}>
              <Media
                name={image.src}
                alt={image.alt}
                width={1408}
                height={768}
                sizes="(max-width: 900px) 92vw, 60vw"
              />
              <figcaption>{image.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="case__outcome on-ink" aria-labelledby="outcome-title">
        <div className="case__outcome-inner">
          <Label as="h2">Outcome</Label>
          <p className="case__outcome-title" id="outcome-title">
            {project.outcome}
          </p>
          <dl className="case__outcome-facts">
            {project.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="mono-xs">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <nav className="case__next" aria-label="Next project">
        <TransitionLink href={`/work/${next.slug}`} className="case__next-link">
          <span className="case__next-label mono-xs">Next sheet</span>
          <span className="case__next-title">
            {next.title}
            <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
              <path d="M5 19 19 5M8 5h11v11" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
          <span className="case__next-media">
            <Media
              name={next.cover}
              alt=""
              width={Number(next.coverAspect.split(" / ")[0])}
              height={Number(next.coverAspect.split(" / ")[1])}
              sizes="(max-width: 900px) 92vw, 30vw"
            />
          </span>
        </TransitionLink>
      </nav>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </article>
  );
}
