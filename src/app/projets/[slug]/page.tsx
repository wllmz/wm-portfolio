import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FACES } from "@/components/cube/cube-data";
import { projects, ALL_FACES } from "@/components/cube/projects-data";
import { Showcase } from "@/components/showcase";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} · William Martinez`,
    description: project.tagline,
  };
}

export default async function ProjetPage({ params }: Params) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <main className="case">
      <div className="case-inner">
        <Link href="/" className="case-back">
          ← Tous les projets
        </Link>

        <header className="case-head">
          <span className="case-num" aria-hidden="true">
            {project.num}
          </span>
          <h1>{project.title}</h1>
          <p className="case-tagline">{project.tagline}</p>

          <div className="pp-faces" aria-label="Faces couvertes">
            {ALL_FACES.filter((face) => project.faces.includes(face)).map(
              (face) => (
                <span key={face} className="pp-chip on">
                  {FACES[face].title}
                </span>
              ),
            )}
          </div>
        </header>

        <section className="case-block">
          <h2>Le contexte</h2>
          <p>{project.contexte}</p>
        </section>

        <section className="case-block">
          <h2>Ce que j&apos;ai livré</h2>
          <ul className="case-list">
            {project.livre.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="case-block">
          <h2>Côté technique</h2>
          <div className="case-stack">
            {project.stack.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </section>

        {project.shots.length > 0 && (
          // captures portrait → mockup téléphone ; paysage → mockup navigateur
          <Showcase
            title={project.title}
            subtitle={project.tagline}
            shots={project.shots}
            device={
              project.shots.every((s) => s.h > s.w) ? "phone" : "browser"
            }
          />
        )}

      </div>
    </main>
  );
}
