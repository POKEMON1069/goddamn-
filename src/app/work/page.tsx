import type { Metadata } from "next";
import { Label } from "@/components/Label";
import { ProjectCard } from "@/components/ProjectCard";
import { projects, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Four projects: a seed library catalogue, a bookkeeping product, an archive of late-night radio and a pottery studio. Design, front end and print by Nila Raghunathan.",
  alternates: { canonical: "/work" },
};

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work",
  url: `${site.url}/work`,
  hasPart: projects.map((p) => ({
    "@type": "CreativeWork",
    name: p.title,
    url: `${site.url}/work/${p.slug}`,
    description: p.standfirst,
    dateCreated: p.year,
  })),
};

export default function WorkPage() {
  return (
    <>
      <header className="page-head">
        <div className="page-head__grid">
          <Label note="2023 to 2025">Work</Label>
          <h1 className="page-head__title">Four projects, and the constraint behind each.</h1>
          <div className="page-head__aside">
            <p>
              Each case covers the brief, what I changed, and what happened after launch.
              Placeholder projects for a portfolio template: names, numbers and clients are
              invented.
            </p>
          </div>
        </div>
      </header>

      <div className="worklist">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.slug} />
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </>
  );
}
