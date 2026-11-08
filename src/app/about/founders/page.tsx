import { Metadata } from 'next';
import { buildMetadata, breadcrumbSchema, personSchema } from '@/lib/seo';
import { team, teamGroups } from '@/config/site';
import { Container, Muted, Eyebrow, SectionTitle } from '@/components/ui';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import ProfileTile from '@/components/ProfileTile';
import SectionNav from '@/components/SectionNav';
import NextUp from '@/components/NextUp';

// Page title and heading come from the group label in config, so renaming
// the group (e.g. to "Core team") updates title, breadcrumb and H1 together.
const group = teamGroups.find((g) => g.id === "founders")!;

export const metadata: Metadata = buildMetadata({
  title: "Founders | Digital Marketers in Kaithal | Nexlane Digital",
  description:
    "Meet Rachit Sharma (SEO and growth) and Krish Khati (web development and AI), the founders of Nexlane Digital, a digital agency in Kaithal, Haryana.",
  path: "/about/founders"
});

const breadcrumbItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: group.label, path: "/about/founders" },
];

const sections = [
  { id: "founders", label: group.label },
  { id: "team-members", label: "Team members" },
  { id: "why-nexlane", label: "Why we started" },
];

export default function FoundersPage() {
  const founders = team.filter((m) => m.group === "founders").sort((a, b) => a.order - b.order);
  const members = team.filter((m) => m.group === "team").sort((a, b) => a.order - b.order);

  return (
    <>
      <Container className="pb-20 pt-12">
        <Breadcrumbs items={breadcrumbItems} />
        <Eyebrow>About · {group.label}</Eyebrow>
        <h1 className="mb-4 font-display text-4xl font-bold sm:text-5xl">{group.label}</h1>
        <Muted>
          Two founders, directly reachable — you talk to the people doing the work.
        </Muted>

        <SectionNav items={sections} />

        <section id="founders" aria-label={group.label}>
          <div className="grid gap-10 md:grid-cols-2">
            {founders.map((member) => (
              <ProfileTile key={member.slug} member={member} />
            ))}
          </div>
        </section>

        <section id="team-members">
          <SectionTitle>Team members</SectionTitle>
          <div className="grid gap-10 md:grid-cols-2">
            {members.map((member) => (
              <ProfileTile key={member.slug} member={member} />
            ))}
          </div>
        </section>

        <section id="why-nexlane">
          <SectionTitle>Why we started Nexlane</SectionTitle>
          <Muted>
            Rachit and Krish started Nexlane in 2026 to build real things for businesses while learning fast —
            web development, AI tools and honest SEO under one roof.
          </Muted>
        </section>

        <div className="mt-16">
          <NextUp
            title="See the work our team is building"
            href="/our-work"
            cta="Our Work"
            eyebrow="Keep going"
          >
            Client projects are coming; personal projects are labelled as personal.
          </NextUp>
        </div>
      </Container>
      <JsonLd data={breadcrumbSchema(breadcrumbItems)} />
      {/* Person schema for the two founders (AGENTS §12.7) — url = their portfolio when they have one. */}
      {founders.map((m) => (
        <JsonLd
          key={m.slug}
          data={personSchema({
            name: m.name,
            jobTitle: m.title,
            url: m.portfolioUrl ?? '/about/founders',
          })}
        />
      ))}
    </>
  );
}
