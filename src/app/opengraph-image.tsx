import { ImageResponse } from "next/og";

// Site-wide OG image (AGENTS §12.9): text + brand gradient, no logo file.
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
          background: "linear-gradient(135deg, #000D1D 0%, #003D66 55%, #015798 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* brand gradient bar (#0572F5 → #1ED3F2 → #7CF4EF) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "linear-gradient(90deg, #0572F5, #1ED3F2, #7CF4EF)",
          }}
        />
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>Nexlane Digital</div>
        <div style={{ fontSize: 40, color: "#9FB3C8", marginTop: 20 }}>
          Websites, SEO and growth for local businesses
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 30,
            fontWeight: 600,
            color: "#7CF4EF",
            border: "2px solid #1ED3F2",
            borderRadius: 999,
            padding: "10px 36px",
          }}
        >
          Kaithal, Haryana
        </div>
      </div>
    ),
    { ...size },
  );
}
