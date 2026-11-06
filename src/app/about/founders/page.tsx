import { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { team, teamGroups } from '@/config/site';
import { Section, SectionTitle, GlassCard, Muted, Eyebrow } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import MemberCard from '@/components/MemberCard';

// Page title and heading come from the group label in config, so renaming
// the group (e.g. to "Core team") updates title, breadcrumb and H1 together.
const group = teamGroups.find((g) => g.id === "founders")!;

export const metadata: Metadata = buildMetadata({
  title: group.label,
  description: "Rachit Sharma and Krish Khati — the founders of Nexlane Digital",
  path: "/about/founders"
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: group.label, path: "/about/founders" },
];

export default function FoundersPage() {
  const founders = team.filter((m) => m.group === "founders");

  return (
    <>
      <Section>
        <Breadcrumbs items={breadcrumbItems} />
        <Eyebrow>About · {group.label}</Eyebrow>
        <h1 className="text-3xl font-bold mb-4">{group.label}</h1>
        <Muted>
          Two founders, directly reachable — you talk to the people doing the work.
        </Muted>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {founders.map((member) => (
            <MemberCard key={member.slug} member={member} />
          ))}
        </div>

        <SectionTitle>Why we started Nexlane</SectionTitle>
        <Muted>
          Rachit and Krish started Nexlane in 2026 to build real things for local businesses while learning fast —
          web development, AI tools and honest SEO under one roof.
        </Muted>

        <GlassCard className="mt-8">
          <p className="mb-4 text-[var(--muted)]">
            Want the wider team too? Meet everyone who builds Nexlane&apos;s work.
          </p>
          <Link href="/about/team" className="btn btn-ghost">
            Meet the team
          </Link>
        </GlassCard>
      </Section>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </>
  );
}
