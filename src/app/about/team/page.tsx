import { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { team, teamGroups } from '@/config/site';
import { Section, GlassCard, Muted, Eyebrow } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import MemberCard from '@/components/MemberCard';

// See founders page: title/heading/breadcrumb all follow the config label.
const group = teamGroups.find((g) => g.id === "team")!;

export const metadata: Metadata = buildMetadata({
  title: group.label,
  description: "The team behind Nexlane Digital — websites, social media and video",
  path: "/about/team"
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: group.label, path: "/about/team" },
];

export default function TeamPage() {
  const members = team.filter((m) => m.group === "team");

  return (
    <>
      <Section>
        <Breadcrumbs items={breadcrumbItems} />
        <Eyebrow>About · {group.label}</Eyebrow>
        <h1 className="text-3xl font-bold mb-4">{group.label}</h1>
        <Muted>
          The people who build and edit everything Nexlane ships.
        </Muted>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {members.map((member) => (
            <MemberCard key={member.slug} member={member} />
          ))}
        </div>

        <GlassCard className="mt-8">
          <p className="mb-4 text-[var(--muted)]">
            Looking for the people who run Nexlane? Meet the founders.
          </p>
          <Link href="/about/founders" className="btn btn-ghost">
            Meet the founders
          </Link>
        </GlassCard>
      </Section>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </>
  );
}
