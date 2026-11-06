# Nexlane redesign: structure and design pass

Read `AGENTS.md` fully first. It has been updated and now sets the rules for this work. Then read `docs/PROGRESS.md`.

## What the owner saw when reviewing the site

- Pages are mostly plain text. Almost no motion, and many inner pages have large empty areas.
- Breadcrumbs show "Home / Home / About" and sit tight against the intro text. The heading "What we believe" touches the text above it.
- A red "1 Issue" Next.js dev badge is visible on every page.
- `/portfolio` shows personal practice projects and a "Tagore Global School, pending permission" item. The owner does not want these in Nexlane's work page.
- About is one page. The owner wants two profile pages (Founders and Team).
- On long pages a visitor cannot tell which section they are in.

The goal: a site that looks top-level and premium (animated, polished, still fast and honest), so that a visitor, and later an investor, takes the team seriously.

## Before you start (one checkpoint)

Reply with: (1) the route list as you understood it, (2) the exact Magic UI and unlumen UI components you plan to use, with the install command from their docs for each, and anything you could not find. Then wait for my "go". After this, work stage by stage as in `AGENTS.md` section 8.

## Stage A: structure (branch `feat/ia-restructure`), no new libraries yet

1. Open the "1 Issue" badge, copy the exact message, fix the root cause, and report what it was.
2. Fix the breadcrumb component (single "Home", hidden on top-level pages, spacing above the H1, rules in `AGENTS.md` section 7).
3. Add `teamGroups` and `team` to `src/config/site.ts` using the data below. Replace anything that hardcodes team names.
4. Build `/about` (hub), `/about/founders`, `/about/team` as described in `AGENTS.md` section 4.
5. Rename `/portfolio` to `/our-work`, add the permanent redirect, and update the nav, footer, internal links, metadata and any sitemap data. Remove the personal practice projects and the Tagore item from this page. Use the empty state below.
6. Navbar: About dropdown (Our story, Founders, Team), "Our Work" label. Footer: update links; the team names link to `/about/founders#rachit` and similar anchors.
7. Gate: `git status`, `npx tsc --noEmit`, `npm run lint`, `npm run build`, grep checks (below), screenshots, PR.

### Team data (owner to confirm every title and bio, mark with TODO)

| slug | name | group | title | skills | bio (draft, facts only) |
|---|---|---|---|---|---|
| rachit | Rachit Sharma | founders | Founder · SEO and Growth | SEO, AEO/GEO, Google Ads, Meta Ads, AI tools | Digital marketer focused on SEO (including AEO/GEO), Google Ads and Meta Ads, using AI tools to move faster. |
| krish | Krish Khati | founders | Founder · Web Development and AI | Web development, Python, AI tools, Supabase, Automation | Builds web apps and AI-powered tools with Python and modern AI APIs. |
| neelam | Neelam Dhiman | team | Team Member · Websites, Social and Video | HTML/CSS/JavaScript, YouTube SEO, Social media, Video editing, Python automation | Builds responsive websites and small automation tools, and helps with YouTube SEO, social media and video. |
| jyoti | Jyoti | team | Team Member · Video Editor | Video editing | Edits the videos for Nexlane's YouTube and Instagram. |

`portfolioUrl` (optional, add only after each person agrees to be linked): Rachit https://rachitportfolio-rouge.vercel.app/ , Krish https://krish-portfolio-dev.vercel.app/ , Neelam https://neelamdhiman.vercel.app/ , Jyoti none. Leave all four empty with a TODO until the owner confirms.

Personal projects (up to 3 each, label: "Personal project by <name>, not Nexlane client work"):

