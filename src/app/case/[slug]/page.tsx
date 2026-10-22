import { notFound } from "next/navigation";
import Image from "next/image";
import { work } from "@/data/site";

export const generateStaticParams = () =>
  work.map((p) => ({ slug: p.slug }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const project = work.find((p) => p.slug === params.slug);
  if (!project) return { title: "Case study" };
  return {
    title: `${project.title} — Case study · GODDAMN-`,
    description: project.summary,
  };
};

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const project = work.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <>
      <section className="case-hero" aria-labelledby="case-title">
        <div className="section-inner">
          <span className="badge">{project.kicker}</span>
          <h1 id="case-title">{project.title}</h1>
        </div>
        <div className="case-media">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            sizes="100vw"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          />
        </div>
      </section>

      <section className="section" aria-labelledby="case-summary">
        <div className="section-inner">
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <h2 id="case-summary" style={{ fontSize: "1.4rem", marginBottom: 16 }}>
              {project.summary}
            </h2>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.7, color: "var(--color-muted)" }}>
              {project.summary.replace(".", ". ")} This case study is a
              placeholder awaiting your real project copy, images, and credits.
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {project.fictional ? "Fictional placeholder — replace with real work." : "Real project."}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
