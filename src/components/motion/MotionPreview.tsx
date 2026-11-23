"use client";

import { useState } from "react";
import { CampaignScene, GameScene, SeoScene, WebScene } from "@/components/motion/scenes";

/**
 * Motion preview — internal QA page (not linked in nav or sitemap, noindex).
 * Each tile owns its own pause/replay control; remounting via key restarts
 * the CSS loops. Reduced motion turns the loops off globally (globals.css)
 * and the note below explains it.
 */

const tiles = [
  { id: "web", title: "Website build", desc: "Browser layers assemble.", Scene: WebScene },
  { id: "seo", title: "SEO scan", desc: "Lens scans and marks each line.", Scene: SeoScene },
  { id: "campaign", title: "Campaign pulse", desc: "Megaphone sends pulse arcs.", Scene: CampaignScene },
  { id: "game", title: "Game hop", desc: "Block hops across the stage.", Scene: GameScene },
];

function SceneTile({ title, desc, Scene }: (typeof tiles)[number]) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <figure className="hub-scene">
      <div key={run} className={`scene-stage anim ${paused ? "is-paused" : ""}`}>
        <Scene />
      </div>
      <figcaption>
        <b>{title}</b>
        <span>{desc}</span>
      </figcaption>
      <div className="flex gap-2 border-t-2 border-[var(--brand)] bg-[var(--bg)] px-4 py-3">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="min-h-11 rounded-full border border-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--surface)]"
        >
          {paused ? "Play" : "Pause"}
        </button>
        <button
          type="button"
          onClick={() => {
            setPaused(false);
            setRun((r) => r + 1);
          }}
          className="min-h-11 rounded-full border border-[var(--brand)] px-4 py-2 text-sm font-semibold text-[var(--brand)] hover:bg-[var(--surface)]"
        >
          Replay
        </button>
      </div>
    </figure>
  );
}

export default function MotionPreview() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <p className="hero-eyebrow">Internal · not linked from the site</p>
      <h1 className="hero-title">Motion preview</h1>
      <p className="mt-4 max-w-2xl text-[var(--muted)]">
        Each scene runs its own 6–8 second loop with isolated pause and replay controls. This page is for review only:
        it is not in the navigation or the sitemap.
      </p>
      <p className="rm-note mt-4 max-w-2xl rounded-xl border border-[var(--card-border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]">
        Your system prefers reduced motion, so every scene shows its complete static end state instead of looping.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {tiles.map((tile) => (
          <SceneTile key={tile.id} {...tile} />
        ))}
      </div>
    </div>
  );
}
