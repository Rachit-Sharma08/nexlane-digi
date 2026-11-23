/**
 * Forest & Sage mark: a bold, custom N with an inset lane cut through its
 * diagonal. The cut is negative space inside one filled silhouette, not a
 * separate slash or detached glyph. The favicon uses the same N silhouette
 * without the fine cut so it stays clear at 16 px.
 */
export const N_PATH = "M32 20H72L128 116V20H168V180H128L72 84V180H32Z M80 74L88 69.4L128 138L120 142.6Z";
export const MARK_VIEWBOX = "0 0 200 200";

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
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role={ariaLabel ? "img" : undefined}
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
      focusable="false"
    >
      <path d={N_PATH} fill="var(--brand)" fillRule="evenodd" />
    </svg>
  );
}
