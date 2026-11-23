import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Motion preview — Nexlane Digital" },
  description: "Preview of the CSS/SVG scene animations used on the site. Not indexed.",
  robots: { index: false, follow: false },
};

import MotionPreview from "@/components/motion/MotionPreview";

export default function MotionPreviewPage() {
  return <MotionPreview />;
}