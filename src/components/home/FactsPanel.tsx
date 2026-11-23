"use client";

import { useEffect, useRef, type CSSProperties } from "react";

export default function FactsPanel({ facts }: { facts: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    )
      return;

    el.classList.add("is-waiting");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.4) {
            el.classList.remove("is-waiting");
            el.classList.add("is-active");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: [0.4] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="facts-panel relative overflow-hidden rounded-2xl border border-[var(--text)] bg-[var(--text)] text-[var(--bg)]"
    >
      <span className="facts-rail" aria-hidden="true" />
      <ul className="grid">
        {facts.map((fact, i) => (
          <li
            key={fact}
            className={`facts-row relative px-5 py-4 text-sm font-bold leading-snug ${
              i > 0 ? "border-t-2 border-[rgba(229,232,206,0.25)]" : ""
            }`}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="facts-marker" aria-hidden="true" />
            <span className="facts-tick" aria-hidden="true" />
            <span className="facts-copy">{fact}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
