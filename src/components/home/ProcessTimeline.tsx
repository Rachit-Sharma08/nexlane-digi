"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Step = { step: string; title: string; blurb: string };

const FOLIO_W = 38;
const FOLIO_H = 30;
const STEP_MS = 520;
// Final resting gap past the last node (clears the 32px node + folio half), so
// the folio is visible at rest instead of hidden behind the opaque final node.
const FINAL_GAP = 44;

/** Per-step decorative icon drawn inside the folio (no text, no numbers). */
function FolioGlyph({ active }: { active: number }) {
  switch (active) {
    case 0:
      // Talk — note lines + a small speech tab.
      return (
        <>
          <path d="M9 10h18M9 15h13M9 20h16" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M22 6h5a2 2 0 0 1 2 2v3h-7z" fill="var(--accent)" opacity="0.85" />
        </>
      );
    case 1:
      // Plan — three empty checklist boxes.
      return (
        <>
          <rect x="9" y="8" width="7" height="7" rx="1.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="9" y="16" width="7" height="7" rx="1.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="18" y="12" width="7" height="7" rx="1.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        </>
      );
    case 2:
      // Build — page blocks assembling.
      return (
        <>
          <rect x="8" y="7" width="22" height="17" rx="2" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
          <rect x="11" y="10" width="8" height="4" rx="1" fill="var(--accent)" opacity="0.85" />
          <rect x="11" y="16" width="16" height="4" rx="1" fill="var(--accent-2)" opacity="0.85" />
        </>
      );
    case 3:
      // Review — same checklist, checked one by one.
      return (
        <>
          <rect x="9" y="8" width="7" height="7" rx="1.5" fill="var(--accent)" />
          <path className="pf-check" style={{ animationDelay: "0ms" }} d="M10.5 11.4l1.6 1.6 3-3.2" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="9" y="16" width="7" height="7" rx="1.5" fill="var(--accent)" />
          <path className="pf-check" style={{ animationDelay: "140ms" }} d="M10.5 19.4l1.6 1.6 3-3.2" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="18" y="12" width="7" height="7" rx="1.5" fill="var(--accent)" />
          <path className="pf-check" style={{ animationDelay: "280ms" }} d="M19.5 15.4l1.6 1.6 3-3.2" stroke="var(--bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    default:
      // Launch — handoff arrow passing into a bracket (no rocket).
      return (
        <>
          <path d="M23 8h5v14h-5" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 15h13M17 11l4 4-4 4" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
  }
}

export default function ProcessTimeline({ items }: { items: Step[] }) {
  const olRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    const nodes = Array.from(ol.querySelectorAll<HTMLElement>(".process-node"));

    // Measure node centers with layout offsets (offsetLeft/Top), not
    // getBoundingClientRect: the .reveal-blur entry animation translates the
    // <li> by 30px while it is still entering, and a rect-based read would
    // capture that transform and leave the folio 30px off. Offsets ignore
    // transforms, so the folio stays locked to the real node centers.
    const measure = () => {
      const centers = nodes.map((n) => {
        let x = 0;
        let y = 0;
        let el: HTMLElement | null = n;
        while (el && el !== ol) {
          x += el.offsetLeft;
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return { x: x + n.offsetWidth / 2, y: y + n.offsetHeight / 2 };
      });
      if (centers.length >= 2) {
        const horiz = Math.abs(centers[1].x - centers[0].x) >= Math.abs(centers[1].y - centers[0].y);
        const last = centers[centers.length - 1];
        centers.push(horiz ? { x: last.x + FINAL_GAP, y: last.y } : { x: last.x, y: last.y + FINAL_GAP });
      } else if (centers.length === 1) {
        centers.push({ x: centers[0].x, y: centers[0].y + FINAL_GAP });
      }
      setPositions(centers);
    };
    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(ol);

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Reduced motion: no travel — show the full line, all text and the folio
    // parked just past the final node (transition is disabled in globals.css).
    if (reducedQuery.matches) {
      const id = window.setTimeout(() => setActive(nodes.length), 0);
      return () => {
        window.clearTimeout(id);
        ro.disconnect();
      };
    }

    let cancelled = false;
    let timers: number[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(resolve, ms);
        timers.push(id);
      });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          void (async () => {
            // Visit each node center, then hand off just past the final node.
            for (let i = 0; i <= nodes.length; i += 1) {
              if (cancelled) return;
              setActive(i);
              if (i < nodes.length) await sleep(STEP_MS);
            }
          })();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(ol);

    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
    };
  }, [items.length]);

  const pos = active >= 0 ? positions[active] ?? null : null;
  const style: CSSProperties = pos
    ? {
        transform: `translate(${pos.x - FOLIO_W / 2}px, ${pos.y - FOLIO_H / 2}px)`,
        opacity: 1,
      }
    : { opacity: 0 };

  return (
    <div className="relative mt-10">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-4 top-2 w-px bg-gradient-to-b from-[var(--brand)] via-[var(--accent)] to-transparent lg:hidden"
      />
      <span
        aria-hidden="true"
        className="absolute left-0 right-0 top-4 hidden h-px bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-transparent lg:block"
      />

      <ol ref={olRef} className="relative grid list-none gap-8 lg:grid-cols-5 lg:gap-4">
        {items.map((s) => (
          <li key={s.step} className="reveal-blur relative z-20 pl-12 lg:pl-0 lg:pt-12">
            <span className="process-node absolute left-0 top-0 z-20 grid h-8 w-8 place-items-center rounded-full border border-[var(--accent-2)]/50 bg-[var(--surface-1)] text-xs font-bold text-[var(--accent-2)]">
              {s.step}
            </span>
            <h3 className="font-display font-semibold text-[var(--text)]">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{s.blurb}</p>
          </li>
        ))}
      </ol>

      {/* Decorative relay folio — travels once along the line, docks at each
          node (nodes render above it, so numbers stay readable), then rests
          just past the final node. */}
      <div aria-hidden="true" className="process-folio pointer-events-none absolute left-0 top-0 z-10" style={style}>
        <svg width={FOLIO_W} height={FOLIO_H} viewBox={`0 0 ${FOLIO_W} ${FOLIO_H}`} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="1" width={FOLIO_W - 2} height={FOLIO_H - 2} rx="4" stroke="var(--brand)" strokeWidth="2" fill="var(--bg)" />
          {active >= 0 && <FolioGlyph active={active} />}
        </svg>
      </div>
    </div>
  );
}
