"use client";

import dynamic from "next/dynamic";
import { Component } from "react";

const Canvas = dynamic(() => import("./HeroCanvas"), { ssr: false, loading: () => null });

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

/** Loaded only when the visitor is on the high tier, so three.js stays off the initial bundle. */
export default function HeroCanvasLoader({ fallback }: { fallback: React.ReactNode }) {
  return (
    <CanvasBoundary fallback={fallback}>
      <Canvas />
    </CanvasBoundary>
  );
}
