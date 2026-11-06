import type { NextConfig } from "next";

// Security headers. CSP is "strict with minimal opens": Next.js needs
// 'unsafe-inline' for its inline bootstrap scripts/styles without a nonce
// middleware. TODO: move to nonce-based CSP via middleware if we ever need it.
// Dev-only: React's dev mode calls eval() for debugging features, and without
// 'unsafe-eval' the Next.js dev badge reports a console error on every page.
// Production keeps the strict CSP — React never uses eval() there.
const devEval = process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : "";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  // Next.js injects tiny inline bootstrap/hydration scripts; no third-party JS allowed.
  `script-src 'self' 'unsafe-inline'${devEval} https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  // YouTube embeds (learn section) — only no-cookie domain.
  "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera, microphone and geolocation are not used on this site.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return [
      // Renamed in the IA restructure — permanent, keeps old links alive.
      { source: "/portfolio", destination: "/our-work", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
