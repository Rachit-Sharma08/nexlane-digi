import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import { site } from "@/config/site";
import { services, getService } from "@/content/services";
import { Container, SectionHeader, Eyebrow, Muted } from "@/components/ui";
import DepthCard from "@/components/DepthCard";
import SectionNav from "@/components/SectionNav";
import NextUp from "@/components/NextUp";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbSchema, serviceSchema, faqSchema } from "@/lib/seo";

// Generate static params for all services
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

// Generate metadata for each service page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return buildMetadata({
      title: "Service Not Found",
      description: "The service you are looking for does not exist.",
      path: `/services/${slug}`,
    });
  }
  return buildMetadata({
    title: service.metaTitle,
    description: service.description,
    path: `/services/${slug}`,
  });
}

const sections = [
  { id: "included", label: "What's included" },
  { id: "who-its-for", label: "Who it's for" },
  { id: "how-it-works", label: "How it works" },
  { id: "faq", label: "FAQ" },
  { id: "local", label: "Where we work" },
];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    notFound();
  }

  return (
    <>
      <Container className="pb-20 pt-12">
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${slug}` },
        ]} />
        <Eyebrow>Services · {service.name}</Eyebrow>
        <h1 className="font-display text-4xl font-bold sm:text-5xl">{service.name}</h1>
        {/* Answer-first lead: the block AI search quotes (AGENTS §12.11). */}
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">{service.summary}</p>
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

        <SectionNav items={sections} />

        <section id="included" className="scroll-reveal pt-4" aria-label="What's included">
          <SectionHeader eyebrow="What you get" title="What's included" />
          <div className="stagger grid gap-3 sm:grid-cols-2">
            {service.whatIsIncluded.map((item) => (
              <DepthCard key={item} glare className="flex items-start gap-3 p-5">
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-[var(--bg)]"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <p className="text-sm leading-relaxed text-[var(--muted)]">{item}</p>
              </DepthCard>
            ))}
          </div>
        </section>

        <section id="who-its-for" className="scroll-reveal pt-14" aria-label="Who it's for">
          <SectionHeader eyebrow="Right fit" title="Who it's for" />
          <DepthCard glare className="p-6 sm:p-7">
            <ul className="space-y-3">
              {service.whoItIsFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--muted)] sm:text-[0.95rem]">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </DepthCard>
        </section>

        <section id="how-it-works" className="scroll-reveal pt-14" aria-label="How it works">
          <SectionHeader eyebrow="Process" title="How it works" />
          {/* Real sequence → numbered rail with a connector line (AGENTS §11). */}
          <ol className="mt-2 space-y-6">
            {service.process.map((item, index) => (
              <li key={index} className="relative flex gap-4 sm:gap-5">
                <span
                  aria-hidden="true"
                  className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] text-[var(--bg)] text-sm font-bold shadow-[0_0_18px_rgba(200,255,46,0.35)]"
                >
                  {index + 1}
                </span>
                {index < service.process.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[18px] top-9 h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-[var(--accent)]/60 to-transparent"
                  />
                )}
                <p className="pt-1.5 text-sm leading-relaxed text-[var(--muted)] sm:text-[0.95rem]">{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="faq" className="scroll-reveal pt-14" aria-label="FAQ">
          <SectionHeader eyebrow="Questions" title="FAQ" />
          <div className="divide-y divide-[var(--card-border)] rounded-2xl border border-[var(--card-border)] bg-[rgba(6,27,54,0.35)]">
            {service.faqs.map((faq, index) => (
              <details key={index} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-white marker:hidden">
                  {faq.question}
                  <ChevronDown
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-[var(--accent)] transition-transform duration-300 group-open:rotate-180"
                  />
                </summary>
                <p className="mt-2 pr-8 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {service.localCopy && (
          <section id="local" className="scroll-reveal pt-14" aria-label="Where we work">
            <DepthCard glare className="p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold sm:text-2xl">
                For businesses in Kaithal, Haryana and beyond
              </h2>
              <div className="mt-4">
                <Muted>{service.localCopy}</Muted>
              </div>
              {/* Descriptive internal links between related service pages (AGENTS §12.11). */}
              <nav aria-label="Related services" className="mt-6 border-t border-[var(--card-border)] pt-5">
                <p className="text-sm text-[var(--muted)]">
                  Related services:{" "}
                  {services
                    .filter((s) => s.slug !== slug)
                    .map((s, i, others) => (
                      <span key={s.slug}>
                        {i > 0 && (i === others.length - 1 ? " and " : ", ")}
                        <Link
                          href={`/services/${s.slug}`}
                          className="underline hover:text-white"
                        >
                          {s.name.toLowerCase()}
                        </Link>
                      </span>
                    ))}
                </p>
              </nav>
            </DepthCard>
          </section>
        )}
      </Container>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: service.name, path: `/services/${slug}` },
      ])} />
      <JsonLd data={serviceSchema({
        name: service.name,
        description: service.description,
        path: `/services/${slug}`,
      })} />
      <JsonLd data={faqSchema(service.faqs)} />
      <NextUp title="Get a free audit of your site" href="/audit" cta="Get a Free Audit" eyebrow="Keep going" />
    </>
  );
}
