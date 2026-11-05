import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { services } from "@/content/services";
import { practiceProjects } from "@/content/projects";
import { notDraft } from "@/content/blog";
import { homeFaqs } from "@/content/faq";
import { ArrowMotif, GradientHeading, GlassCard, Muted, Section, SectionTitle } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

const facts = [
  "4-person team",
  "Based in Kaithal, Haryana",
  "Web + SEO + video under one roof",
  "Free audit, no strings",
];

const audiences = [
  { title: "Shops & stores", blurb: "Get found when neighbors search online instead of walking around." },
  { title: "Schools & coaching", blurb: "A clear website and Google profile parents can trust before they call." },
  { title: "Gyms", blurb: "Show schedules, results and location — look professional from search." },
  { title: "Clinics", blurb: "Make hours, location and services easy to find in a soft moment." },
  { title: "Hotels & PGs", blurb: "Photos, amenities and contact — guests can find and message you quickly." },
  { title: "Local professionals", blurb: "Advocates, CAs, agents: one clean trustable page is enough to start." },
];

const whyUs = [
  {
    title: "We talk to you directly",
    blurb:
      "No account managers or ticket queues — the same four people who build your site answer your questions.",
  },
  {
    title: "Web + SEO + video, together",
    blurb:
      "Websites, search visibility and video edits come from one small team, so the end work stays consistent.",
  },
  {
    title: "We teach what we do",
    blurb:
      "Free lessons on YouTube and Instagram — our methods stay tested in public, not behind client NDAs.",
  },
  {
    title: "Written scope before work starts",
    blurb:
      "You get a short, plain document saying exactly what we will deliver — sign-off first, work after.",
  },
];

const process = [
  { step: "1", title: "Talk", blurb: "A free chat about your business, customers and what is not working." },
  { step: "2", title: "Plan + written scope", blurb: "A short document: what we do, what we don't, and what it costs." },
  { step: "3", title: "Build", blurb: "We get to work — you get short written updates, not radio silence." },
  { step: "4", title: "Review together", blurb: "You test what we built; changes happen before launch." },
  { step: "5", title: "Launch + support", blurb: "Go-live plus a plan for whatever maintenance you actually need." },
];

