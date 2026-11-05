import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Section, SectionTitle, GlassCard, Muted } from '@/components/ui';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { site } from '@/config/site';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Audit', path: '/audit' },
];

export const metadata = buildMetadata({
  title: 'Free Website and Marketing Audit',
  description:
    'A free written review of your website, Google profile or social media with 3 to 5 practical suggestions you can act on. No obligation to hire us.',
  path: '/audit',
});

export default function AuditPage() {
  const contact = site.contactEmail;
  const whatsapp = site.whatsappNumber;
  return (
    <Section>
      <h1 className="font-display text-4xl font-bold mb-8">{site.audit.title}</h1>
      <Breadcrumbs items={breadcrumbItems} />
      <p className="text-[var(--muted)] mb-4">{site.audit.includes}</p>
      <Muted>{site.audit.note}</Muted>

      <SectionTitle>What you will get</SectionTitle>
      <ul className="list-disc pl-5 space-y-2 text-[var(--muted)]">
        <li>A short written review of your website, Google profile or social media.</li>
        <li>Three to five practical suggestions you can act on yourself.</li>
        <li>No obligation to hire us, and no sales call unless you ask for one.</li>
      </ul>

      <SectionTitle>Request your audit</SectionTitle>
      <GlassCard>
        <form className="space-y-4" action="#" method="post" aria-describedby="audit-form-note">
          <div>
            <label htmlFor="audit-name" className="block text-sm font-medium mb-1">
              Your name
            </label>
            <input
              id="audit-name"
              name="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="audit-email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="audit-email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="audit-url" className="block text-sm font-medium mb-1">
              Website or profile URL
            </label>
            <input
              id="audit-url"
              name="url"
              type="url"
              inputMode="url"
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          <div>
            <label htmlFor="audit-message" className="block text-sm font-medium mb-1">
              Anything you want us to know (optional)
            </label>
            <textarea
              id="audit-message"
              name="message"
              rows={4}
              className="w-full rounded-lg border border-[var(--card-border)] bg-[rgba(0,13,29,0.6)] px-3 py-2 text-white"
            />
          </div>
          {/* Honeypot — humans never fill this; kept hidden. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="audit-company">Company</label>
            <input id="audit-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled aria-disabled="true" className="btn btn-primary opacity-60 cursor-not-allowed">
            Submit (coming soon)
          </button>
          <p id="audit-form-note" className="text-xs text-[var(--muted)]">
            The form backend is being wired up. Until then, email us
            {contact ? (
              <>
                {' '}at <a href={`mailto:${contact}`} className="underline">{contact}</a>
              </>
            ) : (
              <> directly</>
            )}
            {whatsapp ? (
              <>
                {' '}or WhatsApp us at{' '}
                <a href={`https://wa.me/${whatsapp}`} className="underline" rel="noopener noreferrer" target="_blank">
                  +{whatsapp}
                </a>
              </>
            ) : null}
            .
          </p>
        </form>
      </GlassCard>

      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}
