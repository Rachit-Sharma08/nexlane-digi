import Link from "next/link";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { services } from "@/content/services";
import { notDraft } from "@/content/blog";
import { homeFaqs } from "@/content/faq";
import { ArrowMotif, Container, GradientHeading, SectionHeader } from "@/components/ui";
import DepthCard from "@/components/DepthCard";
import SectionNav from "@/components/SectionNav";
import HeroVisual from "@/components/home/HeroVisual";
import NextUp from "@/components/NextUp";
import { Marquee } from "@/components/ui/marquee";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, faqSchema } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Nexlane Digital | Digital Marketing Agency in Kaithal",
  description:
    "Nexlane Digital is a young digital marketing agency in Kaithal, Haryana. Websites, SEO and ads for businesses in Haryana, India and abroad, plus free lessons.",
  path: "/",
});

const facts = [
  "4-person team",
  "Based in Kaithal, Haryana",
  "Web + SEO + video under one roof",
  "Free audit, no strings",
];

// Tools this team actually uses on its own work (not client logos).
const tools = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Python",
  "Supabase",
  "Vercel",
  "GitHub",
  "Google Search Console",
  "Google Analytics",
  "Google Ads",
  "Meta Ads",
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

const sections = [
  { id: "what-we-do", label: "What we do" },
  { id: "who-we-help", label: "Who we help" },
  { id: "why-nexlane", label: "Why Nexlane" },
  { id: "process", label: "How we work" },
  { id: "work", label: "Our work" },
];

const cardLink = "inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-2)] hover:text-white";

