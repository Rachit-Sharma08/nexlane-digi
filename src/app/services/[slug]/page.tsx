import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { services, getService } from "@/content/services";
import { Section, Muted, Eyebrow } from "@/components/ui";
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
    title: service.name,
    description: service.description,
    path: `/services/${slug}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    notFound();
  }

  return (
    <>
      {/* Hero Section */}
      <Section>
        <Breadcrumbs items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${slug}` },
        ]} />
        <Eyebrow>Services · {service.name}</Eyebrow>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">{service.name}</h1>
        <div className="mt-3">
          <Muted>{service.summary}</Muted>
        </div>
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">What&apos;s included</h2>
          <ul className="mt-2 list-disc pl-5">
            {service.whatIsIncluded.map((item, index) => (
              <li key={index} className="text-[var(--muted)] leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">Who it&apos;s for</h2>
          <ul className="mt-2 list-disc pl-5">
            {service.whoItIsFor.map((item, index) => (
              <li key={index} className="text-[var(--muted)] leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">How it works</h2>
          <ol className="mt-2 list-decimal pl-5">
            {service.process.map((item, index) => (
              <li key={index} className="text-[var(--muted)] leading-relaxed">{item}</li>
            ))}
          </ol>
        </div>
        <div className="mt-8">
          <h2 className="font-display text-lg font-semibold">FAQ</h2>
          <div className="divide-y divide-[var(--card-border)] rounded-2xl border border-[var(--card-border)] mt-2">
            {service.faqs.map((faq, index) => (
              <details key={index} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-white marker:hidden">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        {service.localCopy && (
          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold">For businesses in and around Kaithal</h2>
            <Muted>{service.localCopy}</Muted>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/audit" className="btn btn-primary">
            Free Audit
          </Link>
          {site.whatsappNumber && (
            <a className="btn btn-ghost" href={`https://wa.me/${site.whatsappNumber}`} rel="noopener noreferrer" target="_blank">
              Chat on WhatsApp
            </a>
          )}
        </div>
      </Section>
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