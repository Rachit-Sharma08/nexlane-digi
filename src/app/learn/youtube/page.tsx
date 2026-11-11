import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Section, Eyebrow } from '@/components/ui';
import DepthCard from '@/components/DepthCard';
import NextUp from '@/components/NextUp';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { site } from '@/config/site';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Learn', path: '/learn' },
  { name: 'YouTube', path: '/learn/youtube' },
];

export const metadata = buildMetadata({
  title: 'YouTube lessons',
  description: 'Free video lessons on digital marketing and free AI tools',
  path: '/learn/youtube',
});

export default function YouTubePage() {
  const lessons: { title: string; videoId: string }[] = []; // TODO: add real uploaded lesson video IDs

  return (
    <Section>
      <Breadcrumbs items={breadcrumbItems} />
      <Eyebrow>Learn · YouTube</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">YouTube lessons</h1>
      <p className="text-[var(--muted)] mb-8">Free video lessons on digital marketing and free AI tools</p>
      {lessons.length === 0 ? (
        <DepthCard>
          <p className="text-[var(--muted)]">First lessons are on the way. Subscribe when the channel link is live.</p>
        </DepthCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lessons.map((lesson) => (
            <div key={lesson.videoId} className="space-y-2">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}`}
                title={lesson.title}
                loading="lazy"
                allowFullScreen
                className="aspect-video w-full rounded-lg border border-[var(--card-border)]"
              />
              <h2 className="font-display text-xl font-semibold">{lesson.title}</h2>
            </div>
          ))}
        </div>
      )}
      {site.youtubeUrl && (
        <a
          href={site.youtubeUrl}
          className="btn btn-primary mt-8"
          rel="noopener noreferrer"
          target="_blank"
        >
          Subscribe on YouTube
        </a>
      )}
      <NextUp title="Read the blog" href="/learn/blog" cta="Open blog" eyebrow="Keep going" />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}