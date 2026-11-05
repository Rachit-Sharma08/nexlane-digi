import { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { practiceProjects, clientWork } from '@/content/projects';
import { Section, SectionTitle, GlassCard } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';

export const metadata: Metadata = buildMetadata({
  title: "Portfolio — practice and learning work",
  description: "Our practice and learning projects built by team members",
  path: "/portfolio"
});

export default function PortfolioPage() {
  return (
    <>
      <Section>
        <h1 className="text-3xl font-bold mb-6">Our work</h1>
        <Breadcrumbs items={[{name:"Home",path:"/"},{name:"Portfolio",path:"/portfolio"}]} />
        <article className="prose max-w-none">
          <p>We are a young team, and what follows are practice and learning projects built by team members. Client work will be listed here only with the client&apos;s written permission.</p>
        </article>

        {/* hidden until real clients + written permission exist */}
        {clientWork.length > 0 && (
          <>
            <SectionTitle>Client work</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientWork.map((project) => (
                <GlassCard key={project.title} className="p-4">
                  <h3 className="font-semibold mb-2">{project.title}</h3>
                  <p className="mb-2">{project.whatItIs}</p>
                  <p className="text-[var(--accent)] mb-2">Built by {project.role} · client project</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="text-xs border border-[var(--card-border)] px-2 py-1 rounded-full text-[var(--muted)]">{tech}</span>
                    ))}
                  </div>
                  {project.liveUrl ? (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] underline mr-4"
                    >
                      Live site ↗
                    </Link>
                  ) : (
                    <span className="text-[var(--muted)]">Live link coming soon</span>
                  )}
                  {project.repoUrl && (
                    <Link
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--accent)] underline"
                    >
                      GitHub ↗
                    </Link>
                  )}
                </GlassCard>
              ))}
            </div>
          </>
        )}

        <SectionTitle>Practice and learning projects</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {practiceProjects.map((project) => (
            <GlassCard key={project.title} className="p-4">
              <h3 className="font-semibold mb-2">{project.title}</h3>
              {project.status === "flagged" && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs border border-[var(--muted)] px-2 py-1 rounded-full">pending permission</span>
                  <p className="text-xs text-[var(--muted)]">published only with the school&apos;s written permission</p>
                </div>
              )}
              <p className="mb-2">{project.whatItIs}</p>
              <p className="text-[var(--accent)] mb-2">Built by {project.role} · practice project</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="text-xs bg-[var(--muted)] px-2 py-1 rounded-full">{tech}</span>
                ))}
              </div>
              {project.liveUrl ? (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline mr-4"
                >
                  Live site ↗
                </Link>
              ) : (
                <span className="text-[var(--muted)]">Live link coming soon</span>
              )}
              {project.repoUrl && (
                <Link
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline"
                >
                  GitHub ↗
                </Link>
              )}
            </GlassCard>
          ))}
        </div>

        <p className="mt-8">
          Want to see something specific? <Link href="/contact" className="text-[var(--accent)] underline">Ask us</Link>.
        </p>
      </Section>
      <JsonLd data={breadcrumbSchema([{name:"Home",path:"/"},{name:"Portfolio",path:"/portfolio"}])} />
    </>
  );
}