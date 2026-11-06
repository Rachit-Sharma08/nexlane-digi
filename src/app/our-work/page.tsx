import { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { Section, SectionTitle, GlassCard, Muted } from '@/components/ui';

export const metadata: Metadata = buildMetadata({
  title: "Our Work",
  description: "Nexlane is new — our first client projects will be listed here, with each client's permission.",
  path: "/our-work"
});

export default function OurWorkPage() {
  return (
    <>
      <Section>
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">Our Work</p>
        <h1 className="text-3xl font-bold mb-6">Our Work</h1>
        <Muted>
          Nexlane is new, and we have not delivered client projects yet. We would rather show you nothing than
          something made up. Our first client projects will be listed here, with each client&apos;s permission.
        </Muted>

        <SectionTitle>While you wait</SectionTitle>
        <div className="grid gap-5 md:grid-cols-2">
          <GlassCard>
            <h2 className="font-display text-lg font-semibold">See what our founders build on their own</h2>
            <Muted>
              Websites, games and AI tools Rachit and Krish build in their own time.
            </Muted>
            <p className="mt-2 text-xs text-[var(--muted)]">Personal projects, not Nexlane client work</p>
            <Link href="/about/founders" className="mt-4 inline-block text-sm font-semibold text-[var(--accent-2)] hover:text-white">
              Founders →
            </Link>
          </GlassCard>
          <GlassCard>
            <h2 className="font-display text-lg font-semibold">See what our team members build on their own</h2>
            <Muted>
              Websites and small tools Neelam builds in her own time.
            </Muted>
            <p className="mt-2 text-xs text-[var(--muted)]">Personal projects, not Nexlane client work</p>
            <Link href="/about/team" className="mt-4 inline-block text-sm font-semibold text-[var(--accent-2)] hover:text-white">
              Team →
            </Link>
          </GlassCard>
        </div>

        <SectionTitle>Be one of our first clients</SectionTitle>
        <GlassCard>
          <p className="mb-4 text-[var(--muted)]">
            We&apos;re taking on our first few local businesses now — send us one link and we&apos;ll show you
            what we&apos;d improve, for free.
          </p>
          <Link href="/audit" className="btn btn-primary">
            Get a Free Audit
          </Link>
        </GlassCard>
      </Section>
    </>
  );
}
