/**
 * The four hero service scenes (Forest & Sage reference, AGENTS §13).
 * Shared by the Home service hub and /motion-preview. Pure SVG in the four
 * palette colors; motion comes from the .scene-stage CSS in globals.css.
 * Base (unanimated) state = complete static end state.
 */

type SceneProps = { className?: string };

export function WebScene({ className = "" }: SceneProps) {
  return (
    <svg
      className={`sc ${className}`}
      viewBox="0 0 320 240"
      role="img"
      aria-label="A browser page assembling block by block"
    >
      <rect x="40" y="34" width="240" height="172" rx="10" className="fl o" />
      <path d="M40 60H280" className="o fn" />
      <circle cx="56" cy="47" r="4" className="ff" />
      <circle cx="70" cy="47" r="4" className="ff" />
      <circle cx="84" cy="47" r="4" className="ff" />
      <rect className="b ff" style={{ "--i": 0 } as React.CSSProperties} x="56" y="72" width="208" height="16" rx="4" />
      <rect className="b fd" style={{ "--i": 1 } as React.CSSProperties} x="56" y="96" width="120" height="44" rx="6" />
      <rect className="b fl" style={{ "--i": 1 } as React.CSSProperties} x="68" y="108" width="64" height="8" rx="4" />
      <rect className="b fl" style={{ "--i": 1 } as React.CSSProperties} x="68" y="124" width="40" height="8" rx="4" />
      <rect className="b fs o" style={{ "--i": 2 } as React.CSSProperties} x="184" y="96" width="80" height="44" rx="6" />
      <rect className="b fs o" style={{ "--i": 3 } as React.CSSProperties} x="56" y="148" width="64" height="44" rx="6" />
      <rect className="b fs o" style={{ "--i": 4 } as React.CSSProperties} x="128" y="148" width="64" height="44" rx="6" />
      <rect className="b fs o" style={{ "--i": 5 } as React.CSSProperties} x="200" y="148" width="64" height="44" rx="6" />
    </svg>
  );
}

export function SeoScene({ className = "" }: SceneProps) {
  return (
    <svg
      className={`sc ${className}`}
      viewBox="0 0 320 240"
      role="img"
      aria-label="A search lens scanning a page and marking each line it reads"
    >
      <rect x="96" y="30" width="128" height="180" rx="8" className="fl o" />
      <rect className="tx fs o" style={{ "--t": "0.8s" } as React.CSSProperties} x="112" y="52" width="96" height="10" rx="5" />
      <rect className="tx fs o" style={{ "--t": "1.5s" } as React.CSSProperties} x="112" y="76" width="80" height="10" rx="5" />
      <rect className="tx fs o" style={{ "--t": "2.4s" } as React.CSSProperties} x="112" y="100" width="96" height="10" rx="5" />
      <rect className="tx fs o" style={{ "--t": "3.3s" } as React.CSSProperties} x="112" y="124" width="64" height="10" rx="5" />
      <rect className="tx fs o" style={{ "--t": "4.1s" } as React.CSSProperties} x="112" y="148" width="88" height="10" rx="5" />
      <rect className="tx fs o" style={{ "--t": "4.7s" } as React.CSSProperties} x="112" y="172" width="72" height="10" rx="5" />
      <g className="lens">
        <circle cx="150" cy="60" r="30" className="sk" />
        <path d="M172 82L198 108" className="sk" style={{ strokeWidth: 7 }} />
      </g>
    </svg>
  );
}

export function CampaignScene({ className = "" }: SceneProps) {
  return (
    <svg
      className={`sc ${className}`}
      viewBox="0 0 320 240"
      role="img"
      aria-label="A megaphone sending pulses outward to an audience"
    >
      <g transform="translate(176 120)">
        <path className="pl" style={{ "--r": 1, "--i": 0 } as React.CSSProperties} d="M0-30A30 30 0 0 1 0 30" />
        <path className="pl" style={{ "--r": 1.9, "--i": 1 } as React.CSSProperties} d="M0-30A30 30 0 0 1 0 30" />
        <path className="pl" style={{ "--r": 2.8, "--i": 2 } as React.CSSProperties} d="M0-30A30 30 0 0 1 0 30" />
      </g>
      <path className="ff" d="M74 104H104L170 64V176L104 136H74Z" />
      <rect className="fd" x="84" y="136" width="18" height="38" rx="5" />
      <rect className="fd" x="166" y="60" width="10" height="120" rx="5" />
      <circle cx="278" cy="62" r="9" className="fs o" />
      <circle cx="292" cy="120" r="9" className="fs o" />
      <circle cx="278" cy="178" r="9" className="fs o" />
    </svg>
  );
}

export function GameScene({ className = "" }: SceneProps) {
  return (
    <svg
      className={`sc ${className}`}
      viewBox="0 0 320 240"
      role="img"
      aria-label="A tiny browser-game block hopping across a ground strip toward a flag"
    >
      <rect x="30" y="34" width="260" height="172" rx="10" className="fl o" />
      <rect x="44" y="160" width="232" height="34" rx="4" className="ff" />
      <circle cx="98" cy="78" r="7" className="fs o" />
      <circle cx="158" cy="78" r="7" className="fs o" />
      <circle cx="218" cy="78" r="7" className="fs o" />
      <rect className="fd" x="262" y="112" width="4" height="48" />
      <path className="ff" d="M266 112L284 120L266 128Z" />
      <g className="hx">
        <g className="hy">
          <rect className="fd" x="56" y="136" width="24" height="24" rx="5" />
          <rect className="fl" x="63" y="144" width="4" height="6" />
          <rect className="fl" x="71" y="144" width="4" height="6" />
        </g>
      </g>
    </svg>
  );
}
