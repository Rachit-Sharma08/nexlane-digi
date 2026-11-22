"use client";

import { useEffect, useRef, useState } from "react";
import { useQuality } from "@/lib/quality";
import { NexlaneMarkLarge } from "@/components/ui/NexlaneMark";

type LoaderProps = { fallback: React.ReactNode };
type LoaderComponent = React.ComponentType<LoaderProps>;

/**
 * Our own N mark with CSS depth (AGENTS §13). Mid tier tilts toward the
 * pointer; low tier and reduced motion stay static.
 */
function StaticMark() {
  const quality = useQuality();
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scene.current;
    if (!node || quality !== "mid") return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        node.style.setProperty("--hero-ry", `${x * 16}deg`);
        node.style.setProperty("--hero-rx", `${-y * 12}deg`);
      });
    };
    const reset = () => {
      node.style.setProperty("--hero-ry", "0deg");
      node.style.setProperty("--hero-rx", "0deg");
    };
    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", reset);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", reset);
    };
  }, [quality]);

  return (
    <div ref={scene} className="hero-mark-scene">
      <div className="hero-mark-tilt">
        <NexlaneMarkLarge className="hero-mark-svg" aria-hidden="true" />
      </div>
    </div>
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
      <span className="hero-glow-arc" />
      {ready && quality === "high" && Loader ? (
        <Loader fallback={<StaticMark />} />
      ) : (
        <StaticMark />
      )}
    </div>
  );
}
