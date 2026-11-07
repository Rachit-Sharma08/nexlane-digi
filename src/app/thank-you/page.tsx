import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { Section, GlassCard, Muted, Eyebrow } from '@/components/ui';
import { site } from '@/config/site';

export const metadata = {
  // absolute: the root title template would otherwise double the brand.
  title: { absolute: 'Thank you — Nexlane Digital' },
  description: 'Your message has been received. We will reply within 24 to 48 hours.',
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Section>
      <Eyebrow>Thank you</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Thank you</h1>
      <GlassCard>
        <p className="text-[var(--muted)]">
          We have received your message and will reply within {site.REPLY_TIME}. If it is urgent, reach us on
          {site.whatsappNumber ? (
            <>
              {' '}WhatsApp at{' '}
              <a href={`https://wa.me/${site.whatsappNumber}`} className="underline" rel="noopener noreferrer" target="_blank">
                +{site.whatsappNumber}
              </a>
            </>
          ) : (
            <> the email or social links on the contact page</>
          )}
          .
        </p>
      </GlassCard>
      <Muted>
        <Link href="/" className="underline">
          Back to home
        </Link>
      </Muted>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Thank you' }} />
    </Section>
  );
}
