# AGENTS.md: rules for AI coding agents working on Nexlane Digital

Read this file fully before doing anything. Then read `docs/PROGRESS.md` (what is done). `docs/site-prompt.md` is the older brief: where it conflicts with this file, **this file wins**.

## 1. Current phase: STRUCTURE + DESIGN (frontend only)

- DO: pages, layouts, components, navigation, config, placeholder text marked `TODO`, visual design and animation (section 6).
- DO NOT (yet): API routes, email sending (Resend), Turnstile, rate limiting, analytics, real blog posts, or invented content.
- Forms are **UI shells only**: fields render, the submit button is disabled or says "coming soon". No data is sent anywhere.
- If backend code already exists (API routes, form libs), do not extend it and do not delete it. Tell me it exists.
- "Phase 2" means the backend work starts (decisions already made are in section 9).

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
- Phone numbers: never in source code, schema or team cards. The WhatsApp number comes only from the env variable `NEXT_PUBLIC_WHATSAPP_NUMBER`. If it is empty, render no WhatsApp button or link. Never commit real `.env` files; `.env.example` holds fake values only.
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
4. Work on a branch (`feat/...`), push, open a Pull Request. Never push straight to `main`.
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
