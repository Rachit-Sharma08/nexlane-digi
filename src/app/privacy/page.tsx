import JsonLd from '@/components/JsonLd';
import { Section, SectionTitle, GlassCard, Muted, Eyebrow } from '@/components/ui';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Privacy', path: '/privacy' },
];

export const metadata = buildMetadata({
  title: 'Privacy policy',
  description: 'How Nexlane Digital collects, uses and stores information from visitors and clients.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <Section>
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Privacy policy</h1>
      <GlassCard>
        <p className="text-[var(--muted)] font-semibold">
          Draft — to be reviewed by a qualified professional before publication.
        </p>
      </GlassCard>
      <Muted>Last updated: TODO — set a real date before publishing.</Muted>

      <SectionTitle>Who we are</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          Nexlane Digital is a small agency based in Kaithal, Haryana, India. This policy explains what information we
          collect when you use this website and how we use it.
        </p>
      </GlassCard>

      <SectionTitle>What we collect</SectionTitle>
      <GlassCard>
        <ul className="list-disc pl-5 space-y-2 text-[var(--muted)]">
          <li>Information you send us through contact or audit forms: name, email, phone number (optional) and message.</li>
          <li>Technical data collected automatically by our hosting provider: IP address, browser, device and approximate location.</li>
          <li>We do not use tracking cookies or analytics at this time.</li>
        </ul>
      </GlassCard>

      <SectionTitle>Third parties</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)] mb-2">
          This site relies on the following third parties, each with their own privacy policy:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-[var(--muted)]">
          <li>
            <strong>Vercel</strong> — hosting and delivery of the website, including server logs (IP address, request
            metadata).
          </li>
          <li>
            <strong>Resend</strong> — email delivery for messages you send us through our forms. Your name, email and message
            are passed to Resend to deliver them to our inbox.
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> — bot protection on forms, when enabled. Cloudflare may process your IP
            address and browser signals to verify you are human.
          </li>
        </ul>
      </GlassCard>

      <SectionTitle>How we use your information</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          We use your information only to reply to your enquiry, deliver the audit you requested, and keep a record of our
          correspondence. We do not sell or share your information with anyone else, and we do not run advertising based on
          it.
        </p>
      </GlassCard>

      <SectionTitle>How long we keep it</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          Messages and audit requests are kept in our email inbox for as long as needed to handle them and for our records.
          You can ask us to delete your information at any time.
        </p>
      </GlassCard>

      <SectionTitle>Your rights</SectionTitle>
      <GlassCard>
        <p className="text-[var(--muted)]">
          You can ask us what information we hold about you, ask us to correct it, or ask us to delete it. Contact us using
          the details on the contact page.
        </p>
      </GlassCard>

      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}
