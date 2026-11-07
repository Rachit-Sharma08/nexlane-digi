import Link from "next/link";

/** End-of-page signpost so no page is a dead end (AGENTS.md §7.7). */
export default function NextUp({
  title,
  href,
  cta,
  eyebrow = "Next up",
  children,
}: {
  title: string;
  href: string;
  cta: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="pb-20">
      <div className="glass flex flex-col gap-4 p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">{eyebrow}</p>
          <h2 className="mt-1 font-display text-xl font-semibold">{title}</h2>
          {children && <p className="mt-1 text-sm text-[var(--muted)]">{children}</p>}
        </div>
        <Link href={href} className="btn btn-ghost shrink-0">
          {cta} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
