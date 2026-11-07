"use client";

import { MotionConfig } from "motion/react";
import { QualityProvider } from "@/lib/quality";

/** One client boundary for site-wide motion + device quality preferences. */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QualityProvider>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </QualityProvider>
  );
}
