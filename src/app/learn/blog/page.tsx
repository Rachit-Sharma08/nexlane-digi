import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Section, Eyebrow } from '@/components/ui';
import DepthCard from '@/components/DepthCard';
import NextUp from '@/components/NextUp';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { notDraft, readingTime } from '@/content/blog';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Learn', path: '/learn' },
  { name: 'Blog', path: '/learn/blog' },
];

export const metadata = buildMetadata({
  title: 'Blog: SEO and Digital Marketing Tips | Nexlane Digital',
  description:
    'Plain-language articles on SEO, local search and AI tools for small businesses, written by the Nexlane Digital team. First posts coming soon.',
  path: '/learn/blog',
});

export default function BlogPage() {
  const posts = notDraft();

  return (
    <Section>
      <Breadcrumbs items={breadcrumbItems} />
      <Eyebrow>Learn · Blog</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <DepthCard>
          <p className="text-[var(--muted)]">First posts are being written — check back soon.</p>
        </DepthCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <DepthCard key={post.slug}>
              <span className="text-[var(--accent)] uppercase text-xs tracking-widest">{post.category}</span>
              <h2 className="font-display text-xl font-semibold mt-2">
                <Link href={`/learn/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-[var(--muted)] mt-2">
                {post.date} · {readingTime(post)} · {post.author}
              </p>
            </DepthCard>
          ))}
        </div>
      )}
      <NextUp title="Browse free resources" href="/learn/resources" cta="Open resources" eyebrow="Keep going" />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}