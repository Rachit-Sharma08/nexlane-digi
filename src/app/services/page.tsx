import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/content/services";
import { Muted, Section, Eyebrow } from "@/components/ui";
import DepthCard from "@/components/DepthCard";
import NextUp from "@/components/NextUp";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";

// Unique meta description for the overview page (per-page SEO rule).
const SERVICES_OVERVIEW_DESCRIPTION =
  "Nexlane Digital services in Kaithal, Haryana: digital marketing, SEO (including AEO and GEO), web development and browser games. Free audit, written scope.";

export const metadata: Metadata = buildMetadata({
  title: "Digital Marketing, SEO & Web Development | Nexlane Digital",
  description: SERVICES_OVERVIEW_DESCRIPTION,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Section>
        <Eyebrow>Services</Eyebrow>
        <h1 className="mb-8 font-display text-2xl font-semibold sm:text-3xl">What we can help with</h1>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <DepthCard key={service.slug} className="flex flex-col justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">{service.shortName}</h2>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{service.summary}</p>
              </div>
              <Link href={`/services/${service.slug}`} className="mt-4 text-sm font-semibold text-[var(--accent-2)] hover:text-white">
                Learn more →
              </Link>
            </DepthCard>
          ))}
        </div>
        <div className="mt-8">
          <Muted>Pricing is a custom quote after a free chat — we don&apos;t have fixed packages.</Muted>
        </div>
        <Link href="/audit" className="btn btn-primary mt-4">
          Get a Free Audit
        </Link>
      </Section>
      <NextUp title="See what each service includes" href="/services/web-development" cta="Open a service page" eyebrow="Keep going" />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ])} />
    </>
  );
}