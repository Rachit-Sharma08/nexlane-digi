/**
 * Large rising-arrow motif (SVG) used in the hero and dividers.
 * Pure vector, no assets needed. Decorative: aria-hidden.
 */
export function ArrowMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="nx-arrow" x1="0" y1="120" x2="120" y2="0">
          <stop offset="0%" stopColor="var(--brand)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
      <path
        d="M30 96 V 30 L 90 88 V 24"
        stroke="url(#nx-arrow)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M70 24 h20 v20" stroke="url(#nx-arrow)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Glowing "N" navbar mark placeholder until the real logo files land. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return <ArrowMotif className={className} />;
}
