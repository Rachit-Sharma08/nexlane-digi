import type { Metadata, Viewport } from "next";
import { Anton, Inter, Sora } from "next/font/google";
import { site } from "@/config/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollControls from "@/components/ScrollControls";
import ChatbotLoader from "@/components/ChatbotLoader";
import RouteTransition from "@/components/RouteTransition";
import JsonLd from "@/components/JsonLd";
import AppProviders from "@/components/AppProviders";
import { buildMetadata, organizationSchema, websiteSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
// Hero headline only (AGENTS §13). Anton ships a single 400 weight.
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });

const layoutMeta = buildMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
});

export const metadata: Metadata = {
  ...layoutMeta,
  metadataBase: new URL(site.SITE_URL),
  title: {
    // ≤60 chars; only a fallback — every page sets its own absolute title.
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  authors: [{ name: site.name }],
  ...(site.googleVerification ? { verification: { google: site.googleVerification } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#E5E8CE",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-quality on the server = first paint is already the cheap low tier
    // (AGENTS §11.1); QualityProvider upgrades it after hydration.
    <html
      lang="en-IN"
      data-quality="low"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sora.variable} ${anton.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-[var(--brand)] focus:px-3 focus:py-2 focus:text-[var(--bg)]"
        >
          Skip to content
        </a>
        <AppProviders>
          <Navbar />
          <main id="main"><RouteTransition>{children}</RouteTransition></main>
          <Footer />
          <WhatsAppFloat />
          <ScrollControls />
          <ChatbotLoader />
          <JsonLd data={organizationSchema()} />
          <JsonLd data={websiteSchema()} />
        </AppProviders>
      </body>
    </html>
  );
}