# AGENTS.md: rules for AI coding agents working on Nexlane Digital

Read this file fully before doing anything. Then read `docs/PROGRESS.md` (what is done). `docs/site-prompt.md` is the older brief: where it conflicts with this file, **this file wins**.

## 1. Current phase: BACKEND STARTED (owner decision 2026-11-08)

- Frontend structure/design is largely done. **Backend work is now ALLOWED**: API routes, auth, file storage, the `/admin` panel.
- Still NOT built unless the owner asks: Resend email sending, Cloudflare Turnstile, Vercel WAF, analytics (decisions in section 10 unchanged).
- Honesty rules (section 5) and SEO/security (section 9) apply to backend code too.
- Owner's exact words: "ab ham backend ka kam bhi kar rhe h esiliye rule change".

## 2. Project

Nexlane Digital is a new, student-founded digital marketing and web agency from Kaithal, Haryana. No paying clients yet, zero budget. Services: web development, SEO, game development, plus free education on YouTube and Instagram.

- Stack: Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.
- Repo: `Rachit-Sharma08/nexlane-digital` (private). Local path: `D:\Projects\nexlane-digital` (Windows, PowerShell).
- All editable values (name, links, team, labels, reply time, WhatsApp) live in `src/config/site.ts`. Never hardcode them in components.

## 3. Brand tokens

Dark navy site, blue to cyan gradient (sampled from the logo).

- `--bg #000D1D`, glows `#003D66` / `#015798`
- `--brand #0572F5`, `--brand-2 #10A9F2`, `--accent #1ED3F2`, `--accent-2 #7CF4EF`, text `#FFFFFF`, muted `#9FB3C8`
- Gradient: `#0572F5 → #1ED3F2 → #7CF4EF`. Text contrast at least 4.5:1.
- Mobile first (360px minimum). Respect `prefers-reduced-motion`.

## 4. Site structure (decided by the owner)

Routes:

- `/` Home
- `/about` (hub: our story + two cards), `/about/founders`, `/about/team`
- `/services` (+ `/services/web-development`, `/services/seo`, `/services/game-development`)
- `/learn` (+ `/learn/youtube`, `/learn/blog`, `/learn/blog/[slug]`, `/learn/resources`)
- `/our-work` (replaces `/portfolio`; add a permanent redirect `/portfolio` to `/our-work` in `next.config.ts`)
- `/audit`, `/contact`, `/thank-you`, `/terms`, `/privacy`, `not-found`

Navbar: Home, **About** (Our story, Founders, Team), **Services** (Web Development, SEO, Game Development), **Learn** (YouTube Lessons, Blog, Free Resources), **Our Work**, Contact, and the CTA button "Get a Free Audit".

Team (in `src/config/site.ts`, shaped as `teamGroups` + `team` members with `slug`, `name`, `group`, `title`, `bio`, `skills`, `portfolioUrl?`, `personalProjects`, `photo?`):

- Group "Founders" (the two owners): Rachit Sharma, Krish Khati. Group "Team" (team members, not owners): Neelam Dhiman, Jyoti. Never call Neelam or Jyoti "co-founder" anywhere on the site.
- Group labels and page titles come from config, so the owner can rename them (for example to "Core team") in one place.
- `/about/founders`: two equal columns, Rachit on the left and Krish on the right (stacked on mobile). Each profile card: avatar, name, title, short bio, skill chips, optional link to the person's own portfolio, up to 3 personal projects. Below the cards: a shared "Why we started Nexlane" section.
- `/about/team`: the same layout, Neelam on the left and Jyoti on the right.
- `/our-work`: Nexlane has no client work yet. Show an honest empty state (no fake slots, no fake clients). See the redesign prompt for the copy.

## 5. Honesty and privacy rules (never break)

