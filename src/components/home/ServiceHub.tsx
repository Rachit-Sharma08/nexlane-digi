import { CampaignScene, GameScene, SeoScene, WebScene } from "@/components/motion/scenes";
import { MARK_VIEWBOX, N_PATH } from "@/components/BrandMark";

/**
 * Home hero visual: one central N with four labeled service scenes around
 * it (Forest & Sage reference). CSS grid — the N owns its own cell, so the
 * scenes can never overlap it at any width. Pure CSS/SVG, no WebGL, no JS.
 * Static base state; motion layers on for mid/high, off for low tier and
 * prefers-reduced-motion (see globals.css).
 */
export default function ServiceHub() {
  return (
    <div
      className="hub scene-stage anim"
      role="group"
      aria-label="Four Nexlane service scenes around the Nexlane N"
    >
      <div className="hub-core">
        <svg className="hub-mark" viewBox={MARK_VIEWBOX} role="img" aria-label="Nexlane N">
          {/* The outer signal ring stays decorative; the N shares BrandMark geometry. */}
          <circle className="hub-ring-line" cx="100" cy="100" r="94" />
          <path d={N_PATH} fill="var(--brand)" fillRule="evenodd" />
        </svg>
      </div>

      <figure className="hub-scene c1" style={{ "--d": "0s" } as React.CSSProperties}>
        <WebScene />
        <figcaption>
          <b>Website build</b>
          <span>A page assembles block by block.</span>
        </figcaption>
      </figure>

      <figure className="hub-scene c2" style={{ "--d": "0.6s" } as React.CSSProperties}>
        <SeoScene />
        <figcaption>
          <b>SEO scan</b>
          <span>A lens reads the page and marks each line.</span>
        </figcaption>
      </figure>

      <figure className="hub-scene c3" style={{ "--d": "1.2s" } as React.CSSProperties}>
        <CampaignScene />
        <figcaption>
          <b>Campaign pulse</b>
          <span>A megaphone sends pulses to an audience.</span>
        </figcaption>
      </figure>

      <figure className="hub-scene c4" style={{ "--d": "1.8s" } as React.CSSProperties}>
        <GameScene />
        <figcaption>
          <b>Game hop</b>
          <span>A tiny browser-game block hops to the flag.</span>
        </figcaption>
      </figure>

      <i className="hub-rail u" aria-hidden="true" />
      <i className="hub-rail d" aria-hidden="true" />
      <i className="hub-link l u" aria-hidden="true" />
      <i className="hub-link r u" aria-hidden="true" />
      <i className="hub-link l d" aria-hidden="true" />
      <i className="hub-link r d" aria-hidden="true" />
    </div>
  );
}
