# Nexlane Digital — Design & Animation Log

Living document. Every animation, motion, or visual polish we add to the site is recorded here, so we don't lose track across sessions.

## Rules (never break)

- Respect `prefers-reduced-motion` — all motion must be disabled or reduced when the user asks for less motion.
- Mobile first (360px minimum). No motion that causes layout shift or jank on low-end phones.
- Performance: no heavy JS animation libraries unless needed. Prefer CSS + `requestAnimationFrame`. Keep Lighthouse performance ≥ 90.
- Animations enhance, never block content. Core content must be readable with JS off.
- Brand tokens only: Forest & Sage palette from `AGENTS.md` §3. Contrast ≥ 4.5:1.
- External motion libs: none installed yet. Add only when a real need exists (no "for later" installs).

## Visual direction

- Preserve the approved Forest & Sage editorial identity. Use brand glows sparingly; avoid generic purple gradients, stock dashboard cards, and ornamental all-caps labels.
- The site represents a small, direct local-business studio. Keep claims honest; do not invent clients, metrics, or awards.
- Preserve responsive layouts, clear hierarchy, and accessible focus states. Motion should not delay reading or navigation.
- Use the shared inline SVG `BrandMark` for the current filled N mark. Obsolete PNG logo assets were removed; keep the wordmark as HTML text.

## Motion decisions

- Focal moment: a short, one-time hero entrance on page load.
- Continuity: gentle section entry linked to scrolling with CSS scroll-driven animation where supported, plus a thin reading progress bar and back-to-top action.
- Feedback: glass cards lift on hover, buttons acknowledge press, nav links get a Forest & Sage gradient underline and active route state, accordions reveal answers, and the mobile menu opens with a short transition.
- Budget: CSS only; no new animation dependency or continuously running canvas. Effects use transform/opacity where practical and respect `prefers-reduced-motion`.
- Magic UI's official MCP server is enabled in `opencode.json`; the existing shadcn MCP can also resolve the Magic UI registry configured in `components.json`.
- Ponytail 5.3.3 is installed as a Codex plugin. Restart Codex/new thread is needed for plugin hooks to become active; its lean-change rules were read and followed for this pass.

## What we may animate (backlog)

- [x] Hero section entrance (fade + slide-up on load)
- [x] Navbar active-route state and link hover sweep
- [x] Section reveal on scroll (subtle opacity/translate, progressive enhancement)
- [x] Glass cards: subtle hover lift + glow
- [x] Buttons: hover/press micro-interactions
- [x] Page transitions (short React ViewTransition fade; progressive enhancement)
- [x] Nexlane logo mark is used consistently in the navbar and footer; hero artwork has restrained orbit motion
- [x] Reading progress indicator and back-to-top control
- [x] 404 page inherits shared section/card entrance and interaction styling

## Change log

| Date | Page/Component | What changed | Notes |
|---|---|---|---|
| 2026-11-05 | — | `design.md` created | Tracking doc for all motion work |

| 2026-11-05 | Home + shared UI | Added hero entrance, scroll-linked section motion, glass-card hover feedback, and button press feedback | CSS only; reduced-motion path included |
| 2026-11-05 | Navbar + project tooling | Added supplied Nexlane logo assets and enabled official Magic UI MCP for OpenCode | Full logo retained; cropped mark used in compact nav |
| 2026-11-06 | All pages + shared chrome | Added scroll progress, back-to-top, active nav/link feedback, accordion/menu transitions, hero logo motion, and mobile grid shrink fix | Desktop preview inspected; phone screenshot checked; reduced-motion support maintained |
| 2026-11-06 | Route navigation | Added a short React ViewTransition fade for client-side route changes | Confirmed a client-side About click starts the transition in Chrome; reduced-motion disables it; unsupported browsers navigate normally |
| 2026-11-06 | Home hero mobile layout | Constrained the hero grid to the viewport width | Verified at a 390px CSS viewport; document width stayed 390px with no horizontal overflow |
| 2026-11-07 | Chat widget | Moved the chat FAB to the bottom-right (owner correction) and replaced the avatar with a CSS-3D robot mascot (antenna, ears, visor eyes with blink + typing eye-scan); FAB restyled dark glass + cyan rim; panel now opens from the bottom-right corner; WhatsApp float raised to `bottom-36` | CSS 3D only — WebGL stays hero-only (§11.2); robot animations static on the low tier and under reduced motion; verified at 1440/360, build 21 routes, 0 console errors |

## Decisions

- Keep reveals as progressive enhancement: content remains visible without scroll-timeline support.
- Prefer one authored entrance over repeating entrance effects on every card.
