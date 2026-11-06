import { ArrowMotif } from "./ArrowMotif";

/** Simple reusable building blocks (section, card, gradient heading). */

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-reveal mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 ${className}`}>
      {children}
    </section>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--accent)]" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[var(--accent)] to-transparent" aria-hidden="true" />
    </div>
  );
}

export function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`glass motion-card p-6 ${className}`}>{children}</div>;
}

export function GradientHeading({ children }: { children: React.ReactNode }) {
  return <span className="text-gradient">{children}</span>;
}

/** Small paragraph used as section intro/body copy. */
export function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-[var(--muted)] leading-relaxed">{children}</p>;
}

export { ArrowMotif };
