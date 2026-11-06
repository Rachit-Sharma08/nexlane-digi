# Nexlane Digital — Progress

Last updated: 2026-11-05 · Repo: `Rachit-Sharma08/nexlane-digital` (private) · Deploy: Vercel (pending)

## Kya bana hai

| Stage | Status | Details |
|---|---|---|
| **Stage 1 — Foundation** | ✅ Merged PR #1 `2a90d82` | Next 16 + TS + Tailwind v4, CSP/HSTS headers, layout (Sora+Inter, skip-link, Org+WebSite JSON-LD), Navbar/Footer/WhatsAppFloat, `src/config/site.ts` (single config), content data files, `lib/seo.ts`, `lib/formsecurity.ts` (zod/honeypot/min-fill/origin/Turnstile — in-memory rate limit removed), tests 5→4, home page 10 sections, npm audit 0 vuln |
| **Stage 2 — Services/About/Portfolio** | ✅ Merged PR #2 `2e196c6` | `/services` + 3 SSG `/services/[slug]`, `/about` (honest story, team cards from config), `/portfolio` (client work hidden while empty, practice labelled, flagged chip), `Breadcrumbs` component |
| **Stage 3 — Learn** | ✅ Merged PR #3 `d13ade2` | `/learn` overview, `/learn/youtube` (honest empty state), `/learn/blog` + `/learn/blog/[slug]` SSG (draft never listed, article/breadcrumb JSON-LD), `/learn/resources` (free-tier caveat). 14 routes, tsc 0, lint 0, build 0 |
| **Stage 4 — Structure (phase 1)** | ✅ PR pending | `/audit` + `/contact` (form UI shells, submit disabled + "coming soon"), `/thank-you` (noindex), `/terms`, `/privacy` (draft banner + third parties named), `not-found.tsx` (404), `.gitignore`. **Backend NOT built yet** — per AGENTS.md phase 1, forms send nothing. Backend (Resend/WAF/Turnstile) waits for "phase 2" |
| **Redesign Stage A — IA restructure** | ✅ PR (this branch) | Dev badge fix (CSP `unsafe-eval` dev-only), breadcrumbs (single Home, hidden on top-level, above H1, mobile last-2-levels), `teamGroups`+`team` in site.ts (portfolioUrl all TODO-null), `/about` hub + `/about/founders` + `/about/team` (MemberCard, initials avatars, #slug anchors, personal-project labels), `/portfolio`→`/our-work` + permanent redirect, Navbar About dropdown + Our Work label, Footer team anchors. 21 routes, tsc 0, lint 0, build 0 |

## Rules compliance (prompt ke hisaab se)

| Rule | Status | Proof |
|---|---|---|
| No fake testimonials/reviews/ratings/stats/counts/prices | ✅ | grep = 0 matches; testimonials section nahi hai |
| Team ki personal info nahi (no age/school/college/address/personal phone) | ✅ | Team cards sirf name/role/skills/portfolio link |
| Security headers | ✅ | `next.config.ts`: CSP strict + youtube-nocookie + challenges.cloudflare.com, HSTS, nosniff, Referrer-Policy, Permissions-Policy (camera/mic/geo off), `frame-ancestors 'none'`, poweredByHeader false |
| Form validation helpers (zod + honeypot + min-fill + origin + Turnstile) | ✅ Helper ready | `lib/formsecurity.ts` + 4 tests (rateLimit removed) |
| No secrets in client bundle | ✅ | `.env` gitignored; `.env.example` sirf fake values |
| No in-memory rate limit (serverless-safe) | ✅ | Removed `rateLimit()`; Vercel WAF rule chalega (steps below) |

## WhatsApp / phone number rule

- `site.whatsappNumber` = `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""` (source me koi hardcoded number nahi).
- Gating 6/6 jagah: `WhatsAppFloat`, `Navbar TopBar`, `Footer`, `/` (page.tsx), `/services/[slug]`, `/contact`, `/thank-you` — sab `site.whatsappNumber &&` ya `if (!site.whatsappNumber) return null`.
- Local `.env`: `NEXT_PUBLIC_WHATSAPP_NUMBER=` (empty). Disk-proof: prerendered HTML me `wa.me` = **0**.
- JSON-LD schema aur team cards me koi phone number nahi.
- ⚠️ Purana number `918307151186` git history (commit `2a90d82`) me abhi bhi hai — current source me nahi. Private repo hai, history rewrite tab karein jab repo public hoga.
- `.env.example` me sirf fake `910000000000`.

## TODO list (tumhe bharna hai)

1. `SITE_URL` — apna domain kharidne ke baad real URL
2. `contactEmail` — abhi khaali (`site.ts`)
3. `instagramUrl`, `youtubeUrl` — abhi khaali
4. `NEXT_PUBLIC_WHATSAPP_NUMBER` — business number confirm karke Vercel env me dalna (khali = WhatsApp UI hidden)
5. `REPLY_TIME` ("24–48 hours") confirm
6. Logo PNG `nexlane-logo-clean.png` — kabhi attach hi nahi hua, sab placeholder SVG
7. OG image file (`/brand/og-placeholder.png`) — Stage 5 me
8. `projects.ts` — 5 practice projects ke `liveUrl` khaali; Tagore school `status:"flagged"` (permission confirm karna hai)
9. `blog.ts` — 1 DRAFT sample hai, real posts nahi
10. YouTube channel URL + real lesson videoIds (page abhi honest empty state hai)
11. `GOOGLE_SITE_VERIFICATION`, `RESEND_API_KEY`, `TURNSTILE_SECRET` / `TURNSTILE_SITE_KEY` — Phase 2 me
12. `SECURITY.md` — `TODO_SECURITY_EMAIL` real mailbox
13. GitHub collaborators ke usernames (invite pending)
14. `analytics` flag — abhi `"off"`

## Launch checklist — WAF rate limit rule (dashboard steps)

Hobby plan: **1 rule per project** allowed. `/api/audit` + `/api/contact` dono ek hi rule se cover honge (path prefix `/api/`).

1. Vercel dashboard → project → **Firewall** (sidebar) → **Configure** (top right) → **+ New Rule**.
2. Name: `api-rate-limit`.
3. **If** conditions (sab true hone chahiye): Request Path → **starts with** `/api/`.
4. **Then** action: **Rate Limit**.
5. Strategy: **Fixed Window** (Hobby only fixed window deta hai; Token Bucket Enterprise only).
6. Time Window: **10 min** (min 10s, max 10 min on Hobby). Request Limit: **10** (per IP).
7. Key: **IP** (Hobby me IP + JA4 Digest; User Agent / custom headers Pro+).
8. Then action: **Default (429)** (ya Deny). Log action sirf testing ke liye.
9. **Save Rule** → **Review Changes** → **Publish** (production deployment par apply hoga).
10. Firewall overview page → custom rule select → traffic grouping dekh kar verify karo ki rule trigger ho raha hai.

## Turnstile — exact setup steps (phase 2)

Cloudflare Turnstile free hai (unlimited verifications). CSP me already `challenges.cloudflare.com` allowed hai.

1. cloudflare.com → **Turnstile** → **Add site** → domain daalo (apna domain).
2. Widget mode: **Managed** (recommended) ya **Non-interactive**.
3. Site Key (public) + Secret Key (private) milenge.
4. Vercel env vars set karo:
   - `TURNSTILE_ENABLED=true`
   - `TURNSTILE_SITE_KEY=<public site key>` (client me use hoga widget ke liye)
   - `TURNSTILE_SECRET_KEY=<secret>` (server side, siteverify call ke liye)
5. Form component me widget render karo (`<div className="cf-turnstile" data-sitekey={...} />` + script `https://challenges.cloudflare.com/turnstile/v0/api.js`).
6. `/api/*` route me `verifyTurnstile(req, token)` call karo (already in `lib/formsecurity.ts`).
7. Local dev: `TURNSTILE_ENABLED` unset rakh → verifyTurnstile auto-true return karta hai (dev skip).

## Kya baaki hai

- **Phase 2 (backend):** user bole "phase 2" → API routes (`/api/audit`, `/api/contact`), Resend email (owner ko only, no auto-ack), Turnstile widget, Vercel WAF rule (dashboard), `/thank-you` redirect after success, forms ko enable (disabled hatao).
- **Stage 5:** `sitemap.ts`, `robots.ts`, `llms.txt`, OG image, `npm audit` final, real Lighthouse scores, Vercel deploy + domain steps, final TODO checklist.
- **Deploy:** abhi Vercel pe live nahi hai (domain + env pending).

## Repo security limits (free plan, private repo)

Branch protection / rulesets / secret scanning = 403 (Pro ya public repo chahiye). Fallback: CI workflow (`lint`+`build` har PR/push), SECURITY.md, `.env*` gitignored, PR-only discipline.

## AGENTS.md sync + section 4/7 diff fixes (2026-11-06, PR #7)

- `AGENTS.md` replaced with the owner's correct 10-section file (before: only nextjs-rules + motion-refresh sections).
- Diff of sections 4 and 7 vs the Stage A build — code was fixed, never AGENTS.md:
  - Group labels now drive everything: founders/team H1, metadata title, breadcrumb and the navbar About dropdown all read from `teamGroups` (rename a group in config once).
  - `TeamMember` gained optional `photo?` (initials avatar stays the default; MemberCard shows a photo only if config has one), `portfolioUrl` now optional, personal projects capped at 3 per card.
  - Eyebrow label above every H1 (new `Eyebrow` component in `src/components/ui.tsx`, e.g. `ABOUT · FOUNDERS`).
  - Breadcrumb added to `/services/[slug]` (was JSON-LD only); breadcrumbs remain only on pages ≥2 levels below Home.
  - Navbar: gradient underline on the active item + `aria-current` on the active dropdown parent, mobile menu highlights the current page, 44px tap targets (hamburger p-2.5, menu items py-3).
- Verification: `npx tsc --noEmit` = 0, `npm run lint` = 0, `npm run build` = 0 (21 routes), production CSP via `npm start` + `curl.exe -I` has **no** `unsafe-eval`.
- Not in this pass (Stage B/D scope per redesign prompt): scroll progress bar, SectionNav scroll-spy, NextUp card, sliding pill in the navbar.

## Visual QA - Stage A final (2026-11-06, PR #7)

- Production build (
pm run build + 
pm start) par 8 pages x 1440/768/360 screenshots: screenshots/stage-a-final/ (gitignored).
- Fixed: Home nav item never got ria-current/underline (isActive skipped /).
- Fixed: two competing nav underline rules - removed the global 1px rule so all active items use the same 2px gradient underline (also stopped the logo hover underline).
- Fixed: mobile breadcrumb showed a leading / (Home hidden, separator left behind); separator now hides with its crumb.
- Checks: eyebrow above every H1, Home once per breadcrumb, top-level pages have none, 12px eyebrow/H1 gap, no horizontal scroll at 360px.

## Autopilot plan (Stages B–E, 2026-11-06)

Owner approved a non-stop run: B → C → D → E, one PR per stage, nothing merged. Branch chain: `feat/design-system` → `feat/home-redesign` → `feat/pages-polish` → `feat/qa`.

| Stage | Branch | Scope | Done when |
|---|---|---|---|
| B | `feat/design-system` (base `main`) | shadcn/Magic UI/motion setup, tokens + primitives, quality tier hook/provider, `DepthCard`, `Parallax`, page-open transition, navbar sliding indicator + keyboard dropdowns, scroll progress, `SectionNav` scroll-spy, `NextUp`, `ProfileTile` + Founders/Team restructure, logo blend fix | tsc/lint/build 0, screenshots, CSP check, PR |
| C | `feat/home-redesign` (base B) | Home sections with depth system: one WebGL hero (high tier only, static fallback), bento services, true facts, tools marquee, Why Nexlane, 5-step timeline, Our Work teaser, CTA, `NextUp` | same gates + real bundle sizes, PR |
| D | `feat/pages-polish` (base C) | Depth system on every inner page, eyebrow/breadcrumb/`NextUp` everywhere, `SectionNav` on long pages, contrast + copy fixes, empty-space fill with honest `TODO` placeholders | same gates, PR |
| E | `feat/qa` (base D) | Reduced motion, 360 px, low-end CPU throttle, Lighthouse mobile, CSP console, `npm audit`, grep checks, final PROGRESS | real numbers reported, PR |

Rules for the run: small commits; max 2 subagents with separate files; never trust subagent summaries; after 3 failed fixes mark `BLOCKED`; stop only if context is full (write `RESUME POINT`).

## Stage B — design system and orientation (2026-11-06, `feat/design-system`)

### Built

- **Libraries:** `motion@14.10.0` (single motion library; `framer-motion` not installed). shadcn was already set up; `components.json` now carries `@magicui` (already) and free `@unlumen-ui` registries. No Magic UI/unlumen component was installed yet because none is used in Stage B — the first one lands in Stage C where it has a job (`marquee`, `animated-beam`). No Pro/paid items.
- **Quality tiers:** `src/lib/quality.tsx` (`QualityProvider`, `useQuality`) returns `low | mid | high`. SSR/first render is always `low`, then measured after hydration; `data-quality` is written to `<html>`. `low` = reduced motion, saveData, deviceMemory ≤ 2, cores ≤ 2 or width < 768. `high` = 1024px+, 4+ cores, fine pointer, no saveData. `mid` = everything else.
- **Depth primitives:** `DepthCard` (pointer tilt + optional glare; low/touch keep the static card), `Parallax` (motion `useScroll`/`useTransform`, disabled on low), layered depth tokens/shadows in `globals.css`, `Container`/`Section` primitives. `MotionConfig reducedMotion="user"` wraps the app via `AppProviders`.
- **Page-open transition:** React 19 `ViewTransition` (already in the repo) with an enter-only 3D CSS animation (translateZ + rotateX + scale, 420ms). Exit animation is not attempted (App Router unreliable). `low` gets a 180ms fade; reduced motion gets 0s.
- **Navbar:** active underline now slides with `layoutId`; parent dropdown is highlighted + `aria-current="page"` on child pages; click and keyboard dropdowns (ArrowDown opens and focuses the first item, ArrowUp/Down/Home/End cycle, Escape closes and returns focus, Tab/outside click closes); mobile menu highlights the current page with a left accent. Header height is measured into `--header-h` for SectionNav and anchor offsets.
- **Orientation:** scroll progress bar sits under the header; `SectionNav` sticky pills (desktop) / chips (mobile) with IntersectionObserver scroll-spy; `NextUp` card; headings/sections get `scroll-margin-top`.
- **Profiles:** one `ProfileTile` for Founders and Team. 1:1 initials tile (photo supported), whole tile links to the portfolio in a new tab when set, "Open portfolio ↗" cue on hover/focus and always on touch. Personal projects (max 3) stay clickable above the tile link and keep the "not Nexlane client work" label. `order` added to config: founders Rachit → Krish; team Jyoti → Neelam. Portfolio URLs set for Rachit, Krish and Neelam (owner permission 2026-11-06); Jyoti has none. `MemberCard` deleted.
- **Logo:** `mix-blend-mode: screen` on the navbar/footer mark removes the dark box on our background. A transparent PNG is still needed (TODO below).

### Verified

| Gate | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | 0 errors, 0 warnings |
| `npm run build` | success, 21 routes |
| Production CSP (`npm start` + `curl -I`) | no `unsafe-eval` |
| Browser console (`/about/founders`, high tier) | 0 errors, 0 warnings, no CSP "Refused to…" |
| Reduced motion | `data-quality="low"`, `scroll-behavior: auto` |
| Mobile menu at 360px | Team marked `aria-current="page"`, accent bar visible |
| Keyboard dropdown | ArrowDown → "Our story" focused; ArrowDown → "Founders"; Enter navigates; Escape closes |
| Scroll-spy | at `#team-members`, pill "Team members" is `aria-current="location"`; bar sticks at `--header-h` (65px) |

Screenshots: `screenshots/stage-b/` (home, about, founders, team at 1440/768/360; mobile menu; scroll-spy). Gitignored.

### TODO for the owner

1. Add square team photos to `public/team/` (800×800, under 150 KB), then set `photo: "/team/<slug>.webp"` in `src/config/site.ts`. None are set yet, so every tile shows initials.
2. Supply a transparent logo PNG (the current mark still needs `mix-blend-screen`).
3. Confirm every team title and bio (still the Stage A drafts).

## Stage E — QA (2026-11-06, `feat/qa`)

### Reduced motion + 360 px

- `prefers-reduced-motion: reduce` → `data-quality="low"`, `scroll-behavior: auto`, no canvas, marquee animation `none`. Verified at 360 px.
- Mobile menu highlights the current page; tap targets ≥ 44 px where possible (SectionNav chips bumped to `py-2.5`).

### Lighthouse (mobile, simulated throttling) — real numbers, not rounded up

| Page | Perf | A11y | BP | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|
| Home | 79 | 96 | 100 | 100 | 1.0 s | 920 ms | 0 |
| Home (run 2) | 86 | 96 | 100 | 100 | 1.3 s | 540 ms | 0 |
| About | 75 | 100 | 100 | 100 | 0.8 s | 1330 ms | 0 |
| /services/web-development | 71 | 100 | 100 | 100 | 0.8 s | 2180 ms | 0 |

Scores swing ±15 points between runs on this shared machine; TBT is the bottleneck (React hydration of the App Router). Reported as measured, not rounded up. Perf goal (≥85) is met on the best Home run; the median sits just below. No layout shift anywhere (CLS 0).

### Console (production CSP)

- `curl -I http://localhost:3000/` → CSP has no `unsafe-eval` (dev-only).
- Browser console on Home at 1440 px: 0 errors, 1 warning — `THREE.Clock: This module has been deprecated` from `@react-three/fiber` (library-level, not our code).
- No "Refused to..." CSP errors.

### npm audit

- 3 low severity, all from `shadcn` → `@shadcn/registry` → `deepmerge` (dev-time CLI dependency, not shipped to production). No production runtime vulnerability. Reported, not `--force` fixed.

### Grep checks (AGENTS.md §redesign-prompt)

- `git grep -nE "[6-9][0-9]{9}" -- src` → empty.
- `git grep -nEi "class 12|bba|college|school of|years of experience|testimonial|guarantee|10x" -- src` → only the honest disclaimer in `terms/page.tsx` ("We do not guarantee rankings…") and a comment in `config/site.ts`. No team/about hits.
- `git grep -nEi "tagore" -- src` → empty.

### Components used (free only)

- `motion` (MotionConfig, useScroll/useTransform) — MIT
- `three` + `@react-three/fiber` — MIT, high tier only
- `@magicui/marquee` — MIT, free registry
- Custom: `DepthCard`, `Parallax`, `Container`, `Section`, `SectionHeader`, `Eyebrow`, `GlassCard`, `GradientHeading`, `Muted`, `ArrowMotif`, `ProfileTile`, `SectionNav`, `NextUp`, `HeroVisual`, `HeroCanvas`, `HeroCanvasLoader`, `AppProviders`, `QualityProvider`

### Stage E TODO for the owner (unchanged, carried over)

1. Add square team photos to `public/team/` (800×800, under 150 KB), then set `photo: "/team/<slug>.webp"` in `src/config/site.ts`.
2. Supply a transparent logo PNG (the current mark still needs `mix-blend-screen`).
3. Confirm every team title and bio (still the Stage A drafts).
4. Buy the domain and set `SITE_URL` in env; verify the Vercel plan (Hobby is non-commercial) before launch.
5. Set up the Vercel WAF rate-limit rule on `/api/*` (Hobby allows 1 rule) — Phase 2.
6. Add `RESEND_API_KEY` (production must return 503 if missing) and Turnstile keys — Phase 2.
