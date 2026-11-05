# Nexlane Digital — Progress

Last updated: 2026-11-05 · Repo: `Rachit-Sharma08/nexlane-digital` (private) · Deploy: Vercel (pending)

## Kya bana hai

| Stage | Status | Details |
|---|---|---|
| **Stage 1 — Foundation** | ✅ Merged PR #1 `2a90d82` | Next 16 + TS + Tailwind v4, CSP/HSTS headers, layout (Sora+Inter, skip-link, Org+WebSite JSON-LD), Navbar/Footer/WhatsAppFloat, `src/config/site.ts` (single config), content data files, `lib/seo.ts`, `lib/formsecurity.ts` (zod/honeypot/min-fill/rate-limit/origin/Turnstile), tests 5/5, home page 10 sections, npm audit 0 vuln |
| **Stage 2 — Services/About/Portfolio** | ✅ Merged PR #2 `2e196c6` | `/services` + 3 SSG `/services/[slug]`, `/about` (honest story, team cards from config), `/portfolio` (client work hidden while empty, practice labelled, flagged chip), `Breadcrumbs` component |
| **Stage 3 — Learn** | ✅ Merged PR #3 `d13ade2` | `/learn` overview (links to 3 sub-pages), `/learn/youtube` (honest empty state), `/learn/blog` + `/learn/blog/[slug]` SSG (draft never listed, article/breadcrumb JSON-LD), `/learn/resources` (free-tier caveat). 14 routes build green: tsc 0, lint 0, build 0 |

## Rules compliance (prompt ke hisaab se)

| Rule | Status | Proof |
|---|---|---|
| No fake testimonials/reviews/ratings/stats/counts/prices | ✅ | grep `testimonial\|5 star\|years of experience\|guarantee\|clients served` = 0 matches; testimonials section nahi hai |
| Team ki personal info nahi (no age/school/college/address/personal phone) | ✅ | Team cards sirf name/role/skills/portfolio link; grep `age:\|college\|personal phone` sirf comments me |
| Security headers | ✅ | `next.config.ts`: CSP strict + youtube-nocookie + challenges.cloudflare.com, HSTS, nosniff, Referrer-Policy, Permissions-Policy (camera/mic/geo off), `frame-ancestors 'none'`, poweredByHeader false |
| Form validation (zod + honeypot + min-fill + rate-limit + origin) | ✅ Helper ready | `lib/formsecurity.ts` + 5/5 tests; pages/routes abhi Stage 4 me |
| No secrets in client bundle | ✅ | `.env` gitignored; `.env.example` sirf fake values |

## WhatsApp / phone number rule

- `site.whatsappNumber` = `process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""` (source me koi hardcoded number nahi).
- Gating 6/6 jagah: `WhatsAppFloat`, `Navbar TopBar`, `Footer`, `/` (page.tsx), `/services/[slug]`, — sab `site.whatsappNumber &&` ya `if (!site.whatsappNumber) return null`.
- Local `.env`: `NEXT_PUBLIC_WHATSAPP_NUMBER=` (empty). Disk-proof: 14 prerendered HTML me `wa.me` = **0**.
- JSON-LD schema aur team cards me koi phone number nahi (grep `telephone\|tel:` = 0).
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
11. `GOOGLE_SITE_VERIFICATION`, `RESEND_API_KEY`, `TURNSTILE_SECRET` — Stage 4/5 me lagega
12. `SECURITY.md` — `TODO_SECURITY_EMAIL` real mailbox
13. GitHub collaborators ke usernames (invite pending)
14. `analytics` flag — abhi `"off"`

## Kya baaki hai

- **Stage 4:** Free Audit + Contact + `/api/audit` + `/api/contact` + `/thank-you` + `/terms` + `/privacy` + 404 — go ke baad build
- **Stage 5:** `sitemap.ts`, `robots.ts`, `llms.txt`, OG image, `npm audit` final, real Lighthouse scores, Vercel deploy + domain steps, final TODO checklist
- **Deploy:** abhi Vercel pe live nahi hai (domain + env pending)

## Repo security limits (free plan, private repo)

Branch protection / rulesets / secret scanning = 403 (Pro ya public repo chahiye). Fallback: CI workflow (`lint`+`build` har PR/push), SECURITY.md, `.env*` gitignored, PR-only discipline.
