/**
 * Inline Forest & Sage mark from the approved homepage artifact.
 * SVG only, palette tokens only.
 * Decorative by default (the surrounding link carries the label).
 */
export default function BrandMark({
  size = 32,
  ariaLabel,
  className = "",
}: {
  size?: number;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role={ariaLabel ? "img" : undefined}
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
      focusable="false"
    >
      <circle cx="100" cy="100" r="74" fill="var(--brand)" />
      <path d="M64 138V62H84L116 108V62H136V138H116L84 92V138Z" fill="var(--bg)" />
    </svg>
  );
}
