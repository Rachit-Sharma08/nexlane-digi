import { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { Section, SectionTitle, GradientHeading, Muted, Eyebrow, Container } from '@/components/ui';
import DepthCard from '@/components/DepthCard';
import NextUp from '@/components/NextUp';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  title: "About Nexlane Digital | Our Story from Kaithal, Haryana",
  description:
    "Four friends in Kaithal started Nexlane Digital in 2026 to build real digital projects for businesses and teach what we learn. Read our honest story.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <>
      <Section>
        <Eyebrow>About</Eyebrow>
        <h1 className="text-3xl font-bold mb-6 text-[var(--text)]">About Nexlane Digital</h1>
        <article className="prose max-w-none text-[var(--muted)]">
          <p>We are four friends who started Nexlane Digital in 2026 to learn by building real projects for small local businesses in Kaithal, Haryana.</p>
          <p>We don&apos;t have paying clients yet, but we&apos;re working on our first projects to help businesses get found online. Our goal is to create simple, effective digital solutions that make a real difference for our clients.</p>
        </article>

        <SectionTitle>Why we started Nexlane</SectionTitle>
        <Muted>
          We were learning digital marketing, web development and AI tools together and kept running into the same problem:
          small local businesses in our city either had no website, or one nobody could find. We started Nexlane to fix that
          for real clients — and to publish what we learn so others can too.
        </Muted>

        <SectionTitle>Who you&apos;ll work with</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          <DepthCard className="p-6">
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">Meet the founders</h2>
            <Muted>
              Rachit and Krish lead SEO, growth, web development and AI — the two people you&apos;ll talk to first.
            </Muted>
            <Link href="/about/founders" className="mt-4 inline-block text-sm font-semibold text-[var(--accent-2)] hover:text-[var(--text)]">
              Founders →
            </Link>
          </DepthCard>
          <DepthCard className="p-6">
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">Meet the team</h2>
            <Muted>
              Neelam and Jyoti build websites, handle social and video, and keep the work moving.
            </Muted>
            <Link href="/about/team" className="mt-4 inline-block text-sm font-semibold text-[var(--accent-2)] hover:text-[var(--text)]">
              Team →
            </Link>
          </DepthCard>
        </div>

        <SectionTitle>What we believe</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DepthCard className="p-4">
            <h3 className="font-semibold mb-2 text-[var(--text)]">Direct talk</h3>
            <p className="text-[var(--muted)]">You talk to the people doing the work</p>
          </DepthCard>
          <DepthCard className="p-4">
            <h3 className="font-semibold mb-2 text-[var(--text)]">Written scope</h3>
            <p className="text-[var(--muted)]">We write down exactly what we&apos;ll do before we start</p>
          </DepthCard>
          <DepthCard className="p-4">
            <h3 className="font-semibold mb-2 text-[var(--text)]">We teach what we do</h3>
            <p className="text-[var(--muted)]">We offer free lessons about what we learn</p>
          </DepthCard>
          <DepthCard className="p-4">
            <h3 className="font-semibold mb-2 text-[var(--text)]">Free audit</h3>
            <p className="text-[var(--muted)]">We review your website before we work with you</p>
          </DepthCard>
        </div>

        <DepthCard className="p-6 mt-8">
          <div className="mb-4">
            <GradientHeading>Get a Free Audit</GradientHeading>
          </div>
          <p className="mb-4 text-[var(--muted)]">We&apos;ll review your website and give you honest recommendations</p>
          <Link href="/audit" className="btn btn-primary">
            Start your audit
          </Link>
        </DepthCard>
      </Section>
      <JsonLd data={breadcrumbSchema([{name:"Home",path:"/"},{name:"About",path:"/about"}])} />
      <Container>
        <NextUp title="Meet the people behind Nexlane" href="/about/founders" cta="Meet the founders" eyebrow="Keep going" />
      </Container>
    </>
  );
}