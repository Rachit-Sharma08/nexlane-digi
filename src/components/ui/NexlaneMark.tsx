/* @jsxImportSource react */
"use client";

import { useEffect, useRef } from "react";

/**
 * Inline SVG logo: N + rising arrow,
 * frost-white N text, lime arrow tip,
 * no background box. Used as a replace
 * for public/brand/nexlane-mark.png.
 */

// Named export used by Footer, Navbar, HeroVisual
export function NexlaneMarkSVG({
  width = 120,
  height = 120,
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    // Ensure the SVG preserves its aspect ratio and viewBox
    if (svgRef.current) {
      svgRef.current.setAttribute("viewBox", "0 0 380 257");
      svgRef.current.setAttribute("width", String(width));
      svgRef.current.setAttribute("height", String(height));
      svgRef.current.setAttribute("fill", "none");
    }
  }, [width, height]);

  return (
    <svg
      ref={svgRef}
      className="block"
      viewBox="0 0 380 257"
      width={width}
      height={height}
      fill="none"
      aria-label="Nexlane mark: N with rising arrow"
    >
      {/* N letter: frost white (#F5F3EF) */}
      <text
        x={"50%"}
        y={"50%"}
        dominantBaseline="middle"
        textAnchor="middle"
        font-family: Arial
        font-weight="400"
        font-size="180"
        fill="#F5F3EF"
        transform="translate(-50% -20%)"
      >
        N
      </text>

      {/* Rising arrow: lime (#C8FF2E) with white tip */}
      <polygon
        points="190,25 150,210 230,210"
        fill="#C8FF2E"
        stroke="#F5F3EF"
        stroke-width="2"
      />
    </svg>
  );
}

// Re-export as NexlaneMark for backward compatibility with imports
export const NexlaneMark = NexlaneMarkSVG;

// Large version alias used by HeroVisual
export const NexlaneMarkLarge = NexlaneMarkSVG;