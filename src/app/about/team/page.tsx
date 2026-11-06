import { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema } from '@/lib/seo';
import { team, teamGroups } from '@/config/site';
import { Container, Muted, Eyebrow } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ProfileTile from '@/components/ProfileTile';
import NextUp from '@/components/NextUp';

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
  const members = team.filter((m) => m.group === "team").sort((a, b) => a.order - b.order);

  return (
    <>
      <Container className="pb-20 pt-12">
        <Breadcrumbs items={breadcrumbItems} />
        <Eyebrow>About · {group.label}</Eyebrow>
        <h1 className="mb-4 font-display text-4xl font-bold sm:text-5xl">{group.label}</h1>
        <Muted>
          The people who build and edit everything Nexlane ships.
        </Muted>

        <div id="team" className="mt-10 grid gap-10 md:grid-cols-2">
          {members.map((member) => (
            <ProfileTile key={member.slug} member={member} />
          ))}
        </div>

        <div className="mt-16">
          <NextUp
            title="Meet the people who run Nexlane"
            href="/about/founders"
            cta="Meet the founders"
            eyebrow="Keep going"
          >
            Two founders, directly reachable — plus the team members who build alongside them.
          </NextUp>
        </div>
      </Container>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
    </>
  );
}
