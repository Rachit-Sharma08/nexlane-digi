"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useEffect, useState } from "react";
import { useQuality } from "@/lib/quality";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false, loading: () => null });

/** If WebGL throws, keep the static stage instead of an empty box. */
class CanvasBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

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
 * Hero visual slot. The WebGL scene loads after first paint and only on the
 * high tier; everyone else, and any WebGL failure, gets the CSS stage.
 */
export default function HeroVisual() {
  const quality = useQuality();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Let the H1 and CTA paint first, then load three.js.
    const idle = window.requestIdleCallback?.bind(window);
    if (idle) {
      const id = idle(() => setReady(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timer = window.setTimeout(() => setReady(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="hero-stage hero-arrive" aria-hidden="true">
      <span className="hero-stage-glow" />
      <span className="hero-stage-grid" />
      {ready && quality === "high" ? (
        <CanvasBoundary fallback={<StaticStage />}>
          <HeroCanvas />
        </CanvasBoundary>
      ) : (
        <StaticStage />
      )}
    </div>
  );
}
