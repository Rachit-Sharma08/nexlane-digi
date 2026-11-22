import { ImageResponse } from "next/og";

// Site-wide OG image (AGENTS §12.9): dark navy background + lime accent + inline SVG mark.
// Uses only CSS gradients and inline SVG — no external assets.

export const alt = "Nexlane Digital — digital marketing agency in Kaithal, Haryana";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0B0A 0%, #141615 55%, #0F100F 100%)",
          color: "#F5F3EF",
          fontFamily: "Anton, sans-serif",
          position: "relative",
        }}
      >
        {/* lime accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "linear-gradient(90deg, #C8FF2E, #8FCC00)",
          }}
        />
        {/* SVG mark as JSX */}
        <svg
          viewBox="0 0 380 257"
          width="260"
          height="176"
          style={{ marginBottom: 28, borderRadius: 20 }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="limeArrow" x1="0" y1="257" x2="0" y2="0">
              <stop offset="0%" stopColor="#C8FF2E" />
              <stop offset="100%" stopColor="#8FCC00" />
            </linearGradient>
          </defs>
          {/* N letter as thick stroke */}
          <path
            d="M20,15 L20,242 M20,242 L360,15 M360,15 L360,242"
            stroke="#F5F3EF"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Rising arrow tip */}
          <path d="M190,15 L170,55 L210,55 Z" fill="url(#limeArrow)" />
        </svg>
        <div style={{ fontSize: 96, fontWeight: 400, letterSpacing: -2, lineHeight: 1.1 }}>Nexlane Digital</div>
        <div style={{ fontSize: 40, color: "#9A9E97", marginTop: 20, fontFamily: "Inter, sans-serif", fontWeight: 400 }}>
          Websites, SEO and growth for businesses in Haryana and abroad
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 30,
            fontWeight: 600,
            color: "#C8FF2E",
            border: "2px solid #C8FF2E",
            borderRadius: 999,
            padding: "10px 36px",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Kaithal, Haryana
        </div>
      </div>
    ),
    { ...size },
  );
}