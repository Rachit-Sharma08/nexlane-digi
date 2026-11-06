import JsonLd from '@/components/JsonLd';
import { Section, SectionTitle, GlassCard, Muted, Eyebrow } from '@/components/ui';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Terms', path: '/terms' },
];

export const metadata = buildMetadata({
  title: 'Terms of service',
  description: 'Terms that apply to using the Nexlane Digital website and our services.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <Section>
      <Eyebrow>Terms</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Terms of service</h1>
      <Muted>Last updated: TODO — set a real date before publishing.</Muted>

      <SectionTitle>Scope</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          These terms apply to the Nexlane Digital website and to any work we do for you. We are a small agency based in
          Kaithal, Haryana, India. Nothing here is legal advice; have a qualified professional review it before relying on
          it.
        </p>
      </GlassCard>

      <SectionTitle>Quotes and scope of work</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          Every project starts with a written scope and a fixed quote agreed in writing. We do not start work without that.
          Changes to scope after work has started are quoted separately.
        </p>
      </GlassCard>

      <SectionTitle>Payments</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          Payment terms are agreed in writing per project. We do not take payment for work we have not scoped.
        </p>
      </GlassCard>

      <SectionTitle>Intellectual property</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          After full payment, you own the deliverables we built for you. We may reuse generic techniques, templates and
          learnings, but not your content, brand or data.
        </p>
      </GlassCard>

      <SectionTitle>Limitations</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          We do not guarantee rankings, traffic numbers or sales. SEO and marketing results depend on many factors outside
          our control, including your market, competitors and how you run your business.
        </p>
      </GlassCard>

      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}
