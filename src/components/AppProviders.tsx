"use client";

import { QualityProvider } from "@/lib/quality";

/** Site-wide device quality preference. Motion is handled via CSS (see globals.css). */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return <QualityProvider>{children}</QualityProvider>;
}
