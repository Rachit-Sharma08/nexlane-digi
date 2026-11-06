import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { GlassCard, Section, Eyebrow } from '@/components/ui';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Learn', path: '/learn' },
];

export const metadata = buildMetadata({
  title: 'Learn digital marketing — free',
  description: 'Free lessons, guides and tool lists — the same stuff we use ourselves.',
  path: '/learn',
});

export default function LearnPage() {
  return (
    <Section>
      <Eyebrow>Learn</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Learn with us — free</h1>
      <p className="text-[var(--muted)] mb-8">
        Everything here is free, and it&apos;s the same stuff we use ourselves.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <h2 className="font-display text-xl font-semibold mb-2">
            <Link href="/learn/youtube" className="hover:text-[var(--accent-2)]">
              YouTube lessons
            </Link>
          </h2>
          <p className="text-[var(--muted)]">Free video lessons on digital marketing and free AI tools</p>
        </GlassCard>
        <GlassCard>
          <h2 className="font-display text-xl font-semibold mb-2">
            <Link href="/learn/blog" className="hover:text-[var(--accent-2)]">
              Blog
            </Link>
          </h2>
          <p className="text-[var(--muted)]">In-depth guides and case studies</p>
        </GlassCard>
        <GlassCard>
          <h2 className="font-display text-xl font-semibold mb-2">
            <Link href="/learn/resources" className="hover:text-[var(--accent-2)]">
              Free resources
            </Link>
          </h2>
          <p className="text-[var(--muted)]">Curated list of free tools and services</p>
        </GlassCard>
      </div>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}
