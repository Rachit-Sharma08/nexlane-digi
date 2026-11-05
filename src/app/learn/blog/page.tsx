import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { GlassCard, Section } from '@/components/ui';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { notDraft, readingTime } from '@/content/blog';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Learn', path: '/learn' },
  { name: 'Blog', path: '/learn/blog' },
];

export const metadata = buildMetadata({
  title: 'Blog',
  description: 'In-depth guides and case studies',
  path: '/learn/blog',
});

export default function BlogPage() {
  const posts = notDraft();

  return (
    <Section>
      <h1 className="font-display text-4xl font-bold mb-8">Blog</h1>
      <Breadcrumbs items={breadcrumbItems} />
      {posts.length === 0 ? (
        <GlassCard>
          <p className="text-[var(--muted)]">First posts are being written — check back soon.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <GlassCard key={post.slug}>
              <span className="text-[var(--accent)] uppercase text-xs tracking-widest">{post.category}</span>
              <h2 className="font-display text-xl font-semibold mt-2">
                <Link href={`/learn/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-[var(--muted)] mt-2">
                {post.date} · {readingTime(post)} · {post.author}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}