- Rachit: Fitness Website https://github.com/Rachit-Sharma08/Fitness-website ; Neon Car Racing https://github.com/Rachit-Sharma08/neon-car-racing-game- ; AI Assistant Chatbot https://github.com/Rachit-Sharma08/ai-assistant
- Krish: Fitness Temple https://krish-portfolio-dev.vercel.app/projects/fitness-temple ; LinguaBridge https://krish-portfolio-dev.vercel.app/projects/linguabridge ; Memory Match Game https://krish-portfolio-dev.vercel.app/projects/memory-match-game
- Neelam: Calc Notebook https://calcnotebook.vercel.app ; Socratic Math Mentor https://socratic-math-mentor.vercel.app ; Rasoi Mitra https://rasoi-mitra-recipe.onrender.com/
- Jyoti: none. Do not invent any.

Bios must not mention age, class, school or college. Do not copy those details from the people's own sites.

### Our Work empty state (draft copy, edit lightly)

- Eyebrow `OUR WORK`, H1 "Our Work".
- Intro: "Nexlane is new, and we have not delivered client projects yet. We would rather show you nothing than something made up. Our first client projects will be listed here, with each client's permission."
- Section "While you wait": two cards linking to `/about/founders` and `/about/team`: "See what our founders build on their own" and "See what our team members build on their own", each with the note "Personal projects, not Nexlane client work".
- Section "Be one of our first clients": one short paragraph and the button "Get a Free Audit". No discounts, prices or promises.

## Stage B: design system and orientation (branch `feat/design-system`)

1. Install and set up shadcn, `motion`, Magic UI and unlumen UI exactly as their docs say. Keep the CSP working.
2. Tokens, spacing and typography; layout primitives (`Container`, `Section`, `Eyebrow`).
3. `MotionConfig reducedMotion="user"` at the root.
4. Navbar active indicator that slides between items (unlumen's navigation menu if it fits, otherwise a small custom one with `layoutId`), parent dropdown highlighted on child pages, click and keyboard dropdowns.
5. Scroll progress bar, `SectionNav` (scroll-spy, sticky pills on desktop, chips on mobile), `NextUp` card, page eyebrow.
6. Gate and PR. Report the CSP console check.

## Stage C: Home redesign (branch `feat/home-redesign`)

Rebuild the Home page sections with motion, keeping the same honest content:

- Hero: layered gradient and grid or glow background, headline text reveal, shimmer or glow CTA, the logo with a soft glow. One hero-level effect only.
- What we do: bento-style grid with a hover spotlight or border effect (4 cards: Web Development, SEO, Game Development, Learn with us).
- Facts strip, using only true facts (4-person team, based in Kaithal, Haryana, web + SEO + video under one roof, free audit). Optionally a slow marquee of tools we really use.
- Why Nexlane, then How we work (5 steps) as an animated timeline or beam, with blur-fade on scroll.
- "Our Work" teaser that says the first projects are coming (no fake items), then the final CTA, "Next up", and the footer.

## Stage D: inner pages (branch `feat/pages-polish`)

Apply the same system to About hub, Founders, Team (profile cards with a subtle hover or tilt effect), Services (3 detail pages), Learn (4 pages), Our Work, Audit and Contact shells, Terms, Privacy, 404. Every page gets the eyebrow, correct breadcrumb or none, scroll progress and "Next up". Long pages get `SectionNav`. Fill empty vertical space: no page should be a few lines followed by a huge blank area.

## Stage E: QA (branch `feat/qa`)

- Test with reduced motion on, and at 360 px width.
- Run a production build, then Lighthouse (mobile) on the main pages. Report the real numbers and do not round them up.
- Browser console: no CSP "Refused to..." errors.
- `npm audit`. Update `docs/PROGRESS.md` (built, left, TODO, components used).

## Grep checks to run at the end of every stage

```
git grep -nE "[6-9][0-9]{9}" -- src
git grep -nEi "class 12|bba|college|school of|years of experience|testimonial|guarantee|10x" -- src
git grep -nEi "tagore" -- src
```

The first should be empty, the second should have no hits on team or about pages, and the third should be empty on the public site (keep Tagore only in `docs/PROGRESS.md`).

## How to report each stage

Files added and changed, the output of `git status`, `tsc`, `lint`, `build`, the PR link, the screenshots folder path, and a list of anything you could not test or did not finish.
