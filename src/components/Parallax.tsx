"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useQuality } from "@/lib/quality";

/**
 * Scroll-linked translation for background layers (AGENTS.md §11.3).
 * Transform only — no layout shift. Disabled entirely on the low tier.
 */
export default function Parallax({
  children,
  className = "",
  speed = 28,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const quality = useQuality();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={quality === "low" ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}
