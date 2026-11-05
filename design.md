# Nexlane Digital — Design & Animation Log

Living document. Every animation, motion, or visual polish we add to the site is recorded here, so we don't lose track across sessions.

## Rules (never break)

- Respect `prefers-reduced-motion` — all motion must be disabled or reduced when the user asks for less motion.
- Mobile first (360px minimum). No motion that causes layout shift or jank on low-end phones.
- Performance: no heavy JS animation libraries unless needed. Prefer CSS + `requestAnimationFrame`. Keep Lighthouse performance ≥ 90.
- Animations enhance, never block content. Core content must be readable with JS off.
- Brand tokens only: gradient `#0572F5 → #1ED3F2 → #7CF4EF`, bg `#000D1D`, accent `#1ED3F2`. Contrast ≥ 4.5:1.
- External motion libs: none installed yet. Add only when a real need exists (no "for later" installs).

## What we may animate (backlog)

- [ ] Hero section entrance (fade + slide-up on load)
- [ ] Navbar: hide on scroll down, show on scroll up
- [ ] Section reveal on scroll (fade-in as sections enter viewport)
- [ ] Glass cards: subtle hover lift + glow
- [ ] Buttons: hover/press micro-interactions
- [ ] Page transitions (fade between routes) — optional, check perf first
- [ ] Arrow motif / logo mark subtle motion
- [ ] Learn/blog: reading progress indicator
- [ ] 404 page: playful but light animation

## Change log

| Date | Page/Component | What changed | Notes |
|---|---|---|---|
| 2026-11-05 | — | `design.md` created | Tracking doc for all motion work |

## Decisions

- (none yet)