- No fake testimonials, reviews, ratings, client logos, client counts, "years of experience", or invented statistics. No guarantees ("#1", "10x", "100% results").
- Performance numbers (e.g. Lighthouse) only if actually measured on our deployed site.
- **Personal projects are not Nexlane work.** They appear only on the person's own profile card, labeled "Personal project by <name>, not Nexlane client work". Never in Our Work, never described as "ours".
- **Tagore Global School:** do not show it anywhere on the site, not even as "pending permission", until the owner confirms written permission. Keep it only in the TODO list in `docs/PROGRESS.md`.
- Team pages: name, title, skills, and a link to their own portfolio only if that person agreed. **No age, school or college or class, address, personal phone number or personal email.** Some team members may be minors. Use initials avatars by default; show a real photo only if the person agreed and the owner adds it to config.
- Phone numbers in **schema and team cards**: never (unchanged). WhatsApp button: still only from env `NEXT_PUBLIC_WHATSAPP_NUMBER`; if empty, render no WhatsApp link.
- **Owner approval 2026-11-08:** the two business numbers `8307151186` and `9306091154`, and the email `nexlanedigitalservice@gmail.com`, MAY appear in `src/config/site.ts` and on the Contact page/footer as public business contact details. They are still forbidden in JSON-LD schema. Never add any other phone number.
- Animated components must not fake social proof: no number counters with made-up numbers, no marquee of client logos or testimonials, no "someone just signed up" style notifications. A marquee of **tools we really use** is fine.
- Do not copy text or layout wording from other agencies.

## 6. Design and animation

Goal: premium, modern, clearly not a basic template. We use **Magic UI** and **unlumen UI** (copy-paste components installed with the shadcn CLI).

- Read the official install docs first: https://magicui.design/docs/installation and https://ui.unlumen.com/docs/installation. Follow their current commands (Magic UI uses `shadcn@latest add @magicui/<name>`). Do not guess commands or component names. If a name does not exist, say so and build a small custom component.
- Licenses: use only free, public registry items. unlumen UI also sells Pro components: never use Pro items or anything that needs a license key. List every component used (name and source) in `docs/PROGRESS.md`.
- Animation library: `motion` (or `framer-motion`) as the components require.
- Performance rules: pages stay server components; only the animated pieces are client components. Load heavy pieces (globe, canvas, particles) with `next/dynamic`. No layout shift. Animation must never block text or the main image. Reveals are short (600 ms or less). One hero-level effect per page at most. No heavy canvas effects on mobile.
- Reduced motion: wrap animations in `MotionConfig reducedMotion="user"` and honor the CSS media query. Everything must still be readable with motion off.
- No runtime CDN scripts or fonts (CSP). Self-host fonts with `next/font`.
- Layout rhythm: one container width, consistent section padding, clear heading scale, no text touching or overlapping.

## 7. Navigation and orientation (the visitor must always know where they are)

Reasons: NN/g says navigation should indicate the user's current location (menu guideline 5) and use highlighting, breadcrumbs and headings as "you are here" signs.

1. **Active state:** the current page, and its parent dropdown when on a child page, are clearly highlighted and have `aria-current="page"`. Use a gradient underline or pill that slides between items.
2. **Dropdowns** open on click and keyboard, not hover only, are at most two levels deep, and mark the current item.
3. **Eyebrow label** above every H1, for example `ABOUT · FOUNDERS`.
4. **Breadcrumbs** only on pages at least two levels below Home (`/about/*`, `/services/*`, `/learn/*`, blog posts). Trail: Home / Section / Page. "Home" appears once (the current build shows "Home / Home"). The last item is not a link. Place it above the H1 with space around it. On mobile show only the last two levels. Not on top-level pages.
5. **Scroll progress bar** under the header.
6. **"On this page" section nav with scroll-spy** on long pages (Home, service pages, About hub, Founders, Team): sticky, highlights the current section. Desktop: a sticky pill bar under the header. Mobile: horizontal chips. Headings have ids, `scroll-margin-top` equals the header height, smooth scroll is off when reduced motion is on.
7. **"Next up" card** at the bottom of every page (Home, Services, Our Work, About, Contact), so no page is a dead end.
8. The logo links to Home. Every page has a unique `title`.
9. Mobile: tap targets at least 44px, and the menu shows the current page highlighted.

## 8. Working rules

