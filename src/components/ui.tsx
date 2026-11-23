/** Simple reusable building blocks (container, section, card, gradient heading). */

export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
  );
}

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
    <section id={id} className={`scroll-reveal w-full py-16 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-8 mt-12 flex items-center gap-4">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--accent)]" aria-hidden="true" />
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{children}</h2>
      <span className="h-px flex-1 bg-gradient-to-r from-[var(--accent)] to-transparent" aria-hidden="true" />
    </div>
  );
}

export function GlassCard({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return <div id={id} className={`glass motion-card scroll-mt-24 p-6 ${className}`}>{children}</div>;
}

export function GradientHeading({ children }: { children: React.ReactNode }) {
  return <span className="text-gradient">{children}</span>;
}

/** Uppercase label above every H1 (e.g. "ABOUT · FOUNDERS"). */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[var(--accent)]">
      {children}
    </p>
  );
}

/** Eyebrow + section title + intro, used for every long-page section. */
export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p>
      )}
      <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
      {intro && <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{intro}</p>}
    </div>
  );
}

/** Small paragraph used as section intro/body copy. */
export function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-[var(--muted)] leading-relaxed">{children}</p>;
}
