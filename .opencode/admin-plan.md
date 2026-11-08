# Admin panel plan (owner: "/admin panel karna hai")

Goal: password-protected `/admin` where the owner creates/edits blog posts (incl. drafts)
without touching code. Backend allowed (AGENTS §1). Max 2 subagents, sequential (shared API
contract), separate file ownership.

## Architecture (decided)

- **Storage:** `src/content/blog.json` = source of truth (committed). `src/content/blog.ts`
  keeps types + `notDraft/getPost/readingTime` helpers, imports the JSON (zero caller changes —
  all 4 importers use helpers). Save = file write; **live only after redeploy** (static import) —
  UI must say "saved — takes effect on next deploy". Dev server hot-reloads it.
- **Auth:** single env `ADMIN_PASSWORD`. Stateless signed cookie `nexlane_admin` =
  `<expUnix>.<base64url HMAC-SHA256(sessionKey, "admin:"+exp)>`, sessionKey =
  SHA-256("nexlane-admin-session-v1:" + ADMIN_PASSWORD). httpOnly, SameSite=Lax, Secure in prod,
  Max-Age 7d. Change password to revoke all sessions. No server session store (serverless-safe).
- **Middleware** `src/middleware.ts` (edge): matchers `/admin/:path*`, `/api/admin/:path*`;
  valid cookie → pass, else redirect `/admin/login` (pages) / 401 JSON (API).
  Verify via `crypto.subtle` HMAC + constant-time compare.
- **Login rate limit:** in-memory per-IP, 5 attempts / 15 min in the login route (node runtime).
  Documented limitation (Vercel WAF `/api/*` rule = phase 2, AGENTS §10).
- **Audit:** append `{ts, action, ip?}` lines to `data/admin-audit.log` (gitignored) on
  login success/fail, create/update/delete.
- **robots:** ON branch gets `Disallow: /admin` BEFORE `Allow: /` in every group (correct for
  both first-match and longest-match parsers); admin pages metadata `robots: {index:false}`
  always; `/admin` never in sitemap.

## Security requirements (non-negotiable)

- Wrong/missing env `ADMIN_PASSWORD` → login route 503 "not configured", never a default password.
- Constant-time password compare (`node:crypto` timingSafeEqual on SHA-256 digests).
- Server-side validation of every post field (trust nothing from client): slug `^[a-z0-9-]+$`
  + unique, title ≤200, description ≤300, category nonempty, date `YYYY-MM-DD`, author must be a
  real name from `site.team`, `draft` boolean, blocks: type ∈ {p,h,list,quote}, text ≤5000,
  list ≤50 items, ≤100 blocks total.
- Atomic file write (tmp + rename). JSON body errors → 400, never stack traces (prod).
- Cookie flags httpOnly/SameSite; API returns 401 JSON when unauthenticated.

## API contract (backend agent implements; UI agent consumes)

- `POST /api/admin/login` `{password}` → 200 `{ok:true}` + Set-Cookie | 401 `{error}` | 429 `{error}` | 503 `{error}`
- `POST /api/admin/logout` → 200 `{ok:true}`
- `GET /api/admin/me` → 200 `{authenticated:true}` | 401
- `GET /api/admin/posts` → `{posts: BlogPost[]}`
- `POST /api/admin/posts` (BlogPost) → 201 `{post}` | 400 `{error}` | 409 `{error}`
- `PUT /api/admin/posts/[slug]` → 200 `{post}` | 400/404 `{error}`
- `DELETE /api/admin/posts/[slug]` → 200 `{ok:true}` | 404 `{error}`
- BlogPost = existing type (slug,title,description,category,date,author,draft,content:BlogBlock[])

## File ownership

**Wave A (backend agent):**
- `src/lib/admin-auth.ts` (sign/verify session, rate limit helpers), `src/middleware.ts`
- `src/app/api/admin/**` (login, logout, me, posts CRUD)
- `src/content/blog.json` (migrated from current blogPosts), slim `src/content/blog.ts`
- `src/app/robots.ts` (Disallow /admin), `src/app/admin/**` metadata-only placeholder NOT needed (B owns)
- `.env.example` (+ADMIN_PASSWORD), `.gitignore` (+data/*.log), `tests/admin-auth.test.ts`

**Wave B (UI agent):**
- `src/app/admin/**` only: `page.tsx` (dashboard: post list, new, delete, logout),
  `login/page.tsx`, `posts/new/page.tsx`, `posts/[slug]/page.tsx` (editor incl. simple block
  editor: type select + textarea, move up/down, remove, add block), shared client components.
- Uses existing tokens/components (globals.css vars, `btn`, Container). Private UI — functional,
  not showy. noindex metadata.

## Done criteria (both waves)

1. `npx tsc --noEmit`, `npm run lint`, `npm test`, `npm run build` all exit 0.
2. Playwright (dev or prod server): wrong password → 401 message; right → dashboard; create post
   → appears in GET /api/admin/posts and in `src/content/blog.json`; rebuild → visible on
   `/learn/blog`; logout → API 401; unauthenticated `/admin` → redirected to login.
3. robots.txt (index mode) contains `Disallow: /admin`; (noindex mode) still fully disallowed.
4. Screenshots `/admin` (login + dashboard) at 1440/768/360 with `reduced_motion='reduce'` → `screenshots/`.
5. `docs/PROGRESS.md` stage note + owner checklist: set `ADMIN_PASSWORD` in Vercel env, redeploy
   after admin edits.