1. One stage at a time. Subagents are allowed, maximum 2 at once, with separate file ownership.
2. **Never trust a subagent's summary.** After each one: check with `git status` that the files really exist, then run `npx tsc --noEmit`, `npm run lint`, `npm run build` and show the output.
3. If a subagent fails or says "completed" but files are missing, redo that work yourself with one agent.
4. **Owner override 2026-11-08:** push directly to `main` in small logical commits — "direct push kar diya karo jab tak ma na kahu". No new Pull Requests until the owner says otherwise (existing PRs #13/#14 were closed by his request).
5. Use absolute paths. Verify the working directory before writing files (the Write tool once wrote outside the project).
6. If the Edit tool says `oldString` not found: Read the file, then Write the whole file. On Windows, check line endings; `.gitattributes` should contain `* text=auto eol=lf`.
7. Never claim something works unless you ran it. Say clearly what you could not test.
8. After each stage, take Playwright screenshots of every changed page at 1440, 768 and 360 px width, save them in a `screenshots/` folder (add it to `.gitignore`), and tell me the path.
9. Keep `docs/PROGRESS.md` updated after every stage: what was built, what is left, TODO list, components used.
10. Free models can drop streams. If context is very full, write `docs/PROGRESS.md` and tell me to start a fresh session.
11. When a stage is finished and its PR is green, stop and report. Wait for my "next".

## 9. SEO and security basics (apply from the start)

- One `<h1>` per page, semantic HTML, unique `title` and `description` per page, canonical URLs, alt text on images, `next/image`.
- Security headers stay on in `next.config.ts` (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors none, no X-Powered-By). After any change, test in the browser console for CSP "Refused to..." errors.
- External links use `rel="noopener noreferrer"`. No `dangerouslySetInnerHTML` except escaped JSON-LD.
- Run `npm audit` before each PR to `main` and report the result.

## 10. Decisions already made for phase 2 (do not build now)

- Rate limiting: Vercel WAF rate-limit rule on `/api/*` (Hobby allows 1 rule per project), set up in the dashboard. Remove the in-memory counter.
- Email: Resend free tier. In **production**, if `RESEND_API_KEY` is missing, the form must return an error (503) and tell the visitor to contact us on Instagram or WhatsApp. Never return "success" when nothing was sent. Silent skip is for development only.
- Do not send auto-acknowledgement emails to visitors (only email the owner).
- Cloudflare Turnstile support on, with exact setup steps documented.
- Privacy page names third parties (Vercel, Resend, Cloudflare Turnstile) and is marked "draft, to be reviewed by a qualified professional".
- Before launch: Vercel plan check (Hobby is for non-commercial use), domain, Search Console, WAF rule published.

## 11. Design direction v2: depth and 3D (owner decision, 2026-11-06)

The owner did not like the flat Stage A look. New direction: the whole site feels like a 3D space (depth, layers, tilt, parallax), with a special 3D page-open transition. This section extends section 6 and never relaxes sections 5 and 9. Speed and low-end phones come first: many visitors are small businesses in Haryana on cheap phones.

1. **Quality tiers.** Build one client hook (for example `src/lib/quality.ts` with a provider) that returns `low`, `mid` or `high`:
   - `low`: prefers-reduced-motion, `navigator.connection.saveData`, `deviceMemory <= 2`, `hardwareConcurrency <= 2`, or any screen under 768 px. No WebGL, no tilt, no parallax, no 3D transition. Static layered CSS depth only (shadows, gradients, glass), plain fade at most.
   - `mid`: normal laptops and tablets. CSS 3D (perspective, tilt on fine pointers only, scroll parallax).
   - `high`: desktop (1024 px or wider, 4+ cores, not saveData). The only tier that may load the WebGL hero.
   Default to `low` on the server and first render, then upgrade after hydration, so there is no layout shift and no hydration mismatch.
2. **Real 3D (WebGL) only in the Home hero, one scene.** Use React Three Fiber (`three`, `@react-three/fiber`, optionally `@react-three/drei`, minimum needed). Load with `next/dynamic` (`ssr: false`) after first paint (`requestIdleCallback` or after load). The H1 and CTA are the LCP and must never wait for the canvas. Concept that fits the name: glowing lanes of light receding in perspective with a rising arrow (simple geometry, brand gradient colors). Low poly, `dpr` capped at 1.5, pause rendering when offscreen (IntersectionObserver) and when the tab is hidden, dispose on unmount. Provide a static fallback (CSS glow plus the logo) for `low` and `mid` and for WebGL failure. Do not ship any 3D model file or any asset that needs a license.
3. **CSS 3D everywhere else.** Reusable components: `DepthCard` (perspective tilt toward the pointer, glare optional, `mid` and `high` with fine pointer only), `Parallax` layer (scroll-linked translate with `motion`), layered backgrounds with depth. Reveals 600 ms or less. At most one hero-level effect per page.
4. **3D page-open transition.** The new page enters from depth (slight scale and rotateX or translateZ plus fade), 500 ms or less, never blocks navigation or text, keeps scroll restoration, and is a plain fade or nothing in `low`. First read the Next.js docs for the installed version (View Transitions support, `template.tsx`) and use what is stable; exit animations in the App Router are unreliable, so an enter-only animation is acceptable. Say which approach you used.
5. **Founders and Team layout (from the owner's sketch).** One `ProfileTile` component used on both pages:
   - Large square (1:1) photo tile, info below it: name, title, bio, skill chips, personal projects (max 3, labeled "Personal project by <name>, not Nexlane client work").
   - If config has `photo`: show it with `next/image`. If not: large gradient initials tile.
   - If config has `portfolioUrl`: the whole tile is a link that opens the person's portfolio in a new tab (`target="_blank"`, `rel="noopener noreferrer"`), with a visible "Open portfolio" cue on hover, focus and always on touch. If not: not a link, no hover cue, no empty promise.
   - `/about/founders`: two tiles, Rachit left, Krish right (stacked on mobile), then a "Team members" row below with the same tiles for the two team members, then the shared "Why we started Nexlane" section.
   - `/about/team`: the same two tiles, ordered as in the sketch: Jyoti left, Neelam right. This supersedes the order in section 4. Keep the order in config (an `order` field) so the owner can flip it in one place.
   - Owner confirmed permission for portfolio links on 2026-11-06. Set `portfolioUrl` for Rachit, Krish and Neelam (URLs are in `docs/redesign-prompt.md`). Jyoti has none. Photos: none yet. Support `photo` paths like `/team/<slug>.webp` and document in `docs/PROGRESS.md` that the owner adds square images (800x800, under 150 KB) to `public/team/` and sets the field.
6. **Budgets.** Home initial JS must not grow for `low` visitors: the WebGL chunk loads only in `high`. Report real bundle sizes from the build. Lighthouse mobile goal for Home: performance 85 or more; report the real numbers and never round them up.
7. **Skills to use** (opencode): `frontend-design`, `impeccable`, `magicuidesign`, `shadcn`. Do not load other design skills (no brand-clone DESIGN.md skills, no Figma skills). Components must be free (Magic UI MIT, unlumen free items only).

## 12. SEO, AEO and GEO strategy (owner decision, 2026-11-07)

Goals: (1) rank for the brand names "Nexlane" and "Nexlane Digital"; (2) rank locally for "digital marketing agency in Kaithal", "digital agency in Kaithal", "digital marketer in Kaithal" and the service keywords below; (3) be easy for AI search tools to understand and cite. Nobody can guarantee a ranking: never write one on the site, and never promise one to the owner.

1. **Honesty rules still win.** No fake reviews, no `Review` or `AggregateRating` schema, no client counts, no street address, no phone number or personal email in any schema, `llms.txt`, metadata or page. If an SEO skill suggests any of these, ignore that advice. No keyword stuffing: a keyword appears where a person would naturally write it. No doorway pages (no copy-paste pages for each nearby town).
2. **Keyword map** (candidates, not measured volumes; the owner validates them in Google Keyword Planner and later in Search Console).
   - Brand: Nexlane, Nexlane Digital.
   - Local, main: digital marketing agency in Kaithal, digital agency in Kaithal, digital marketer in Kaithal, digital marketing Kaithal.
   - Services: SEO services in Kaithal, local SEO Kaithal, SEO expert in Kaithal, website development in Kaithal, web development company in Kaithal, website design Kaithal, Google Ads and Meta Ads Kaithal, social media marketing Kaithal, Google Business Profile setup Kaithal.
   - Hinglish (use naturally in a heading or FAQ, not everywhere): Kaithal me website banwane wale, Kaithal me SEO, Kaithal digital marketing.
   - Haryana level: digital marketing agency in Haryana, SEO services Haryana.
   - Education topics for Learn pages (not local targets): free digital marketing lessons, free AI tools for business, how to improve a Google Business Profile.
3. **Page to keyword mapping.** One main intent per page: Home = brand + "digital marketing agency in Kaithal"; `/services/digital-marketing` (new page, see item 4) = digital marketing Kaithal, Google Ads, Meta Ads; `/services/seo` = SEO services Kaithal; `/services/web-development` = website development Kaithal; `/about/founders` = digital marketer in Kaithal (the founders are the people); other pages follow `docs/seo-content.md`.
4. **New route `/services/digital-marketing`.** The owner wants to rank for "digital marketing agency in Kaithal", so a real service page must exist. Add it to the routes in section 4, to the navbar Services dropdown, the footer, the services hub and the sitemap. Content only from facts we have: Google Ads, Meta Ads, social media, YouTube and Instagram content, video editing, a free audit first. Mark every claim the owner must confirm with `TODO`.
5. **Indexing switch.** Until the owner has the real domain, the site must not be indexed under a temporary URL. Use env `NEXT_PUBLIC_ALLOW_INDEXING` (default `false` in `.env.example`; real `.env` never committed). When not `true`: `robots` disallows everything and metadata sets `noindex`. All canonical URLs, sitemap and schema derive from `SITE_URL` in `src/config/site.ts`. The owner flips the switch at launch.
6. **Brand entity.** `WebSite` schema: `name` "Nexlane Digital", `alternateName` "Nexlane". `Organization` (type `ProfessionalService`): same names, `url`, `logo`, `description`, `areaServed` (Kaithal, Haryana, India), `sameAs` from config social links (only non-empty ones), `foundingDate` 2026. No address, no phone, no email. Keep the name, description and facts identical on every page and in `llms.txt`.
7. **Schema per page.** `BreadcrumbList` only where a visible breadcrumb exists and matching it. `Service` on service pages (provider = the Organization, `areaServed` Kaithal/Haryana). `Person` (name, jobTitle, `worksFor`, `url` = portfolioUrl if set) for the founders on `/about/founders`. `FAQPage` only for FAQs visible on that page (Google shows FAQ rich results only for a few site types now, so this is low value; keep it only where the FAQ is on the page anyway). All JSON-LD goes through one component that escapes `<`. Nothing else uses `dangerouslySetInnerHTML`.
8. **Images.** Serve modern formats: set `images.formats` to `['image/avif','image/webp']` in `next.config.ts` and use `next/image` everywhere with real `width`/`height` or `sizes`, descriptive `alt` (decorative images get `alt=""`), `priority` only for the LCP image. Convert any PNG or JPG in `public/` that is shown on the site to `.webp` (use `sharp`, already installed with Next; if it is missing, say so, do not install from outside the registry) and keep each under 150 KB where possible. Team photos use `/team/<slug>.webp`.
9. **Files.** `src/app/robots.ts`, `src/app/sitemap.ts` (all public routes, no `/thank-you`, blog posts when they exist), `public/llms.txt` built only from config facts (who we are, honest note that we are new and have no client work yet, services, location, page list with one-line descriptions; no phone, no address). Note: no AI provider has confirmed that it uses `llms.txt`; it is cheap, so we ship it, but we do not claim any effect. `/thank-you` is `noindex`. Generate `opengraph-image` with `next/og` (text and brand gradient, no logo file).
10. **Metadata.** Every page: unique `title` (60 characters or fewer) and `description` (160 or fewer) from `docs/seo-content.md`, a canonical URL, Open Graph and Twitter tags, `html lang="en-IN"`, one H1 that contains the page's main keyword naturally, logical H2/H3. Home and service pages get a short answer-first intro (the first 2 sentences say who we are, where, and what we do) because AI search quotes those.
11. **Local and AEO content.** Each service page has a section "For businesses in and around Kaithal" (real, written for people, mentions Kaithal and Haryana once or twice naturally) and a visible FAQ, answer first, 1 to 3 sentences, from `docs/seo-content.md`. Internal links between related pages with descriptive anchor text (for example SEO page to Free Audit, Digital Marketing to SEO). No prices, no guarantees, no invented statistics.
    - **Owner update 2026-11-08:** targeting is NOT Kaithal-only. Main target = bigger Haryana cities (Karnal, Kurukshetra, Rohtak, Ambala, Panipat, Hisar…) and customers from anywhere including foreign clients (remote work). Weave these in naturally where the audience is described; keep Kaithal as the home base; never claim clients we do not have; no keyword stuffing.
12. **Owner-only tasks (agent only documents them in `docs/PROGRESS.md`).** Buy the domain and set `SITE_URL`; Google Search Console and Bing Webmaster Tools (submit the sitemap); Google Business Profile as a service-area business without a shown address (largest local ranking factor, needs verification); use the same name "Nexlane Digital" and the site URL in the Instagram and YouTube bios; flip `NEXT_PUBLIC_ALLOW_INDEXING`; validate keywords in Keyword Planner.
