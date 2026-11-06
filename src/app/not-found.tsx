import Link from 'next/link';
import { Section, Muted, Eyebrow } from '@/components/ui';
import DepthCard from '@/components/DepthCard';
import NextUp from '@/components/NextUp';

export const metadata = {
  title: 'Page not found — Nexlane Digital',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Section>
      <Eyebrow>404</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-4">404 — page not found</h1>
      <Muted>The page you are looking for does not exist or has moved.</Muted>
      <DepthCard>
        <p className="text-[var(--muted)] mb-4">
          Try the home page, or use the navigation above to find what you need.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </DepthCard>
      <NextUp title="Go to the home page" href="/" cta="Back to home" eyebrow="Keep going" />
    </Section>
  );
}
