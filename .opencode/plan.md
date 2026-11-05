# Nexlane Digital Website — Plan

## Goal
Official Next.js (App Router) + TS + Tailwind site for Nexlane Digital (Kaithal, Haryana), private repo
Rachit-Sharma08/nexlane-digital, deploy target Vercel. Honest-trust strategy: no fake data at all.

## Repo security (done / limits)
- Branch protection + rulesets + secret scanning = 403 on free plan private repo (needs GitHub Pro or public repo).
- Fallback applied: CI workflow (lint+build) runs on PR & push; CODEOWNERS; SECURITY.md; .gitignore blocks .env*;
  PR-only discipline for team. TODO: jab team aa jaye ya repo public ho, protection rules laga lena.

## Stages
1. (main session) Foundation: scaffold (package/ts/next/eslint/postcss), tokens in globals.css,
   src/config/site.ts (single edit point), libs (seo.ts, formsecurity.ts), layout + Navbar + Footer +
   TopBar + WhatsAppFloat + ui.tsx, content data files. Build + lint green. Push via PR to main.
2. (agents, parallel) Home; About + Portfolio; Services (overview + 3 detail pages).
3. (agent) Learn section: YouTube lessons page, Blog (typed data files + 1 draft post), Free Resources.
4. (agent) Free Audit + Contact pages + /api/audit + /api/contact (zod, honeypot, min fill time, rate limit,
   origin check, Turnstile optional env, Resend optional env) + /thank-you + /terms + /privacy + 404.
5. (main session) SEO: sitemap.ts, robots.ts, llms.txt, OG image (placeholder till logo PNG arrives),
   FAQPage only where FAQ visible; npm audit; final build+lint; Lighthouse (local, report real numbers);
   deploy steps; TODO checklist for user.

## Done criteria
- npm run build + npm run lint pass.
- No invented testimonials/stats/prices/promises.
- Each form: server validation + honeypot + min fill + rate limit + origin check (+ Turnstile if enabled).
- All TODOs listed for user at end.

## Owner map
- Main session: stages 1, 5, repo security.
- web-builder/general agents: stages 2-4 (one file-strip each, no shared-file edits).