export default function HomePage() {
  const faqs = homeFaqs;
  const posts = notDraft();

  return (
    <>
      {/* 1. HERO — the only WebGL moment on the site (§11.2) */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
              Nexlane Digital · Kaithal, Haryana
            </p>
            <h1 className="font-display text-4xl font-bold leading-[1.08] sm:text-5xl">
              Websites, <GradientHeading>SEO</GradientHeading> and growth for businesses
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Nexlane Digital is a young digital marketing agency in Kaithal, Haryana. We build websites, improve SEO
              and run ads for businesses of every size, and we teach what we learn for free.
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
            <p className="mt-4 text-xs text-[var(--muted)]">
              Free, no obligation · We usually reply within {site.REPLY_TIME}.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[30rem] lg:max-w-none">
            <HeroVisual />
          </div>
        </div>
      </section>

      <Container>
        <SectionNav items={sections} />

        {/* 2. WHAT WE DO — bento */}
        <section id="what-we-do" className="scroll-reveal py-14">
          <SectionHeader
            eyebrow="Services"
            title="What we do"
            intro="Three services, one small team. Every project starts with a free chat and a written scope."
          />

          <div className="stagger mt-10 grid gap-4 md:grid-cols-6">
            <div className="md:col-span-4">
              <DepthCard glare className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">01 · Websites</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Web Development</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">{services[0].summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {services[0].whatIsIncluded.slice(0, 3).map((item) => (
                      <li key={item} className="rounded-full border border-[var(--card-border)] bg-[rgba(12,34,63,0.35)] px-3 py-1 text-xs text-[var(--muted)]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/services/web-development" className={cardLink}>
                  See web development <span aria-hidden="true">→</span>
                </Link>
              </DepthCard>
            </div>

            <div className="md:col-span-2">
              <DepthCard glare className="flex h-full flex-col justify-between gap-8 p-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">02 · Search</span>
                  <h3 className="mt-3 font-display text-xl font-semibold">{services[1].shortName}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{services[1].summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {services[1].whatIsIncluded.slice(0, 3).map((item) => (
                      <li key={item} className="rounded-full border border-[var(--card-border)] bg-[rgba(12,34,63,0.35)] px-3 py-1 text-xs text-[var(--muted)]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/services/seo" className={cardLink}>
                  See SEO <span aria-hidden="true">→</span>
                </Link>
              </DepthCard>
            </div>

            <div className="md:col-span-2">
              <DepthCard glare className="flex h-full flex-col justify-between gap-8 p-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">03 · Play</span>
                  <h3 className="mt-3 font-display text-xl font-semibold">{services[2].shortName}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{services[2].summary}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {services[2].whatIsIncluded.slice(0, 3).map((item) => (
                      <li key={item} className="rounded-full border border-[var(--card-border)] bg-[rgba(12,34,63,0.35)] px-3 py-1 text-xs text-[var(--muted)]">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/services/game-development" className={cardLink}>
                  See game development <span aria-hidden="true">→</span>
                </Link>
              </DepthCard>
            </div>

            <div className="md:col-span-4">
              <DepthCard glare className="flex h-full flex-col justify-between gap-8 p-6 sm:p-8">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Free · Learn</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">Learn with us</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--muted)]">
                    We teach digital marketing, AI tools and profile growth on YouTube and Instagram — free, for anyone.
                  </p>
                </div>
                <Link href="/learn/youtube" className={cardLink}>
                  Start learning <span aria-hidden="true">→</span>
                </Link>
              </DepthCard>
            </div>
          </div>
        </section>

        {/* 3. FACTS + TOOLS — only true things */}
        <section className="scroll-reveal border-y border-[var(--card-border)] py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact} className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" aria-hidden="true" />
                <p className="text-sm font-medium">{fact}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">Tools we actually use</p>
            <Marquee className="mt-3 [--duration:46s] [--gap:0.5rem]" pauseOnHover>
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="whitespace-nowrap rounded-full border border-[var(--card-border)] bg-[rgba(9,38,72,0.5)] px-4 py-1.5 text-sm text-[var(--muted)]"
                >
                  {tool}
                </span>
              ))}
            </Marquee>
          </div>
        </section>

        {/* 4. WHO WE HELP */}
        <section id="who-we-help" className="scroll-reveal py-14">
          <SectionHeader
            eyebrow="Audience"
            title="Who we help"
            intro="Businesses of every size — the kind that live on a phone, not a corporate website."
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {audiences.map((a) => (
              <li key={a.title} className="motion-card glass p-5">
                <h3 className="font-display font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{a.blurb}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* 5. WHY NEXLANE */}
        <section id="why-nexlane" className="scroll-reveal py-14">
          <SectionHeader
            eyebrow="Why us"
            title="Why Nexlane"
            intro="A young studio, so we compete on being direct, exact and easy to reach."
          />
          <div className="stagger mt-8 grid gap-4 sm:grid-cols-2">
            {whyUs.map((w, i) => (
              <DepthCard key={w.title} glare className="p-6">
                <span className="font-display text-sm font-bold text-gradient">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{w.blurb}</p>
              </DepthCard>
            ))}
          </div>
        </section>

        {/* 6. HOW WE WORK — 5-step beam */}
        <section id="process" className="scroll-reveal py-14">
          <SectionHeader
            eyebrow="Process"
            title="How we work"
            intro="Five steps, no mystery. You always know what happens next and what it costs."
          />
          <ol className="relative mt-10 grid list-none gap-8 lg:grid-cols-5 lg:gap-4">
            <span
              aria-hidden="true"
              className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-[var(--brand)] via-[var(--accent)] to-transparent lg:hidden"
            />
            <span
              aria-hidden="true"
              className="absolute left-0 right-0 top-4 hidden h-px bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-transparent lg:block"
            />
            {process.map((s) => (
              <li key={s.step} className="reveal-blur relative pl-12 lg:pl-0 lg:pt-12">
                <span className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-full border border-[var(--accent)]/50 bg-[#04203a] text-xs font-bold text-[var(--accent-2)]">
                  {s.step}
                </span>
                <h3 className="font-display font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{s.blurb}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 7. OUR WORK — honest empty state, no fake items */}
        <section id="work" className="scroll-reveal py-14">
          <SectionHeader eyebrow="Proof" title="Our work" />
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--card-border)] bg-[rgba(6,27,54,0.3)] p-6 sm:p-8">
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              Our first client projects are on the way. They will appear here once they ship, with each client&apos;s
              written permission — no placeholders, no borrowed screenshots.
            </p>
            <Link href="/our-work" className={`mt-4 ${cardLink}`}>
              See our work <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 8. LEARN */}
        <section id="learn" className="scroll-reveal py-14">
          <SectionHeader
            eyebrow="Free lessons"
            title="Learn with us"
            intro="What we learn while working on real projects, published free for anyone."
          />
          {posts.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {posts.slice(0, 3).map((p) => (
                <div key={p.slug} className="motion-card glass p-5">
                  <p className="text-xs uppercase tracking-widest text-[var(--accent)]">{p.category}</p>
                  <h3 className="mt-1 font-display font-semibold">{p.title}</h3>
                  <Link href={`/learn/blog/${p.slug}`} className={`mt-3 ${cardLink}`}>
                    Read <span aria-hidden="true">→</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              Our first lessons are on the way. Meanwhile, subscribe on YouTube and Instagram to catch them as they land.
            </p>
          )}
          {site.youtubeUrl && (
            <a href={site.youtubeUrl} className="btn btn-ghost mt-6" rel="noopener noreferrer" target="_blank">
              Subscribe on YouTube
            </a>
          )}
        </section>

        {/* 9. FAQ */}
        <section id="faq" className="scroll-reveal py-14">
          <SectionHeader eyebrow="FAQ" title="Questions people ask" />
          <div className="mt-8 divide-y divide-[var(--card-border)] rounded-2xl border border-[var(--card-border)]">
            {faqs.map((f) => (
              <details key={f.question} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-white marker:hidden">{f.question}</summary>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.answer}</p>
              </details>
            ))}
          </div>
          <JsonLd data={faqSchema(faqs)} />
        </section>

        {/* 10. FINAL CTA */}
        <section className="scroll-reveal pb-8 pt-6">
          <div className="glass relative overflow-hidden px-6 py-12 text-center">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-[var(--brand-2)] opacity-25 blur-3xl"
            />
            <div className="relative flex flex-col items-center gap-4">
              <ArrowMotif className="parallax-drift h-12 w-12" />
              <h2 className="max-w-2xl font-display text-2xl font-bold sm:text-3xl">
                Not sure where your business is losing customers online?{" "}
                <GradientHeading>We&apos;ll look for free.</GradientHeading>
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                Send us one link — your Instagram, Google profile or website — and you get a short written review with 3
                to 5 practical suggestions. Free, no obligation.
              </p>
              <Link href="/audit" className="btn btn-primary mt-2">
                Get a Free Audit
              </Link>
            </div>
          </div>
        </section>

        <NextUp
          title="See what each service includes"
          href="/services"
          cta="Explore services"
          eyebrow="Keep going"
        >
          Clear inclusions, honest limits, and what we need from you before work starts.
        </NextUp>
      </Container>
    </>
  );
}
