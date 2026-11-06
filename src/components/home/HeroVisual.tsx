"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuality } from "@/lib/quality";

type LoaderProps = { fallback: React.ReactNode };
type LoaderComponent = React.ComponentType<LoaderProps>;

function StaticStage() {
  return (
    <>
      <span className="hero-css-lanes" aria-hidden="true" />
      <span className="hero-stage-mark">
        <Image
          src="/nexlane-mark.png"
          alt=""
          width={400}
          height={285}
          priority
          className="logo-blend h-24 w-auto object-contain mix-blend-screen sm:h-28"
        />
      </span>
      <span className="hero-orbit hero-orbit-one" aria-hidden="true" />
      <span className="hero-orbit hero-orbit-two" aria-hidden="true" />
    </>
  );
}

/**
 * Hero visual slot. three.js is imported at runtime only on the high tier,
 * so low/mid visitors never download the WebGL chunk.
 */
export default function HeroVisual() {
  const quality = useQuality();
  const [ready, setReady] = useState(false);
  const [Loader, setLoader] = useState<LoaderComponent | null>(null);

  useEffect(() => {
    const idle = window.requestIdleCallback?.bind(window);
    if (idle) {
      const id = idle(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setReady(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || quality !== "high" || Loader) return;
    let cancelled = false;
    import("./HeroCanvasLoader").then((mod) => {
      if (!cancelled) setLoader(() => mod.default as LoaderComponent);
    });
    return () => {
      cancelled = true;
    };
  }, [ready, quality, Loader]);

  return (
    <div className="hero-stage hero-arrive" aria-hidden="true">
      <span className="hero-stage-glow" />
      <span className="hero-stage-grid" />
      {ready && quality === "high" && Loader ? (
        <Loader fallback={<StaticStage />} />
      ) : (
        <StaticStage />
      )}
    </div>
  );
}
