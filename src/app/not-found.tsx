import Link from 'next/link';
import { Section, GlassCard, Muted } from '@/components/ui';

export const metadata = {
  title: 'Page not found — Nexlane Digital',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section>
      <h1 className="font-display text-4xl font-bold mb-4">404 — page not found</h1>
      <Muted>The page you are looking for does not exist or has moved.</Muted>
      <GlassCard>
        <p className="text-[var(--muted)] mb-4">
          Try the home page, or use the navigation above to find what you need.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </GlassCard>
    </Section>
  );
}
