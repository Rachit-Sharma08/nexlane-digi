# Nexlane Digital — Progress

Last updated: 2026-11-05 · Repo: `Rachit-Sharma08/nexlane-digital` (private) · Deploy: Vercel (pending)

## Kya bana hai

| Stage | Status | Details |
|---|---|---|
| **Stage 1 — Foundation** | ✅ Merged PR #1 `2a90d82` | Next 16 + TS + Tailwind v4, CSP/HSTS headers, layout (Sora+Inter, skip-link, Org+WebSite JSON-LD), Navbar/Footer/WhatsAppFloat, `src/config/site.ts` (single config), content data files, `lib/seo.ts`, `lib/formsecurity.ts` (zod/honeypot/min-fill/origin/Turnstile — in-memory rate limit removed), tests 5→4, home page 10 sections, npm audit 0 vuln |
| **Stage 2 — Services/About/Portfolio** | ✅ Merged PR #2 `2e196c6` | `/services` + 3 SSG `/services/[slug]`, `/about` (honest story, team cards from config), `/portfolio` (client work hidden while empty, practice labelled, flagged chip), `Breadcrumbs` component |
| **Stage 3 — Learn** | ✅ Merged PR #3 `d13ade2` | `/learn` overview, `/learn/youtube` (honest empty state), `/learn/blog` + `/learn/blog/[slug]` SSG (draft never listed, article/breadcrumb JSON-LD), `/learn/resources` (free-tier caveat). 14 routes, tsc 0, lint 0, build 0 |
| **Stage 4 — Structure (phase 1)** | ✅ PR pending | `/audit` + `/contact` (form UI shells, submit disabled + "coming soon"), `/thank-you` (noindex), `/terms`, `/privacy` (draft banner + third parties named), `not-found.tsx` (404), `.gitattributes`. **Backend NOT built yet** — per AGENTS.md phase 1, forms send nothing. Backend (Resend/WAF/Turnstile) waits for "phase 2" |

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
