import { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { team } from '@/config/site';
import { Section, SectionTitle, GlassCard, GradientHeading } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Four friends studying Digital Marketing with AI, building real projects to help small local businesses get found online",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <Section>
        <h1 className="text-3xl font-bold mb-6">About Nexlane Digital</h1>
        <Breadcrumbs items={[{name:"Home",path:"/"},{name:"About",path:"/about"}]} />
        <article className="prose max-w-none">
          <p>We are four friends studying Digital Marketing with AI. In 2026, we started Nexlane Digital to learn by building real projects for small local businesses in Kaithal, Haryana.</p>
          <p>We don&apos;t have paying clients yet, but we&apos;re working on our first projects to help businesses get found online. Our goal is to create simple, effective digital solutions that make a real difference for our clients.</p>
        </article>

        <SectionTitle>What we believe</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">Direct talk</h3>
            <p>You talk to the people doing the work</p>
          </GlassCard>
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">Written scope</h3>
            <p>We write down exactly what we&apos;ll do before we start</p>
          </GlassCard>
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">We teach what we do</h3>
            <p>We offer free lessons about what we learn</p>
          </GlassCard>
          <GlassCard className="p-4">
            <h3 className="font-semibold mb-2">Free audit</h3>
            <p>We review your website before we work with you</p>
          </GlassCard>
        </div>

        <SectionTitle>Our team</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((member) => (
            <GlassCard key={member.name} className="p-4">
              <h3 className="font-semibold mb-2">{member.name}</h3>
              <p className="text-[var(--accent)] mb-2">{member.role}</p>
              <ul className="list-disc pl-5 mb-2">
                {member.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
              {member.portfolioUrl && (
                <Link
                  href={member.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] underline"
                >
                  Portfolio
                </Link>
              )}
            </GlassCard>
          ))}
        </div>

        <GlassCard className="p-6 mt-8">
          <div className="mb-4">
            <GradientHeading>Get a Free Audit</GradientHeading>
          </div>
          <p className="mb-4">We&apos;ll review your website and give you honest recommendations</p>
          <Link href="/audit" className="btn btn-primary">
            Start your audit
          </Link>
        </GlassCard>
      </Section>
      <JsonLd data={breadcrumbSchema([{name:"Home",path:"/"},{name:"About",path:"/about"}])} />
    </>
  );
}