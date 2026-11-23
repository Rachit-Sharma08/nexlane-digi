import { readFileSync } from "node:fs";
import { ImageResponse } from "next/og";

/* eslint-disable @next/next/no-img-element -- <img> is required inside next/og ImageResponse */

// Site-wide OG image (AGENTS §12.9): brand gradient + the logo mark.
// Inlined as a PNG data URL: next/og fetches images at build time, where no
// server or absolute URL is available, and its renderer decodes PNG reliably
// (webp was silently dropped).
const mark = `data:image/png;base64,${readFileSync("src/app/og-mark.png").toString("base64")}`;

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
          background: "linear-gradient(135deg, #E5E8CE 0%, #D6DAB4 55%, #CDD3AC 100%)",
          color: "#16220F",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* brand gradient bar (forest → sage) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            background: "linear-gradient(90deg, #1F3A24, #2F4A28, #3F5E36)",
          }}
        />
        <img
          src={mark}
          width={220}
          height={220}
          alt=""
          style={{ marginBottom: 28, borderRadius: 20 }}
        />
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>Nexlane Digital</div>
        <div style={{ fontSize: 40, color: "#46543A", marginTop: 20 }}>
          Websites, SEO and growth for businesses in Haryana and abroad
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 30,
            fontWeight: 600,
            color: "#16220F",
            border: "2px solid #1F3A24",
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
