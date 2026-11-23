# Plan — Forest & Sage redesign (feat/hero-v3, PR #15)

Base verified: clean `feat/hero-v3` @ 9f46a78 == origin. Never touch main. No push/PR/commit.

## Branch decisions (record in PROGRESS)
- design-system / home-redesign / pages-polish / qa / seo-onpage / perf/mobile-90 = ancestors → no merge.
- chore/motion-baseline, feat/chatbot-scroll = not ancestors, out of scope → no merge.
- feat/ia-restructure = not ancestor; compare nav vs tip, cherry-pick only a small missing nav/a11y fix if clean → else document no-merge.
- feat/rebrand-lime = rejected → never.

## Palette (design source of truth)
- canvas `#E5E8CE`, forest `#1F3A24`, ink `#16220F`, surface `#D6DAB4`
- derived: muted text (>=4.5:1 on canvas), border = forest @ alpha, link/accent = forest
- fonts: keep Anton hero + Sora display + Inter body. No new deps.

## Steps
1. Tokens + globals.css restyle (light theme, remove blue glows, buttons/focus/progress/floats/chat/robot/CTA band).
2. `BrandMark.tsx` inline SVG (forest circle + sage N + rising arrow); swap into Navbar/Footer; regenerate `icon.png` + OG colors; themeColor.
3. Delete HeroVisual/HeroCanvas/HeroCanvasLoader (WebGL only consumer = Home); remove `three`, `@react-three/fiber`, `@types/three` if no other import.
4. `ServiceHub` on Home: center N + 4 labeled scene frames (website/SEO/campaign/game), dashed connectors, staggered 6–8s CSS loop, static complete end states on low tier + reduced motion, reflow at 900/600px, no overlap.
5. Rebuild hero: two-column editorial (eyebrow + Anton H1 + lead + CTAs | facts), hub full-width inside #hero.
6. Recolor hardcoded dark/blue/white in: Navbar, Footer, SectionNav, ProfileTile, WhatsAppFloat, Chatbot, page.tsx, contact, audit, services/[slug], our-work, about, services hub, admin (token-consistent), ScrollControls CSS.
7. `/motion-preview`: reuse scene SVGs, per-tile pause + replay, noindex, not in nav/sitemap, reduced-motion static.
8. Sweep grep old blue/lime hex → report leftovers with reasons.
9. AGENTS.md §3 + §13 → Forest & Sage tokens; PROGRESS.md branch table + changes.
10. Gates: tsc / lint / build; contrast script (exact ratios); screenshots home + motion-preview @1440/768/360 (+ reduced motion) in gitignored screenshots/.

## Done criteria
All gates green, no fabricated copy, no blue/lime in UI (except third-party), screenshots reviewed, PROGRESS/AGENTS updated, nothing committed/pushed.