export default function HomePage() {
  const faqs = homeFaqs;
  const practice = practiceProjects;
  const posts = notDraft();

  return (
    <>
      {/* 1. HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Nexlane Digital · Kaithal, Haryana
            </p>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-5xl">
              Websites, <GradientHeading>SEO</GradientHeading> and growth for local businesses
            </h1>
            <p className="mt-4 max-w-xl text-[var(--muted)] text-lg leading-relaxed">
              We help small businesses in Kaithal and across Haryana get noticed online — clear websites, honest SEO, and free lessons so even your own team can learn.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/audit" className="btn btn-primary">
                Get a Free Audit
              </Link>
              {site.whatsappNumber && (
                <a className="btn btn-ghost" href={`https://wa.me/${site.whatsappNumber}`} rel="noopener noreferrer" target="_blank">
                  Chat on WhatsApp
                </a>
              )}
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[var(--bg-glow-2)] opacity-25 blur-3xl" aria-hidden="true" />
            <ArrowMotif className="relative h-44 w-44 sm:h-56 sm:w-56 animate-none" />
          </div>
        </div>
      </section>

      {/* 2. WHAT WE DO */}
      <Section>
        <SectionTitle>What we do</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <GlassCard key={s.slug} className="flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-semibold">{s.shortName}</h3>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{s.summary}</p>
              </div>
              <Link href={`/services/${s.slug}`} className="mt-4 text-sm font-semibold text-[var(--accent-2)] hover:text-white">
                Learn more →
              </Link>
            </GlassCard>
          ))}
          <GlassCard className="flex flex-col justify-between border-[var(--accent)]/30">
            <div>
              <h3 className="font-display text-lg font-semibold">Learn with us (free)</h3>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                We teach digital marketing, AI tools and profile growth on YouTube and Instagram — free, for anyone.
              </p>
            </div>
            <Link href="/learn/youtube" className="mt-4 text-sm font-semibold text-[var(--accent-2)] hover:text-white">
              Start learning →
            </Link>
          </GlassCard>
        </div>
      </Section>

      {/* 3. FACTS STRIP (only true things) */}
      <Section className="py-10">
        <div className="glass grid gap-6 px-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" aria-hidden="true" />
              <p className="text-sm font-medium">{fact}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. WHO WE HELP */}
      <Section>
        <SectionTitle>Who we help</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <GlassCard key={a.title}>
              <h3 className="font-display font-semibold">{a.title}</h3>
              <Muted>{a.blurb}</Muted>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* 5. WHY NEXLANE */}
      <Section>
        <SectionTitle>Why Nexlane</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          {whyUs.map((w) => (
            <GlassCard key={w.title}>
              <h3 className="font-display font-semibold">{w.title}</h3>
              <Muted>{w.blurb}</Muted>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* 6. OUR WORK */}
      <Section>
        <SectionTitle>Our work — practice, clearly labelled</SectionTitle>
        <Muted>
          We are new, so we show practice projects instead of pretending they are client work.
          Client work will appear here only with the client&apos;s written permission.
        </Muted>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {practice.slice(0, 3).map((p) => (
            <GlassCard key={p.title}>
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{p.title}</h3>
                {p.status === "flagged" && (
                  <span className="rounded-full border border-[var(--card-border)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                    pending permission
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">Built by {p.role} · practice project</p>
            </GlassCard>
          ))}
        </div>
        <Link href="/portfolio" className="mt-6 inline-block text-sm font-semibold text-[var(--accent-2)] hover:text-white">
          See the full portfolio →
        </Link>
      </Section>

      {/* 7. LEARN WITH US */}
      <Section>
        <SectionTitle>Learn with us</SectionTitle>
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <GlassCard key={p.slug}>
                <p className="text-xs uppercase tracking-widest text-[var(--accent)]">{p.category}</p>
                <h3 className="mt-1 font-display font-semibold">{p.title}</h3>
                <Link href={`/learn/blog/${p.slug}`} className="mt-3 inline-block text-sm text-[var(--accent-2)] hover:text-white">
                  Read →
                </Link>
              </GlassCard>
            ))}
          </div>
        ) : (
          <Muted>
            Our first lessons are on the way. Meanwhile, subscribe on YouTube and Instagram to catch them as they land.
          </Muted>
        )}
        {site.youtubeUrl && (
          <a href={site.youtubeUrl} className="btn btn-ghost mt-6" rel="noopener noreferrer" target="_blank">
            Subscribe on YouTube
          </a>
        )}
      </Section>

      {/* 8. HOW WE WORK */}
      <Section>
        <SectionTitle>How we work</SectionTitle>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 list-none">
          {process.map((s) => (
            <li key={s.step}>
              <GlassCard className="h-full">
                <span className="font-display text-2xl font-bold text-gradient">{s.step}</span>
                <h3 className="mt-1 font-semibold">{s.title}</h3>
                <Muted>{s.blurb}</Muted>
              </GlassCard>
            </li>
          ))}
        </ol>
      </Section>

      {/* 9. FAQ */}
      <Section>
        <SectionTitle>Questions people ask</SectionTitle>
        <div className="divide-y divide-[var(--card-border)] rounded-2xl border border-[var(--card-border)]">
          {faqs.map((f) => (
            <details key={f.question} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium text-white marker:hidden">
                {f.question}
              </summary>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
            </details>
          ))}
        </div>
        <JsonLd data={faqSchema(faqs)} />
      </Section>

      {/* 10. FINAL CTA */}
      <Section className="pb-24">
        <div className="glass flex flex-col items-center gap-4 px-6 py-12 text-center">
          <ArrowMotif className="h-12 w-12" />
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Not sure where your business is losing customers online? <GradientHeading>We&apos;ll look for free.</GradientHeading>
          </h2>
          <p className="max-w-xl text-sm text-[var(--muted)]">
            Send us one link — your Instagram, Google profile or website — and you get a short written review with 3 to 5 practical suggestions. Free, no obligation.
          </p>
          <Link href="/audit" className="btn btn-primary mt-2">
            Get a Free Audit
          </Link>
        </div>
      </Section>
    </>
  );
}
