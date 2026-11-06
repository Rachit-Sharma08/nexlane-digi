"use client";

import { useRef } from "react";
import { useQuality } from "@/lib/quality";

/**
 * Glass card with a small pointer tilt toward the cursor (AGENTS.md §11.3).
 * Low tier and touch pointers keep the static layered card — no 3D.
 */
export default function DepthCard({
  id,
  children,
  className = "",
  glare = false,
  max = 6,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  glare?: boolean;
  max?: number;
}) {
  const quality = useQuality();
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (quality === "low" || event.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--depth-rx", `${(-y * max).toFixed(2)}deg`);
    el.style.setProperty("--depth-ry", `${(x * max).toFixed(2)}deg`);
    el.style.setProperty("--depth-mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--depth-my", `${((y + 0.5) * 100).toFixed(1)}%`);
  }

  function reset() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--depth-rx", "0deg");
    el.style.setProperty("--depth-ry", "0deg");
  }

  return (
    <div className="depth-scene">
      <div
        id={id}
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        className={`depth-card glass motion-card scroll-mt-28 ${glare ? "depth-glare" : ""} ${className}`}
      >
        {children}
      </div>
    </div>
  );
}
