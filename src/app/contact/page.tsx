import JsonLd from '@/components/JsonLd';
import { Section, SectionTitle, GlassCard, Eyebrow } from '@/components/ui';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { site } from '@/config/site';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
];

export const metadata = buildMetadata({
  title: 'Contact us',
  description:
    'Get in touch with Nexlane Digital — a small team from Kaithal, Haryana. We reply within 24 to 48 hours.',
  path: '/contact',
});

export default function ContactPage() {
  const contact = site.contactEmail;
  const whatsapp = site.whatsappNumber;
  return (
    <Section>
      <Eyebrow>Contact</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Get in touch</h1>
      <p className="text-[var(--muted)] mb-4">
        We are a small team, so you will talk to the people doing the work. We reply within {site.REPLY_TIME}.
      </p>

      <SectionTitle>Reach us directly</SectionTitle>
      <GlassCard>
        <ul className="space-y-2 text-[var(--muted)]">
          {contact ? (
            <li>
              Email:{' '}
              <a href={`mailto:${contact}`} className="text-[var(--accent-2)] underline">
                {contact}
              </a>
            </li>
          ) : (
            <li>Email: coming soon</li>
          )}
          {whatsapp ? (
            <li>
              WhatsApp:{' '}
              <a
                href={`https://wa.me/${whatsapp}`}
                className="text-[var(--accent-2)] underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                +{whatsapp}
              </a>
            </li>
          ) : null}
          {site.instagramUrl ? (
            <li>
              Instagram:{' '}
              <a href={site.instagramUrl} className="text-[var(--accent-2)] underline" rel="noopener noreferrer" target="_blank">
                {site.instagramUrl}
              </a>
            </li>
          ) : null}
          {site.youtubeUrl ? (
            <li>
              YouTube:{' '}
              <a href={site.youtubeUrl} className="text-[var(--accent-2)] underline" rel="noopener noreferrer" target="_blank">
                {site.youtubeUrl}
              </a>
            </li>
          ) : null}
        </ul>
      </GlassCard>

      <SectionTitle>Send a message</SectionTitle>
      <GlassCard>
        <form className="space-y-4" action="#" method="post" aria-describedby="contact-form-note">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
              Your name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-company">Company</label>
            <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled aria-disabled="true" className="btn btn-primary opacity-60 cursor-not-allowed">
            Submit (coming soon)
          </button>
          <p id="contact-form-note" className="text-xs text-[var(--muted)]">
            The form backend is being wired up. Until then, use the email or social links above.
          </p>
        </form>
      </GlassCard>

      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}
