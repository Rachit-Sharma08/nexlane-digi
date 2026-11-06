import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { Muted, Section, Eyebrow } from '@/components/ui';
import NextUp from '@/components/NextUp';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { toolLists } from '@/content/resources';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Learn', path: '/learn' },
  { name: 'Resources', path: '/learn/resources' },
];

export const metadata = buildMetadata({
  title: 'Free resources',
  description: 'Curated list of free tools and services',
  path: '/learn/resources',
});

export default function ResourcesPage() {
  return (
    <Section>
      <Breadcrumbs items={breadcrumbItems} />
      <Eyebrow>Learn · Resources</Eyebrow>
      <h1 className="font-display text-4xl font-bold mb-8">Free resources</h1>
      <p className="text-[var(--muted)] mb-8">
        All tools listed have usable free tiers at the time of writing — always check the tool&apos;s own limits before relying on them.
      </p>
      {toolLists.map((list) => (
        <section key={list.title} className="mb-12">
          <h2 className="font-display text-2xl font-semibold mb-4">{list.title}</h2>
          <Muted>{list.intro}</Muted>
          {list.groups.map((group) => (
            <div key={group.name} className="mt-6">
              <h3 className="font-display text-xl font-semibold mb-2">{group.name}</h3>
              <ul className="space-y-2">
                {group.items.map((item, index) => (
                  <li key={index} className="flex flex-col">
                    <strong>{item.name}</strong>
                    <Muted>{item.note}</Muted>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
      <NextUp title="Watch YouTube lessons" href="/learn/youtube" cta="Open YouTube" eyebrow="Keep going" />
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </Section>
  );
}