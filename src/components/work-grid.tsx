import Link from "next/link";
import Image from "next/image";
import { work } from "@/data/site";

export default function WorkGrid({ featuredOnly = false }: { featuredOnly?: boolean } = {}) {
  const items = featuredOnly ? work.filter((w) => w.featured) : work;

  return (
    <section className="section" aria-labelledby="work-heading">
      <div className="section-inner">
        <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 48, gap: 20 }}>
          <div>
            <h2 id="work-heading" className="section-title">
              {featuredOnly ? "Selected work" : "All work"}
            </h2>
            <p className="section-deck">
              Frames from the contact sheet. {work.filter((w) => w.fictional).length} of {work.length}
              shown here are placeholder projects awaiting real work.
            </p>
          </div>
          {!featuredOnly && (
            <Link href="/work" className="button">
              View all
            </Link>
          )}
        </div>
        <div className="work-grid">
          {items.map((project) => (
            <Link
              key={project.slug}
              href={`/case/${project.slug}`}
              className="card"
              aria-label={project.title}
            >
              <div className="card-media">
                <Image
                  src={project.image}
                  alt={project.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={project.featured}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                />
                <span className="card-kicker">{project.kicker}</span>
              </div>
              <div className="card-body">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
