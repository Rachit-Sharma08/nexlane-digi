import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Section, Eyebrow } from '@/components/ui';
import { buildMetadata, breadcrumbSchema, articleSchema } from '@/lib/seo';
import { getPost, notDraft, readingTime, type BlogBlock } from '@/content/blog';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Learn', path: '/learn' },
  { name: 'Blog', path: '/learn/blog' },
];

export async function generateStaticParams() {
  return notDraft().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) notFound();

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/learn/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) notFound();

  const postBreadcrumbItems = [
    ...breadcrumbItems,
    { name: post.title, path: `/learn/blog/${slug}` },
  ];

  return (
    <Section>
      <Breadcrumbs items={postBreadcrumbItems} />
      <Eyebrow>Learn · Blog</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">{post.title}</h1>
      <p className="text-[var(--muted)] mb-8">
        {post.category} · {post.date} · {post.author} · {readingTime(post)}
      </p>
      <div className="prose max-w-none">
        {post.content.map((block: BlogBlock, index: number) => (
          <div key={index}>
            {block.type === 'p' && (
              <p className="text-[var(--muted)] leading-relaxed">{block.text}</p>
            )}
            {block.type === 'h' && (
              <h2 className="font-display text-xl font-semibold mt-8 mb-2">{block.text}</h2>
            )}
            {block.type === 'list' && (
              <ul className="list-disc pl-5 space-y-1">
                {block.items.map((item, i) => (
                  <li key={i} className="text-[var(--muted)]">{item}</li>
                ))}
              </ul>
            )}
            {block.type === 'quote' && (
              <blockquote className="glass p-4 border-l-2" style={{ borderColor: 'var(--accent)' }}>
                <p className="text-[var(--muted)]">{block.text}</p>
              </blockquote>
            )}
          </div>
        ))}
      </div>
      <div className="mt-12 space-y-4">
        <Link href="/services/seo" className="block text-[var(--accent)] hover:underline">
          See what we do in SEO
        </Link>
        <Link href="/services/web-development" className="block text-[var(--accent)] hover:underline">
          See what we do in web development
        </Link>
      </div>
      <JsonLd data={breadcrumbSchema(postBreadcrumbItems)} />
      <JsonLd
        data={articleSchema({
          slug: post.slug,
          title: post.title,
          description: post.description,
          authorName: post.author,
          datePublished: post.date,
        })}
      />
    </Section>
  );
}
